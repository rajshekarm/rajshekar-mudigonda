import { Link } from "react-router-dom";

import type { BlogArticle } from "../../types/blog";
import ArticleMeta from "./ArticleMeta";

type Props = {
  article: BlogArticle;
};

export default function FeaturedArticle({ article }: Props) {
  return (
    <section className="pb-12 pt-2">

      <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
        Featured
      </div>

      <Link
        to={`/blogs/${article.slug}`}
        className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.15fr_0.85fr]"
      >

        <div className="min-h-[320px] overflow-hidden bg-slate-100 lg:min-h-[450px]">
          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">

          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-indigo-600">
            {article.category}
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {article.title}
          </h2>

          {article.subtitle && (
            <p className="mt-3 text-lg leading-7 text-slate-700">
              {article.subtitle}
            </p>
          )}

          <p className="mt-5 leading-7 text-slate-600">
            {article.excerpt}
          </p>

          <div className="mt-7">
            <ArticleMeta article={article} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 inline-flex items-center gap-2 font-semibold">
            Read article
            <span className="transition group-hover:translate-x-1">
              →
            </span>
          </div>

        </div>

      </Link>

    </section>
  );
}
