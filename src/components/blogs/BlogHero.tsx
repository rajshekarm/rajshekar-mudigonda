import { Link } from "react-router-dom";

export default function BlogHero() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 to-white">
      <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8 lg:py-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="min-w-0 flex-1">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600">
              Community Blogs
            </span>

            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-normal text-slate-950 lg:text-4xl xl:whitespace-nowrap">
              Ideas, experiments, and lessons from builders.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Read practical articles about AI agents, software engineering,
              Python, architecture, and production systems.
            </p>
          </div>

          <Link
            to="/blogs/new"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span>✎</span>
            Write an Article
          </Link>

        </div>
      </div>
    </section>
  );
}
