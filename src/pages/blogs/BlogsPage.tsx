import { useEffect, useMemo, useState } from "react";

import BlogHero from "../../components/blogs/BlogHero";
import BlogToolbar from "../../components/blogs/BlogToolbar";
import FeaturedArticle from "../../components/blogs/FeaturedArticle";
import ArticleGrid from "../../components/blogs/ArticleGrid";
import WriteArticleCTA from "../../components/blogs/WriteArticleCTA";

import { blogArticles } from "../../data/blogArticle";
import {
  fetchPublishedBlogs,
  toBlogArticle,
} from "../../api/blogEditor";
import type { BlogArticle } from "../../types/blog";

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [articles, setArticles] = useState<BlogArticle[]>(blogArticles);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchPublishedBlogs()
      .then((storedBlogs) => {
        if (!active) return;

        const storedArticles = storedBlogs.map(toBlogArticle);
        const storedSlugs = new Set(storedArticles.map((article) => article.slug));
        setArticles([
          ...storedArticles,
          ...blogArticles.filter((article) => !storedSlugs.has(article.slug)),
        ]);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Stored blogs could not be loaded.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          articles.map(
            (article) => article.category,
          ),
        ),
      ),
    ];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return articles.filter((article) => {
      const categoryMatches =
        category === "All" ||
        article.category === category;

      const searchableText = [
        article.title,
        article.subtitle,
        article.excerpt,
        article.category,
        article.tags.join(" "),
        article.author.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatches =
        !query ||
        searchableText.includes(query);

      return categoryMatches && searchMatches;
    });
  }, [articles, search, category]);

  const featuredArticle =
    articles.find(
      (article) => article.featured,
    );

  const showFeatured =
    featuredArticle &&
    search.length === 0 &&
    category === "All";

  const regularArticles = showFeatured
    ? filteredArticles.filter(
        (article) => article.id !== featuredArticle.id,
      )
    : filteredArticles;

  return (
    <main className="min-h-screen bg-white text-slate-900">

      <BlogHero />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <BlogToolbar
          search={search}
          category={category}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />

        {loadError && (
          <p className="mt-4 text-sm text-amber-700">
            The local API is unavailable. Showing sample articles only.
          </p>
        )}

        {showFeatured && (
          <FeaturedArticle
            article={featuredArticle}
          />
        )}

        <section className="pb-20 pt-12">

          <div className="mb-8 flex items-end justify-between">

            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-600">
                Latest Articles
              </span>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Explore the community
              </h2>
            </div>

            <span className="hidden text-sm text-slate-400 sm:block">
              {filteredArticles.length} articles
            </span>

          </div>

          <ArticleGrid
            articles={regularArticles}
          />

        </section>

        <WriteArticleCTA />

      </div>

    </main>
  );
}
