import type { BlogArticle } from "../types/blog";
import type { BlogDraft } from "../types/blogEditor";

const BLOG_API_URL =
  import.meta.env.VITE_BLOG_API_URL ??
  "http://127.0.0.1:8080/api/blogs";

export type PublishedBlog = BlogDraft & {
  slug: string;
  category: string;
  status: "draft" | "published";
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
};

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : "The blog request failed.";
    throw new Error(message);
  }

  return data as T;
}

export async function createBlog(draft: BlogDraft): Promise<PublishedBlog> {
  const response = await fetch(BLOG_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(draft),
  });

  return readResponse<PublishedBlog>(response);
}

export async function fetchPublishedBlogs(): Promise<PublishedBlog[]> {
  const response = await fetch(BLOG_API_URL);
  return readResponse<PublishedBlog[]>(response);
}

export async function fetchPublishedBlog(slug: string): Promise<PublishedBlog> {
  const response = await fetch(`${BLOG_API_URL}/${encodeURIComponent(slug)}`);
  return readResponse<PublishedBlog>(response);
}

export async function updateBlog(
  slug: string,
  changes: Partial<BlogDraft> & {
    category?: string;
    status?: PublishedBlog["status"];
    featured?: boolean;
  },
): Promise<PublishedBlog> {
  const response = await fetch(`${BLOG_API_URL}/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  return readResponse<PublishedBlog>(response);
}

export async function deleteBlog(slug: string): Promise<void> {
  const response = await fetch(`${BLOG_API_URL}/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    await readResponse<never>(response);
  }
}

export function toBlogArticle(blog: PublishedBlog): BlogArticle {
  return {
    id: blog.id,
    title: blog.title,
    subtitle: blog.subtitle,
    excerpt: blog.excerpt || blog.subtitle || "Read the full article.",
    slug: blog.slug,
    category: blog.category,
    tags: blog.tags,
    author: {
      name: blog.author || "Anonymous",
    },
    publishedAt: blog.publishedAt,
    readingTime: blog.readingTime,
    coverImage: blog.coverImage,
    featured: blog.featured,
  };
}
