import { notFound } from "next/navigation";
import { LogoMark, Logo } from "@/components/layout/Logo";
import { Accordion } from "@/components/ui/Accordion";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { Bento, BentoTile } from "@/components/ui/Bento";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BuildLog } from "@/components/ui/BuildLog";
import { Button } from "@/components/ui/Button";
import { Chip, ChipList } from "@/components/ui/Chip";
import { ComparisonMatrix } from "@/components/ui/ComparisonMatrix";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { EditorialList } from "@/components/ui/EditorialList";
import { FileTree } from "@/components/ui/FileTree";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { FieldError, HelperText, Label } from "@/components/ui/form/Field";
import { FileDrop } from "@/components/ui/form/FileDrop";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { PullQuote } from "@/components/ui/PullQuote";
import { ScrollSnapRow } from "@/components/ui/ScrollSnapRow";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StackMap } from "@/components/ui/StackMap";
import { StatusDot, type StatusKind } from "@/components/ui/StatusDot";
import { StickyScrollStory } from "@/components/ui/StickyScrollStory";
import { Tabs } from "@/components/ui/Tabs";
import { buildMetadata } from "@/lib/seo";
import { ModalDemo, ToastDemo, WizardDemo } from "./Demos";

export const metadata = buildMetadata({ title: "UI Showcase", path: "/dev/ui", noIndex: true });

// Class names are listed literally so Tailwind can see them.
const swatches = [
  { token: "--night-950", className: "bg-night-950" },
  { token: "--night-900", className: "bg-night-900" },
  { token: "--night-800", className: "bg-night-800" },
  { token: "--dusk-700", className: "bg-dusk-700" },
  { token: "--lamp-500", className: "bg-lamp-500" },
  { token: "--lamp-400", className: "bg-lamp-400" },
  { token: "--lamp-700", className: "bg-lamp-700" },
  { token: "--lamp-800", className: "bg-lamp-800" },
  { token: "--ember-500", className: "bg-ember-500" },
  { token: "--starlight", className: "bg-starlight" },
  { token: "--ivory-50", className: "bg-ivory-50" },
  { token: "--sand-100", className: "bg-sand-100" },
  { token: "--ink-900", className: "bg-ink-900" },
  { token: "--ink-600", className: "bg-ink-600" },
  { token: "--mist-300", className: "bg-mist-300" },
  { token: "--line", className: "bg-line" },
  { token: "--success", className: "bg-success" },
  { token: "--danger", className: "bg-danger" },
];

const statuses: StatusKind[] = [
  "available",
  "limited",
  "booked",
  "live",
  "in-development",
  "concept",
];

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-8">
      <p className="label-mono text-accent">{title}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Development-only showcase of every component variant. 404 in production builds. */
