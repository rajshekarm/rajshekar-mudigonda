from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .models import BlogRecord
from .repository import BlogRepository


BLOCK_TYPES = {
    "paragraph",
    "image",
    "code",
    "quote",
    "callout",
    "tip",
    "warning",
    "comparison",
    "steps",
    "faq",
    "divider",
}
STATUSES = {"draft", "published"}


class BlogValidationError(ValueError):
    pass


class BlogNotFoundError(LookupError):
    pass


def require_string(value: Any, field: str, *, allow_empty: bool = False) -> str:
    if not isinstance(value, str):
        raise BlogValidationError(f"'{field}' must be a string")

    result = value.strip()
    if not allow_empty and not result:
        raise BlogValidationError(f"'{field}' is required")
    return result


def clean_tags(value: Any) -> list[str]:
    if not isinstance(value, list) or any(not isinstance(tag, str) for tag in value):
        raise BlogValidationError("'tags' must be an array of strings")
    return [tag.strip() for tag in value if tag.strip()]


def clean_sections(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        raise BlogValidationError("'sections' must be an array")

    sections: list[dict[str, Any]] = []
    for section_index, section in enumerate(value):
        if not isinstance(section, dict):
            raise BlogValidationError(f"Section {section_index + 1} must be an object")

        blocks = section.get("blocks", [])
        if not isinstance(blocks, list):
            raise BlogValidationError(f"Section {section_index + 1} blocks must be an array")

        clean_blocks: list[dict[str, Any]] = []
        for block_index, block in enumerate(blocks):
            if not isinstance(block, dict):
                raise BlogValidationError(
                    f"Section {section_index + 1}, block {block_index + 1} must be an object"
                )

            block_type = block.get("type")
            if block_type not in BLOCK_TYPES:
                raise BlogValidationError(
                    f"Section {section_index + 1}, block {block_index + 1} has an invalid type"
                )
            if not isinstance(block.get("data"), dict):
                raise BlogValidationError(
                    f"Section {section_index + 1}, block {block_index + 1} data must be an object"
                )

            clean_blocks.append(
                {
                    "id": require_string(
                        block.get("id", str(uuid.uuid4())), "block.id"
                    ),
                    "type": block_type,
                    "data": block["data"],
                }
            )

        sections.append(
            {
                "id": require_string(
                    section.get("id", str(uuid.uuid4())), "section.id"
                ),
                "heading": require_string(
                    section.get("heading", ""), "section.heading", allow_empty=True
                ),
                "subheading": require_string(
                    section.get("subheading", ""),
                    "section.subheading",
                    allow_empty=True,
                ),
                "blocks": clean_blocks,
            }
        )
    return sections


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or f"blog-{uuid.uuid4().hex[:8]}"


def calculate_reading_time(blog: BlogRecord) -> int:
    words: list[str] = []
    for value in (blog.title, blog.subtitle, blog.excerpt):
        words.extend(value.split())
    for section in blog.sections:
        words.extend(str(section.get("heading", "")).split())
        words.extend(str(section.get("subheading", "")).split())
        for block in section.get("blocks", []):
            for value in block.get("data", {}).values():
                if isinstance(value, str):
                    words.extend(value.split())
    return max(1, (len(words) + 199) // 200)


class BlogService:
    def __init__(self, repository: BlogRepository) -> None:
        self.repository = repository

    def list_blogs(self) -> list[dict[str, Any]]:
        return [blog.to_dict() for blog in self.repository.list()]

    def get_blog(self, slug: str) -> dict[str, Any]:
        return self._get_record(slug).to_dict()

    def create_blog(self, payload: Any) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise BlogValidationError("Request body must be a JSON object")

        title = require_string(payload.get("title"), "title")
        tags = clean_tags(payload.get("tags", []))
        sections = clean_sections(payload.get("sections", []))
        requested_slug = payload.get("slug")
        base_slug = slugify(
            require_string(requested_slug, "slug") if requested_slug is not None else title
        )
        status = payload.get("status", "published")
        if status not in STATUSES:
            raise BlogValidationError("'status' must be 'draft' or 'published'")

        blog_id = require_string(payload.get("id", str(uuid.uuid4())), "id")
        if self.repository.id_exists(blog_id):
            blog_id = str(uuid.uuid4())

        now = datetime.now(timezone.utc)
        blog = BlogRecord(
            id=blog_id,
            slug=self._unique_slug(base_slug),
            title=title,
            subtitle=require_string(
                payload.get("subtitle", ""), "subtitle", allow_empty=True
            ),
            excerpt=require_string(
                payload.get("excerpt", ""), "excerpt", allow_empty=True
            ),
            cover_image=require_string(
                payload.get("coverImage", ""), "coverImage", allow_empty=True
            ),
            author=require_string(
                payload.get("author", ""), "author", allow_empty=True
            ),
            category=require_string(
                payload.get("category", tags[0] if tags else "General"), "category"
            ),
            status=status,
            tags=tags,
            sections=sections,
            featured=self._clean_boolean(payload.get("featured", False), "featured"),
            published_at=now,
            created_at=now,
            updated_at=now,
        )
        blog.reading_time = calculate_reading_time(blog)
        return self.repository.add(blog).to_dict()

    def update_blog(self, slug: str, payload: Any) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise BlogValidationError("Request body must be a JSON object")
        if not payload:
            raise BlogValidationError("At least one field is required")

        blog = self._get_record(slug)

        if "title" in payload:
            blog.title = require_string(payload["title"], "title")
        for json_name, attribute in (
            ("subtitle", "subtitle"),
            ("excerpt", "excerpt"),
            ("coverImage", "cover_image"),
            ("author", "author"),
        ):
            if json_name in payload:
                setattr(
                    blog,
                    attribute,
                    require_string(payload[json_name], json_name, allow_empty=True),
                )
        if "category" in payload:
            blog.category = require_string(payload["category"], "category")
        if "status" in payload:
            if payload["status"] not in STATUSES:
                raise BlogValidationError("'status' must be 'draft' or 'published'")
            blog.status = payload["status"]
        if "tags" in payload:
            blog.tags = clean_tags(payload["tags"])
            if "category" not in payload:
                blog.category = blog.tags[0] if blog.tags else "General"
        if "sections" in payload:
            blog.sections = clean_sections(payload["sections"])
        if "featured" in payload:
            blog.featured = self._clean_boolean(payload["featured"], "featured")

        blog.reading_time = calculate_reading_time(blog)
        blog.updated_at = datetime.now(timezone.utc)
        self.repository.session.flush()
        return blog.to_dict()

    def delete_blog(self, slug: str) -> None:
        self.repository.delete(self._get_record(slug))

    def import_legacy_json(self, path: Path) -> int:
        if self.repository.count() > 0 or not path.exists():
            return 0

        try:
            records = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            raise RuntimeError("Legacy blog storage contains invalid JSON") from error

        if not isinstance(records, list):
            raise RuntimeError("Legacy blog storage must contain a JSON array")

        imported = 0
        for record in records:
            self.create_blog(record)
            imported += 1
        return imported

    def _get_record(self, slug: str) -> BlogRecord:
        blog = self.repository.get_by_slug(slug)
        if blog is None:
            raise BlogNotFoundError("Blog not found")
        return blog

    def _unique_slug(self, base: str) -> str:
        if not self.repository.slug_exists(base):
            return base

        suffix = 2
        while self.repository.slug_exists(f"{base}-{suffix}"):
            suffix += 1
        return f"{base}-{suffix}"

    @staticmethod
    def _clean_boolean(value: Any, field: str) -> bool:
        if not isinstance(value, bool):
            raise BlogValidationError(f"'{field}' must be a boolean")
        return value
