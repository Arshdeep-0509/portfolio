import { FileTree } from "@/components/ui/FileTree";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { handoverKit } from "@/content/deliverables";

/** "The handover kit" on ivory: ownership on the left, the delivered files as a tree on the right. */
export function HandoverKit({ index, id = "handover" }: { index: number; id?: string }) {
  return (
    <Section id={id} tone="ivory" aria-labelledby="handover-title">
      <SectionHeader
        id="handover-title"
        index={index}
        label={handoverKit.label}
        title={handoverKit.title}
        emphasis={handoverKit.emphasis}
      />
      <div className="mt-14 grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="space-y-4 text-lg text-fg-muted">
            {handoverKit.ownership.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-8 border-t border-rule">
            {handoverKit.points.map((point) => (
              <li
                key={point}
                className="flex min-h-12 items-center gap-3 border-b border-rule font-semibold text-fg"
              >
                <span aria-hidden="true" className="size-1.5 rounded-dot bg-lamp-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <FileTree
          tree={handoverKit.tree}
          label={handoverKit.treeLabel}
          className="lg:col-span-6 lg:col-start-7"
        />
      </div>
    </Section>
  );
}
