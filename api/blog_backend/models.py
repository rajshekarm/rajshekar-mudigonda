from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, DateTime, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def to_iso(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.isoformat()


class BlogRecord(Base):
    __tablename__ = "blogs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    slug: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(300))
    subtitle: Mapped[str] = mapped_column(Text, default="")
    excerpt: Mapped[str] = mapped_column(Text, default="")
    cover_image: Mapped[str] = mapped_column(Text, default="")
    author: Mapped[str] = mapped_column(String(200), default="")
    category: Mapped[str] = mapped_column(String(100), default="General", index=True)
    status: Mapped[str] = mapped_column(String(20), default="published", index=True)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    sections: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    reading_time: Mapped[int] = mapped_column(Integer, default=1)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "subtitle": self.subtitle,
            "excerpt": self.excerpt,
            "coverImage": self.cover_image,
            "author": self.author,
            "category": self.category,
            "status": self.status,
            "tags": self.tags,
            "sections": self.sections,
            "readingTime": self.reading_time,
            "featured": self.featured,
            "publishedAt": to_iso(self.published_at),
            "createdAt": to_iso(self.created_at),
            "updatedAt": to_iso(self.updated_at),
        }
