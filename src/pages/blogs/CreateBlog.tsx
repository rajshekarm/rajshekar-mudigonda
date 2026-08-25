import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import ArticleMetaEditor from "../../components/blog-editor/ArticleMetaEditor";
import BlogPreview from "../../components/blog-editor/BlogPreview";
import SectionEditor from "../../components/blog-editor/SectionEditor";

import type {
  BlogDraft,
  BlogSection,
} from "../../types/blogEditor";

import {
  createId,
  createSection,
} from "../../utils/blogEditor";
import { createBlog } from "../../api/blogEditor";

const initialDraft: BlogDraft = {
  id: createId(),

  title: "",
  subtitle: "",
  excerpt: "",

  coverImage: "",

  author: "",
  tags: [],

  sections: [
    createSection(),
  ],
};

export default function CreateBlogPage() {
  const navigate = useNavigate();

  const [draft, setDraft] =
    useState<BlogDraft>(() => {
      const saved =
        localStorage.getItem(
          "blog-draft",
        );

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialDraft;
        }
      }

      return initialDraft;
    });

  const [mode, setMode] =
    useState<"write" | "preview">(
      "write",
    );
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(
      "blog-draft",
      JSON.stringify(draft),
    );
  }, [draft]);

  function addSection() {
    setDraft((current) => ({
      ...current,

      sections: [
        ...current.sections,
        createSection(),
      ],
    }));
  }

  function updateSection(
    id: string,
    nextSection: BlogSection,
  ) {
    setDraft((current) => ({
      ...current,

      sections:
        current.sections.map(
          (section) =>
            section.id === id
              ? nextSection
              : section,
        ),
    }));
  }

  function deleteSection(
    id: string,
  ) {
    setDraft((current) => ({
      ...current,

      sections:
        current.sections.filter(
          (section) =>
            section.id !== id,
        ),
    }));
  }

  function moveSection(
    id: string,
    direction: "up" | "down",
  ) {
    setDraft((current) => {
      const sections = [
        ...current.sections,
      ];

      const currentIndex =
        sections.findIndex(
          (section) =>
            section.id === id,
        );

      if (currentIndex < 0) {
        return current;
      }

      const nextIndex =
        direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;

      if (
        nextIndex < 0 ||
        nextIndex >= sections.length
      ) {
        return current;
      }

      [
        sections[currentIndex],
        sections[nextIndex],
      ] = [
        sections[nextIndex],
        sections[currentIndex],
      ];

      return {
        ...current,
        sections,
      };
    });
  }

  function clearDraft() {
    const confirmed =
      window.confirm(
        "Clear this draft?",
      );

    if (!confirmed) {
      return;
    }

    const freshDraft = {
      ...initialDraft,
      id: createId(),
      sections: [
        createSection(),
      ],
    };

    setDraft(freshDraft);

    localStorage.removeItem(
      "blog-draft",
    );
  }

  async function publish() {
    if (!draft.title.trim()) {
      setPublishError("Please add a title before publishing.");

      return;
    }

    setPublishing(true);
    setPublishError(null);

    try {
      const createdBlog = await createBlog(draft);
      localStorage.removeItem("blog-draft");
      navigate(`/blogs/${createdBlog.slug}`);
    } catch (error) {
      setPublishError(
        error instanceof Error
          ? error.message
          : "The blog could not be published.",
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* TOP BAR */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">

          <div className="flex items-center gap-4">
            <Link
              to="/blogs"
              className="text-sm font-medium text-slate-500 hover:text-slate-950"
            >
              ← Blogs
            </Link>

            <div className="hidden h-5 w-px bg-slate-200 sm:block" />

            <div>
              <div className="font-semibold text-slate-900">
                New Article
              </div>

              <div className="text-xs text-emerald-600">
                Autosaved locally
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <div className="hidden rounded-lg bg-slate-100 p-1 sm:flex">
              <button
                type="button"
                onClick={() =>
                  setMode("write")
                }
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  mode === "write"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Write
              </button>

              <button
                type="button"
                onClick={() =>
                  setMode("preview")
                }
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  mode === "preview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              type="button"
              onClick={clearDraft}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => void publish()}
              disabled={publishing}
              className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>

        </div>
      </header>

      {publishError && (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-center text-sm text-red-700">
          {publishError}
        </div>
      )}

      {/* MOBILE MODE */}

      <div className="border-b border-slate-200 bg-white px-6 py-3 sm:hidden">
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() =>
              setMode("write")
            }
            className={`rounded-lg py-2 text-sm ${
              mode === "write"
                ? "bg-white font-semibold shadow-sm"
                : "text-slate-500"
            }`}
          >
            Write
          </button>

          <button
            onClick={() =>
              setMode("preview")
            }
            className={`rounded-lg py-2 text-sm ${
              mode === "preview"
                ? "bg-white font-semibold shadow-sm"
                : "text-slate-500"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {mode === "write" ? (
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-10 lg:px-8">

          <ArticleMetaEditor
            draft={draft}
            onChange={setDraft}
          />

          <div className="space-y-7">
            {draft.sections.map(
              (
                section,
                index,
              ) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={index}
                  onChange={(
                    next,
                  ) =>
                    updateSection(
                      section.id,
                      next,
                    )
                  }
                  onDelete={() =>
                    deleteSection(
                      section.id,
                    )
                  }
                  onMoveUp={() =>
                    moveSection(
                      section.id,
                      "up",
                    )
                  }
                  onMoveDown={() =>
                    moveSection(
                      section.id,
                      "down",
                    )
                  }
                />
              ),
            )}
          </div>

          <button
            type="button"
            onClick={addSection}
            className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-white py-5 text-sm font-semibold text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          >
            + Add Section
          </button>

        </div>
      ) : (
        <div className="px-6 py-10 lg:px-8">
          <BlogPreview
            draft={draft}
          />
        </div>
      )}

    </main>
  );
}