export default function UiShowcasePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Section tone="night" underHeader className="overflow-hidden pt-[calc(var(--header-h)+4rem)]">
        <CursorGlow />
        <SectionHeader
          as="h1"
          label="Skylamp UI"
          title="Every part of the kit, in one place"
          emphasis="one place"
          intro="Night and paper tones, lamp accents, hairlines."
        />
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <LogoMark tone="dark" className="size-16" />
          <Logo tone="dark" />
          <Logo tone="dark" subline={false} />
          <Logo tone="dark" variant="mark" />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button>Flame</Button>
          <Button variant="outline">Outline on night</Button>
          <Button variant="text-link" href="/dev/ui">
            Text link
          </Button>
        </div>
      </Section>

      <Section tone="ivory">
        <div className="space-y-14">
          <Demo title="Colour tokens">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {swatches.map((swatch) => (
                <li key={swatch.token}>
                  <span
                    className={`block h-14 rounded-card border border-rule ${swatch.className}`}
                  />
                  <span className="mt-1.5 block font-mono text-xs">{swatch.token}</span>
                </li>
              ))}
            </ul>
          </Demo>

          <Demo title="Type scale">
            <p className="font-display-soft text-h1">
              Heading one <em className="headline">italic</em>
            </p>
            <p className="mt-4 font-display-soft text-h2">Heading two</p>
            <p className="mt-4 font-display-soft text-h3">Heading three</p>
            <p className="mt-4 text-body">Body copy in Manrope, 17px over 1.7 line height.</p>
            <p className="mt-2 label-mono text-accent">(01) Mono label</p>
          </Demo>

          <Demo title="Buttons on ivory">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Flame sm</Button>
              <Button>Flame md</Button>
              <Button size="lg">Flame lg</Button>
              <Button variant="solid-ink">Solid ink</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="text-link" href="/dev/ui">
                Text link
              </Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Demo>

          <Demo title="Section header">
            <SectionHeader
              index={3}
              label="How a project runs"
              title="A heading with an emphasised phrase"
              emphasis="emphasised phrase"
              intro="An intro paragraph sits in the narrower right column on desktop."
            />
          </Demo>

          <Demo title="Status dots, chips, breadcrumb, placeholder">
            <div className="flex flex-wrap gap-6">
              {statuses.map((status) => (
                <StatusDot key={status} status={status} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>Next.js</Chip>
              <ChipList items={["Docker", "PostgreSQL"]} />
            </div>
            <Breadcrumb
              className="mt-6"
              jsonLd={false}
              items={[{ label: "Home", href: "/" }, { label: "Dev" }]}
            />
            <p className="mt-4">
              Unfilled: <PlaceholderText text="[EMAIL]" />
            </p>
          </Demo>

          <Demo title="Accordion">
            <Accordion
              items={[
                { question: "First question?", answer: "First answer." },
                { question: "Second question?", answer: "Second answer." },
              ]}
            />
          </Demo>

          <Demo title="Form controls">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="ui-input" required>
                  Input
                </Label>
                <Input id="ui-input" placeholder="Placeholder" />
                <HelperText>Helper text.</HelperText>
              </div>
              <div>
                <Label htmlFor="ui-error">Invalid</Label>
                <Input id="ui-error" invalid aria-describedby="ui-error-msg" defaultValue="x" />
                <FieldError id="ui-error-msg">An error message.</FieldError>
              </div>
              <div>
                <Label htmlFor="ui-select">Select</Label>
                <Select id="ui-select" defaultValue="a">
                  <option value="a">Option A</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="ui-text">Textarea</Label>
                <Textarea id="ui-text" maxLength={200} />
              </div>
              <Checkbox id="ui-check" label="A checkbox" />
              <FileDrop id="ui-file" name="file" accept=".pdf" maxSizeMB={5} />
            </div>
          </Demo>

          <Demo title="Form wizard (selectable cards, segmented control, choice chips, toggle)">
            <div className="max-w-2xl">
              <WizardDemo />
            </div>
          </Demo>

          <Demo title="Tabs, modal, toast">
            <Tabs
              label="Demo tabs"
              items={[
                { id: "a", label: "First", content: <p>First panel.</p> },
                { id: "b", label: "Second", content: <p>Second panel.</p> },
              ]}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ModalDemo />
              <ToastDemo />
            </div>
          </Demo>

          <Demo title="Bento">
            <Bento
              areas={{ base: '"a" "b" "c"', md: '"a b" "c c"', lg: '"a a b" "c c b"' }}
              columns={{ lg: "repeat(3, minmax(0, 1fr))" }}
            >
              <BentoTile area="a">
                <p className="text-h3">Tile A</p>
              </BentoTile>
              <BentoTile area="b" tone="night">
                <p className="text-h3">Night tile</p>
              </BentoTile>
              <BentoTile area="c">
                <p className="text-h3">Tile C</p>
              </BentoTile>
            </Bento>
          </Demo>

          <Demo title="Editorial list">
            <EditorialList
              layout="wide"
              items={[
                { title: "A first row", text: "With some text." },
                { title: "A second row", text: "And more.", meta: "meta line" },
              ]}
            />
          </Demo>

          <Demo title="Arch frame and pull quote">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <ArchFrame
                src="/images/founder-placeholder.svg"
                alt="Placeholder portrait"
                width={480}
                height={600}
                unoptimized
                className="max-w-xs"
              >
                <StatusDot status="available" label="Available for new projects" />
              </ArchFrame>
              <PullQuote
                label="Demo quotes"
                items={[
                  {
                    quote: "A sample quote for the showcase only.",
                    name: "Sample Name",
                    role: "Role",
                    company: "Company",
                  },
                  {
                    quote: "A second sample quote.",
                    name: "Another Name",
                    role: "Role",
                    company: "Company",
                  },
                ]}
              />
            </div>
          </Demo>
        </div>
      </Section>

      <Section tone="sand">
        <div className="space-y-14">
          <Demo title="Stack map">
            <StackMap
              bands={[
                {
                  id: "ui",
                  label: "Interface",
                  note: "What people touch.",
                  chips: ["React", "Next.js"],
                },
                {
                  id: "api",
                  label: "Logic & APIs",
                  note: "Rules and data flow.",
                  chips: ["Node.js", "FastAPI"],
                },
              ]}
            />
          </Demo>
          <Demo title="Comparison matrix">
            <ComparisonMatrix
              id="demo-matrix"
              criteriaLabel="Compared on"
              data={{
                caption: "Demo comparison",
                intro: "",
                note: "Demo note.",
                columns: ["Option one", "Option two"],
                rows: [
                  {
                    label: "Speed",
                    cells: [
                      { status: "yes", text: "Fast" },
                      { status: "partial", text: "Depends" },
                    ],
                  },
                  {
                    label: "Cost",
                    cells: [
                      { status: "yes", text: "Low" },
                      { status: "no", text: "High" },
                    ],
                  },
                ],
              }}
            />
          </Demo>
        </div>
      </Section>

      <Section tone="night">
        <div className="space-y-14">
          <Demo title="Build log and file tree">
            <div className="grid gap-8 md:grid-cols-2">
              <BuildLog lines={["→ first line", "→ second line", "→ third line"]} />
              <FileTree
                label="demo/"
                tree={[
                  {
                    name: "demo/",
                    children: [
                      { name: "app/", note: "an explanation" },
                      { name: "README.md", note: "another note" },
                    ],
                  },
                ]}
              />
            </div>
          </Demo>
          <Demo title="Scroll-snap row">
            <ScrollSnapRow label="Demo row">
              {[1, 2, 3, 4].map((n) => (
                <li key={n} className="rounded-card border border-rule p-6">
                  Card {n}
                </li>
              ))}
            </ScrollSnapRow>
          </Demo>
          <Demo title="Sticky scroll story">
            <StickyScrollStory
              outlineLabel="Demo steps"
              intro={<p className="text-h3">A sticky intro</p>}
              steps={[1, 2, 3].map((n) => ({
                id: `demo-step-${n}`,
                title: `Step ${n}`,
                content: <p className="text-fg-muted">Panel {n}.</p>,
              }))}
            />
          </Demo>
          <p className="text-small text-fg-muted">
            ScrollProgressRing, ContactDock and CornerCard are site-wide: see the bottom corners.
          </p>
        </div>
      </Section>
    </>
  );
}
