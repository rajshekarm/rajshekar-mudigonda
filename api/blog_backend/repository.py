from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .models import BlogRecord


class BlogRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self) -> list[BlogRecord]:
        statement = select(BlogRecord).order_by(BlogRecord.created_at.desc())
        return list(self.session.scalars(statement))

    def get_by_slug(self, slug: str) -> BlogRecord | None:
        statement = select(BlogRecord).where(BlogRecord.slug == slug)
        return self.session.scalar(statement)

    def id_exists(self, blog_id: str) -> bool:
        statement = select(BlogRecord.id).where(BlogRecord.id == blog_id)
        return self.session.scalar(statement) is not None

    def slug_exists(self, slug: str) -> bool:
        statement = select(BlogRecord.slug).where(BlogRecord.slug == slug)
        return self.session.scalar(statement) is not None

    def count(self) -> int:
        return self.session.scalar(select(func.count()).select_from(BlogRecord)) or 0

    def add(self, blog: BlogRecord) -> BlogRecord:
        self.session.add(blog)
        self.session.flush()
        return blog

    def delete(self, blog: BlogRecord) -> None:
        self.session.delete(blog)
        self.session.flush()
