import { useState } from "react";
import type { BlogBlock } from "../../types/blogEditor";

type Props = {
  block: BlogBlock;
};

export default function RenderBlock({ block }: Props) {
  const { data } = block;

  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-lg leading-8 text-slate-700">
          {data.text}
        </p>
      );

    case "image":
      return (
        <ImageBlock
          src={data.src}
          alt={data.alt}
          caption={data.caption}
          size={data.size}
        />
      );

    case "code":
      return (
        <CodeBlock language={data.language} code={data.code} />
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-indigo-500 pl-6 text-xl font-medium leading-8 text-slate-800">
          {data.text}
        </blockquote>
      );

    case "callout":
      return (
        <InfoBox
          title={data.title}
          text={data.text}
          className="border-indigo-200 bg-indigo-50"
        />
      );

    case "tip":
      return (
        <InfoBox
          title={data.title}
          text={data.text}
          className="border-emerald-200 bg-emerald-50"
        />
      );

    case "warning":
      return (
        <InfoBox
          title={data.title}
          text={data.text}
          className="border-amber-200 bg-amber-50"
        />
      );

    case "comparison":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-lg font-bold text-slate-900">
              {data.leftTitle}
            </h4>

            <p className="mt-3 leading-7 text-slate-600">
              {data.leftText}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-lg font-bold text-slate-900">
              {data.rightTitle}
            </h4>

            <p className="mt-3 leading-7 text-slate-600">
              {data.rightText}
            </p>
          </div>
        </div>
      );

    case "steps":
      return (
        <div className="space-y-5">
          {String(data.items)
            .split("\n")
            .filter(Boolean)
            .map((step: string, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 font-bold text-indigo-600">
                  {index + 1}
                </div>

                <p className="pt-1 leading-7 text-slate-700">
                  {step}
                </p>
              </div>
            ))}
        </div>
      );

    case "faq":
      return (
        <div className="border-b border-slate-200 pb-6">
          <h4 className="text-lg font-bold text-slate-900">
            {data.question}
          </h4>

          <p className="mt-3 leading-7 text-slate-600">
            {data.answer}
          </p>
        </div>
      );

    case "divider":
      return <hr className="border-slate-200" />;

    default:
      return null;
  }
}

function ImageBlock({
  src,
  alt,
  caption,
  size,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  size?: string;
}) {
  if (!src) return null;

  const widthClass =
    size === "medium"
      ? "mx-auto max-w-xl"
      : size === "full"
        ? "w-full"
        : "mx-auto max-w-3xl";

  return (
    <figure className={widthClass}>
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full rounded-2xl object-cover"
      />

      {caption && (
        <figcaption className="mt-3 text-center text-sm text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CodeBlock({
  language,
  code,
}: {
  language?: string;
  code?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code ?? "");

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#b8d8ce] bg-[#f0f8f5]">
      <div className="flex items-center justify-between border-b border-[#c7e0d8] bg-[#e4f2ed] px-5 py-3">
        <span className="text-xs font-semibold text-[#32665a]">
          {language || "code"}
        </span>

        <button
          type="button"
          onClick={copyCode}
          className="text-xs font-semibold text-[#32665a] transition hover:text-[#173f36]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InfoBox({
  title,
  text,
  className,
}: {
  title?: string;
  text?: string;
  className: string;
}) {
  return (
    <aside className={`rounded-2xl border p-5 ${className}`}>
      {title && (
        <h4 className="font-bold text-slate-900">
          {title}
        </h4>
      )}

      {text && (
        <p className="mt-2 leading-7 text-slate-700">
          {text}
        </p>
      )}
    </aside>
  );
}
