import type {
  BlogBlockType,
  BlogSection,
} from "../../types/blogEditor";

import {
  createBlock,
} from "../../utils/blogEditor";

import BlockEditor from "./BlockEditor";
import BlockPalette from "./BlockPalette";

type Props = {
  section: BlogSection;
  index: number;

  onChange: (
    section: BlogSection,
  ) => void;

  onDelete: () => void;

  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function SectionEditor({
  section,
  index,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  function addBlock(
    type: BlogBlockType,
  ) {
    onChange({
      ...section,
      blocks: [
        ...section.blocks,
        createBlock(type),
      ],
    });
  }

  function updateBlock(
    blockId: string,
    data: Record<string, any>,
  ) {
    onChange({
      ...section,

      blocks: section.blocks.map(
        (block) =>
          block.id === blockId
            ? {
                ...block,
                data: {
                  ...block.data,
                  ...data,
                },
              }
            : block,
      ),
    });
  }

  function deleteBlock(
    blockId: string,
  ) {
    onChange({
      ...section,

      blocks: section.blocks.filter(
        (block) =>
          block.id !== blockId,
      ),
    });
  }

  function moveBlock(
    blockId: string,
    direction: "up" | "down",
  ) {
    const blocks = [...section.blocks];

    const currentIndex =
      blocks.findIndex(
        (block) =>
          block.id === blockId,
      );

    if (currentIndex < 0) {
      return;
    }

    const nextIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      nextIndex < 0 ||
      nextIndex >= blocks.length
    ) {
      return;
    }

    [
      blocks[currentIndex],
      blocks[nextIndex],
    ] = [
      blocks[nextIndex],
      blocks[currentIndex],
    ];

    onChange({
      ...section,
      blocks,
    });
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Section {index + 1}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
          >
            ↑
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
          >
            ↓
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Delete Section
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Heading
            <span className="ml-2 font-normal text-slate-400">
              Optional
            </span>
          </label>

          <input
            value={section.heading ?? ""}
            onChange={(event) =>
              onChange({
                ...section,
                heading:
                  event.target.value,
              })
            }
            placeholder="Section heading"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-semibold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Subheading
            <span className="ml-2 font-normal text-slate-400">
              Optional
            </span>
          </label>

          <textarea
            rows={2}
            value={
              section.subheading ?? ""
            }
            onChange={(event) =>
              onChange({
                ...section,
                subheading:
                  event.target.value,
              })
            }
            placeholder="Short supporting text for this section"
            className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {section.blocks.map(
          (block) => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={(data) =>
                updateBlock(
                  block.id,
                  data,
                )
              }
              onDelete={() =>
                deleteBlock(block.id)
              }
              onMoveUp={() =>
                moveBlock(
                  block.id,
                  "up",
                )
              }
              onMoveDown={() =>
                moveBlock(
                  block.id,
                  "down",
                )
              }
            />
          ),
        )}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <BlockPalette
          onAdd={addBlock}
        />
      </div>
    </section>
  );
}
