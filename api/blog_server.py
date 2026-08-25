from __future__ import annotations

import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from blog_backend.database import DATABASE_URL, init_database, session_scope
from blog_backend.repository import BlogRepository
from blog_backend.service import BlogNotFoundError, BlogService, BlogValidationError


MAX_REQUEST_BYTES = 5 * 1024 * 1024
LEGACY_STORAGE_PATH = Path(__file__).parent / "storage" / "blogs.json"


class BlogHandler(BaseHTTPRequestHandler):
    server_version = "PersonalBlogs/2.0"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        route = self.blog_route()
        if route is None:
            self.send_json(404, {"error": "Route not found"})
            return

        try:
            with session_scope() as session:
                service = BlogService(BlogRepository(session))
                result = service.list_blogs() if route == "" else service.get_blog(route)
            self.send_json(200, result)
        except BlogNotFoundError as error:
            self.send_json(404, {"error": str(error)})
        except Exception as error:
            self.send_json(500, {"error": f"Database request failed: {error}"})

    def do_POST(self) -> None:
        if self.blog_route() != "":
            self.send_json(404, {"error": "Route not found"})
            return

        payload = self.read_json_body()
        if payload is None:
            return

        try:
            with session_scope() as session:
                result = BlogService(BlogRepository(session)).create_blog(payload)
            self.send_json(201, result)
        except BlogValidationError as error:
            self.send_json(422, {"error": str(error)})
        except Exception as error:
            self.send_json(500, {"error": f"Database request failed: {error}"})

    def do_PUT(self) -> None:
        slug = self.blog_route()
        if not slug:
            self.send_json(404, {"error": "Route not found"})
            return

        payload = self.read_json_body()
        if payload is None:
            return

        try:
            with session_scope() as session:
                result = BlogService(BlogRepository(session)).update_blog(slug, payload)
            self.send_json(200, result)
        except BlogValidationError as error:
            self.send_json(422, {"error": str(error)})
        except BlogNotFoundError as error:
            self.send_json(404, {"error": str(error)})
        except Exception as error:
            self.send_json(500, {"error": f"Database request failed: {error}"})

    def do_DELETE(self) -> None:
        slug = self.blog_route()
        if not slug:
            self.send_json(404, {"error": "Route not found"})
            return

        try:
            with session_scope() as session:
                BlogService(BlogRepository(session)).delete_blog(slug)
            self.send_response(204)
            self.end_headers()
        except BlogNotFoundError as error:
            self.send_json(404, {"error": str(error)})
        except Exception as error:
            self.send_json(500, {"error": f"Database request failed: {error}"})

    def blog_route(self) -> str | None:
        path = urlparse(self.path).path.rstrip("/")
        if path == "/api/blogs":
            return ""

        prefix = "/api/blogs/"
        if path.startswith(prefix):
            slug = unquote(path[len(prefix) :]).strip()
            return slug or None
        return None

    def read_json_body(self) -> Any | None:
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json(400, {"error": "Invalid Content-Length"})
            return None

        if content_length <= 0:
            self.send_json(400, {"error": "Request body is required"})
            return None
        if content_length > MAX_REQUEST_BYTES:
            self.send_json(413, {"error": "Request body exceeds 5 MB"})
            return None

        try:
            return json.loads(self.rfile.read(content_length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "Request body must contain valid JSON"})
            return None

    def send_json(self, status: int, payload: Any) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def migrate_legacy_storage() -> int:
    with session_scope() as session:
        return BlogService(BlogRepository(session)).import_legacy_json(LEGACY_STORAGE_PATH)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the personal blogs SQL API")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=8080, type=int)
    args = parser.parse_args()

    init_database()
    imported = migrate_legacy_storage()
    server = ThreadingHTTPServer((args.host, args.port), BlogHandler)
    print(f"Blog API listening at http://{args.host}:{args.port}/api/blogs")
    print(f"Database: {DATABASE_URL}")
    if imported:
        print(f"Imported {imported} blog(s) from {LEGACY_STORAGE_PATH}")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
