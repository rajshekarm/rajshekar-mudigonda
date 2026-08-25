import type { BlogSection } from "../../types/blogEditor";
import RenderBlock from "./RenderBlock";

type Props = {
  section: BlogSection;
};

export default function RenderSection({ section }: Props) {
  return (
    <section>
      {section.heading && (
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          {section.heading}
        </h2>
      )}

      {section.subheading && (
        <p className="mt-3 text-lg leading-8 text-slate-500">
          {section.subheading}
        </p>
      )}

      <div className="mt-7 space-y-7">
        {section.blocks.map((block) => (
          <RenderBlock key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}