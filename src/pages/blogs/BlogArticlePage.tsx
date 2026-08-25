import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import BlogRenderer from "../../components/blog-renderer/BlogRenderer";

import type { BlogDraft } from "../../types/blogEditor";
import { fetchPublishedBlog } from "../../api/blogEditor";

const mockArticles: Record<string, BlogDraft> = {
  "llm-critical-tool-calling": {
    id: "article-1",

    title: "When an LLM Refuses to Call a Critical Tool",

    subtitle:
      "How to design reliable AI agents when tool execution has real business impact.",

    excerpt:
      "Production AI agents need deterministic controls around critical business operations.",

    coverImage:
      "https://placehold.co/1400x700/0f172a/ffffff?text=Production+AI+Agents",

    author: "Alex Morgan",

    tags: [
      "AI Agents",
      "LLM",
      "Architecture",
      "Python",
    ],

    sections: [
      {
        id: "section-1",

        heading: "",

        subheading: "",

        blocks: [
          {
            id: "block-1",
            type: "paragraph",
            data: {
              text:
                "Most AI agent tutorials make tool calling look simple. Give the LLM a set of tools and allow it to decide what should happen.",
            },
          },

          {
            id: "block-2",
            type: "callout",
            data: {
              title: "The important question",
              text:
                "What happens if the LLM decides not to call a tool that is mandatory for the business process?",
            },
          },
        ],
      },

      {
        id: "section-2",

        heading:
          "LLM Reasoning and Business Control",

        subheading:
          "The model can reason probabilistically while your application enforces deterministic rules.",

        blocks: [
          {
            id: "block-3",

            type: "paragraph",

            data: {
              text:
                "The LLM is useful for understanding intent, extracting parameters, and explaining results. Critical business rules should remain under application control.",
            },
          },

          {
            id: "block-4",

            type: "comparison",

            data: {
              leftTitle: "LLM",
              leftText:
                "Probabilistic reasoning, language understanding, planning, and flexible decisions.",

              rightTitle: "Application",
              rightText:
                "Permissions, validations, transactions, invariants, and mandatory business rules.",
            },
          },
        ],
      },

      {
        id: "section-3",

        heading:
          "Parallel Tool Execution",

        subheading:
          "Mandatory independent checks can run concurrently.",

        blocks: [
          {
            id: "block-5",

            type: "code",

            data: {
              language: "python",

              code: `balance, fraud, account = await asyncio.gather(
    check_balance(customer_id),
    check_fraud_score(customer_id),
    check_account_status(customer_id),
)`,
            },
          },

          {
            id: "block-6",

            type: "tip",

            data: {
              title: "Design principle",

              text:
                "Use the LLM for intelligence. Use your application for guarantees.",
            },
          },
        ],
      },
    ],
  },
};

export default function BlogArticlePage() {
  const { slug } = useParams();

  const [article, setArticle] = useState<BlogDraft | undefined>(() =>
    slug ? mockArticles[slug] : undefined,
  );
  const [loading, setLoading] = useState(Boolean(slug && !mockArticles[slug]));

  useEffect(() => {
    let active = true;

    if (!slug) {
      setArticle(undefined);
      setLoading(false);
      return;
    }

    setArticle(mockArticles[slug]);
    setLoading(!mockArticles[slug]);

    fetchPublishedBlog(slug)
      .then((storedArticle) => {
        if (active) setArticle(storedArticle);
      })
      .catch(() => {
        if (active) setArticle(mockArticles[slug]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-slate-500">
        Loading article...
      </main>
    );
  }

  if (!article) {
    return <BlogNotFound />;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          ← All Articles
        </Link>
      </div>

      <div className="px-6 pb-24 lg:px-8">
        <BlogRenderer article={article} />
      </div>
    </main>
  );
}

function BlogNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6">
      <div className="text-center">
        <div className="text-sm font-bold uppercase tracking-wider text-indigo-600">
          404
        </div>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
          Article not found
        </h1>

        <p className="mt-4 text-slate-500">
          The article may have been removed or the URL is incorrect.
        </p>

        <Link
          to="/blogs"
          className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Browse Articles
        </Link>
      </div>
    </main>
  );
}
