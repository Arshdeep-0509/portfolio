import { notFound } from "next/navigation";
import { ArrowRight, Calendar, MessageCircle, Send } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Chip, TechChip } from "@/components/ui/Chip";
import { IconTile } from "@/components/ui/IconTile";
import { Illustration } from "@/components/ui/Illustration";
import { Marquee } from "@/components/ui/Marquee";
import { NumberLabel } from "@/components/ui/NumberLabel";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tabs } from "@/components/ui/Tabs";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { PlaceholderText } from "@/components/ui/PlaceholderText";
import { SkillPillar } from "@/components/ui/cards/SkillPillar";
import { Timeline } from "@/components/ui/Timeline";
import { DeliverableCard } from "@/components/ui/cards/DeliverableCard";
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
import { GlassCard, MiniGlass } from "@/components/ui/cards/GlassCard";
import { InfoCard } from "@/components/ui/cards/InfoCard";
import { NumberedCard } from "@/components/ui/cards/NumberedCard";
import { ProcessStepCard } from "@/components/ui/cards/ProcessStepCard";
import { ProductCard } from "@/components/ui/cards/ProductCard";
import { TechCategoryCard } from "@/components/ui/cards/TechCategoryCard";
import { Checkbox } from "@/components/ui/form/Checkbox";
import { FieldError, HelperText, Label } from "@/components/ui/form/Field";
import { FileDrop } from "@/components/ui/form/FileDrop";
import { Input, Select } from "@/components/ui/form/Input";
import { Textarea } from "@/components/ui/form/Textarea";
import { buildMetadata } from "@/lib/seo";
import { ModalDemo, ToastDemo } from "./Demos";

export const metadata = buildMetadata({ title: "UI Showcase", path: "/dev/ui", noIndex: true });

// Class names are listed literally so Tailwind can see them.
const swatches = [
  { token: "--navy-950", className: "bg-navy-950" },
  { token: "--navy-900", className: "bg-navy-900" },
  { token: "--blue-800", className: "bg-blue-800" },
  { token: "--primary", className: "bg-primary" },
  { token: "--primary-hover", className: "bg-primary-hover" },
  { token: "--sky-400", className: "bg-sky-400" },
  { token: "--sky-200", className: "bg-sky-200" },
  { token: "--soft", className: "bg-soft" },
  { token: "--tint", className: "bg-tint" },
  { token: "--bg", className: "bg-bg" },
  { token: "--surface", className: "bg-surface" },
  { token: "--text", className: "bg-ink" },
  { token: "--muted", className: "bg-muted" },
  { token: "--subtle", className: "bg-subtle" },
  { token: "--border", className: "bg-border" },
  { token: "--amber-500", className: "bg-amber-500" },
  { token: "--success", className: "bg-success" },
  { token: "--success-strong", className: "bg-success-strong" },
  { token: "--danger", className: "bg-danger" },
];

const gradients = [
  { token: "--grad-hero", className: "bg-grad-hero" },
  { token: "--grad-cta", className: "bg-grad-cta" },
  { token: "--grad-section", className: "bg-grad-section" },
  { token: "--grad-footer", className: "bg-grad-footer" },
];

const faqItems = [
  {
    question: "How does a project start?",
    answer:
      "With a short discovery call to understand the goal, then a written scope and estimate.",
    label: "Process",
  },
  {
    question: "Can you work with my existing team?",
    answer:
      "Yes. I can slot into an existing codebase and workflow, or work white-label for an agency.",
    label: "Collaboration",
  },
  {
    question: "Who owns the code?",
    answer: "You do. Code, designs and accounts are handed over at the end of the engagement.",
    label: "Ownership",
  },
];

const steps = [
  { title: "Discover", text: "Goals, users and constraints." },
  { title: "Plan", text: "Scope, milestones and estimate." },
  { title: "Build", text: "Weekly demos on a staging link." },
  { title: "Launch", text: "Deploy, monitor and hand over." },
];

const milestones = [
  { meta: "[YEAR]", title: "[MILESTONE]", text: "[ADD REAL MILESTONE DESCRIPTION]" },
  { meta: "[YEAR]", title: "[MILESTONE]", text: "[ADD REAL MILESTONE DESCRIPTION]" },
  { meta: "[YEAR]", title: "[MILESTONE]", text: "[ADD REAL MILESTONE DESCRIPTION]" },
];

const tech = [
  "Next.js",
  "React",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "OpenAI API",
  "Figma",
];

export default function DevUiPage() {
  // Development-only component showcase. Returns 404 in production builds.
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Section background="gradient" padding="lg">
        <Badge variant="eyebrow-dark">Dev only · noindex</Badge>
        <SectionHeading
          as="h1"
          align="left"
          className="mt-5"
          title="UI component showcase"
          highlight="component"
          subtitle="Every primitive and variant, on light and dark backgrounds. Tab through the page to check focus rings."
        />
      </Section>

      {/* TOKENS ------------------------------------------------------------ */}
      <ShowcaseSection id="tokens" title="Tokens">
        <Group title="Colours">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {swatches.map((swatch) => (
              <li key={swatch.token}>
                <span
                  className={`block h-16 rounded-md border border-border ${swatch.className}`}
                />
                <code className="mt-1.5 block font-mono text-xs text-muted">{swatch.token}</code>
              </li>
            ))}
          </ul>
        </Group>
        <Group title="Gradients">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gradients.map((gradient) => (
              <li key={gradient.token}>
                <span
                  className={`block h-24 rounded-lg border border-border ${gradient.className}`}
                />
                <code className="mt-1.5 block font-mono text-xs text-muted">{gradient.token}</code>
              </li>
            ))}
          </ul>
        </Group>
        <Group title="Typography">
          <div className="space-y-4">
            <p className="font-heading text-h1 font-extrabold">Heading 1 · Plus Jakarta Sans 800</p>
            <p className="font-heading text-h2 font-extrabold">Heading 2 · Plus Jakarta Sans 800</p>
            <p className="font-heading text-h3 font-bold">Heading 3 · Plus Jakarta Sans 700</p>
            <p className="text-body">
              Body 1rem / 1.7 · Inter 400. Plain, honest copy in the first person.
            </p>
            <p className="text-small text-muted">Small 0.875rem · Inter, --muted</p>
            <p className="text-eyebrow font-semibold text-primary uppercase">
              Eyebrow · 0.75rem · 0.12em
            </p>
            <p className="font-mono text-eyebrow font-medium text-muted uppercase">
              JetBrains Mono 500 · labels
            </p>
          </div>
        </Group>
        <Group title="Radius & shadow">
          <div className="flex flex-wrap gap-6">
            {[
              ["rounded-sm", "sm 8px"],
              ["rounded-md", "md 12px"],
              ["rounded-lg", "lg 16px"],
              ["rounded-xl", "xl 24px"],
              ["rounded-pill", "pill"],
            ].map(([className, label]) => (
              <div key={label} className="text-center">
                <span
                  className={`block size-20 border border-border bg-surface shadow-card ${className}`}
                />
                <code className="mt-1.5 block font-mono text-xs text-muted">{label}</code>
              </div>
            ))}
            <div className="text-center">
              <span className="block h-20 w-32 rounded-lg bg-surface shadow-card-hover" />
              <code className="mt-1.5 block font-mono text-xs text-muted">shadow-card-hover</code>
            </div>
            <div className="text-center">
              <span className="block h-20 w-32 rounded-lg bg-surface shadow-nav" />
              <code className="mt-1.5 block font-mono text-xs text-muted">shadow-nav</code>
            </div>
          </div>
        </Group>
      </ShowcaseSection>

      {/* BUTTONS ----------------------------------------------------------- */}
      <ShowcaseSection id="buttons" title="Buttons" background="tint">
        <Group title="Variants on light">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="link" href="/services">
              Link
            </Button>
            <Button disabled>Disabled</Button>
            <Button loading>Sending</Button>
          </div>
        </Group>
        <Group title="Sizes & icons">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md" leftIcon={<Calendar aria-hidden="true" className="size-4" />}>
              Book a call
            </Button>
            <Button
              size="lg"
              href="/contact"
              rightIcon={<ArrowRight aria-hidden="true" className="size-5" />}
            >
              Let&apos;s talk
            </Button>
          </div>
        </Group>
      </ShowcaseSection>
      <Section background="dark" padding="sm">
        <h3 className="mb-4 text-small font-semibold">Variants on dark</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="white">White</Button>
          <Button variant="ghost-light">Ghost light</Button>
          <Button variant="link" href="/work">
            Link on dark
          </Button>
        </div>
      </Section>
      <Section background="gradient" padding="sm">
        <h3 className="mb-4 text-small font-semibold">Variants on gradient</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="white"
            leftIcon={<MessageCircle aria-hidden="true" className="size-4" />}
          >
            WhatsApp me
          </Button>
          <Button variant="ghost-light">Ghost light</Button>
          <Button variant="link" href="/work">
            Link on gradient
          </Button>
        </div>
      </Section>

      {/* BADGES, LABELS, CHIPS, TILES -------------------------------------- */}
      <ShowcaseSection id="badges" title="Badges, labels, chips & icon tiles">
        <Group title="Badge">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="soft">Soft</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="in-development">In development</Badge>
            <Badge variant="live">Live</Badge>
            <Badge variant="limited">Limited</Badge>
            <Badge variant="new">New</Badge>
            <Badge variant="soft" size="md">
              Soft · md
            </Badge>
          </div>
        </Group>
        <Group title="NumberLabel">
          <div className="flex flex-wrap gap-8">
            <NumberLabel number={1} label="Founder-first" />
            <NumberLabel number={2} label="Clear pricing" />
            <NumberLabel number="A" label="Custom string" />
          </div>
        </Group>
        <Group title="Chip & TechChip">
          <div className="flex flex-wrap items-center gap-2">
            <Chip>Default</Chip>
            <Chip check>With check</Chip>
            <Chip variant="soft" check>
              Soft with check
            </Chip>
            {tech.slice(0, 4).map((name) => (
              <TechChip key={name}>{name}</TechChip>
            ))}
          </div>
        </Group>
        <Group title="IconTile">
          <div className="flex flex-wrap items-center gap-4">
            <IconTile icon="Rocket" size="sm" />
            <IconTile icon="Bot" />
            <IconTile icon="Cloud" size="lg" />
          </div>
        </Group>
      </ShowcaseSection>
      <Section background="dark" padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="eyebrow-dark">Eyebrow dark</Badge>
          <NumberLabel number={3} label="On dark" />
          <Chip variant="on-dark" check>
            Chip on dark
          </Chip>
          <TechChip variant="on-dark">TypeScript</TechChip>
          <IconTile icon="Sparkles" variant="on-dark" />
        </div>
      </Section>
      <Section background="gradient" padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="eyebrow-dark">Eyebrow on gradient</Badge>
          <NumberLabel number={4} label="On gradient" />
          <Chip variant="on-dark" check>
            Chip on gradient
          </Chip>
          <IconTile icon="Server" variant="on-dark" />
        </div>
      </Section>

      {/* SECTION HEADINGS -------------------------------------------------- */}
      <Section background="section">
        <SectionHeading
          eyebrow="SectionHeading · light"
          title="Built to ship, built to scale"
          highlight="to scale"
          subtitle="Centered by default, with a 56×3px accent bar under the title."
        />
      </Section>
      <Section background="tint">
        <SectionHeading
          eyebrow="SectionHeading · tint · left"
          align="left"
          title="Left-aligned heading on tint"
          highlight="on tint"
          subtitle="Use left alignment beside media or in two-column layouts."
        />
      </Section>
      <Section background="dark">
        <SectionHeading
          eyebrow="SectionHeading · dark"
          title="Highlight turns sky on navy"
          highlight="sky"
          subtitle="On navy, highlights use --sky-400 and subtitles use --sky-200."
        />
      </Section>
      <Section background="gradient">
        <SectionHeading
          eyebrow="SectionHeading · gradient"
          title="Readable on the hero gradient"
          highlight="hero gradient"
          subtitle="The gradient is brighter in the middle, so highlights use --sky-200 and body copy stays white."
        />
      </Section>

      {/* CARDS ------------------------------------------------------------- */}
      <ShowcaseSection id="cards" title="Cards" background="tint">
        <Group title="FeatureCard · NumberedCard · ProcessStepCard">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="Rocket"
              title="Feature card"
              text="Icon tile, title and text. Hover to see it lift 4px."
            />
            <NumberedCard
              number={1}
              label="Founder-first"
              icon="Route"
              title="Numbered card"
              text="NumberLabel on top, icon inline with the title."
            />
            <ProcessStepCard
              step={1}
              title="Process step"
              text="A 'Step 01' label, title and text."
            />
          </div>
        </Group>
        <Group title="TechCategoryCard · DeliverableCard · InfoCard">
          <div className="grid gap-6 md:grid-cols-3">
            <TechCategoryCard
              title="Frontend"
              subtitle="Interfaces and design systems"
              tag="Web UI"
              points={["Server-rendered pages", "Accessible components", "Fast Core Web Vitals"]}
              tech={["Next.js", "React", "TypeScript", "Tailwind"]}
            />
            <DeliverableCard
              title="Source code"
              tag="IP"
              text="Full repository access from day one."
              points={["Yours to keep", "Documented setup"]}
            />
            <InfoCard
              heading="Info card"
              items={["Thin primary top border", "Faint grid background", "Check-mark list"]}
            />
          </div>
        </Group>
        <Group title="ProductCard · default and wide">
          <div className="grid gap-6 lg:grid-cols-3">
            <ProductCard
              icon="AppWindow"
              title="[PRODUCT_NAME]"
              text="[ADD REAL PRODUCT DESCRIPTION]"
              statuses={[{ label: "In development", variant: "in-development" }]}
              features={["Feature one", "Feature two"]}
              cta={{ label: "Learn more", href: "/contact" }}
            />
            <ProductCard
              className="lg:col-span-2"
              variant="wide"
              icon="Bot"
              title="[PRODUCT_NAME] · wide"
              text="[ADD REAL PRODUCT DESCRIPTION]"
              statuses={[
                { label: "Live", variant: "live" },
                { label: "New", variant: "new" },
              ]}
              bullets={["Bullet point one", "Bullet point two", "Bullet point three"]}
              features={["Feature one", "Feature two", "Feature three"]}
              note="A small italic note for caveats."
              cta={{ label: "Join the waitlist", href: "/contact" }}
            />
          </div>
        </Group>
      </ShowcaseSection>
      <Section background="dark">
        <h3 className="mb-6 text-small font-semibold">GlassCard · MiniGlass on dark</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-h3 font-bold">Glass card</h3>
            <p className="mt-2 text-tone-muted">Translucent white with a 16px backdrop blur.</p>
          </GlassCard>
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniGlass icon="Zap" title="Mini glass" text="Compact fact" />
            <MiniGlass icon="ShieldCheck" title="Mini glass" text="With an icon" />
          </div>
        </div>
      </Section>
      <Section background="gradient">
        <h3 className="mb-6 text-small font-semibold">GlassCard · MiniGlass on gradient</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <GlassCard>
            <h3 className="text-h3 font-bold">Glass on gradient</h3>
            <p className="mt-2 text-tone-muted">Same component; text stays readable.</p>
          </GlassCard>
          <MiniGlass icon="Clock" title="[RESPONSE_TIME]" text="Typical reply time" />
        </div>
      </Section>

      {/* ACCORDION & TABS -------------------------------------------------- */}
      <ShowcaseSection id="accordion" title="Accordion & Tabs">
        <div className="grid gap-10 lg:grid-cols-2">
          <Group title="Accordion · default">
            <Accordion items={faqItems} />
          </Group>
          <Group title="Accordion · numbered">
            <Accordion items={faqItems} variant="numbered" defaultOpen={null} />
          </Group>
        </div>
        <Group title="Tabs (←/→, Home, End)">
          <Tabs
            label="Service groups"
            items={[
              {
                id: "build",
                label: "Build",
                content: <p className="text-muted">Build tab panel.</p>,
              },
              {
                id: "design",
                label: "Design",
                content: <p className="text-muted">Design tab panel.</p>,
              },
              { id: "grow", label: "Grow", content: <p className="text-muted">Grow tab panel.</p> },
              {
                id: "ai",
                label: "AI & Cloud",
                content: <p className="text-muted">AI & Cloud tab panel.</p>,
              },
            ]}
          />
        </Group>
      </ShowcaseSection>

      {/* NAVIGATION & TIMELINE --------------------------------------------- */}
      <ShowcaseSection id="breadcrumb" title="Breadcrumb & Timeline" background="tint">
        <Group title="Breadcrumb (with JSON-LD)">
          <Breadcrumb
            jsonLd
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: "MVP Development" },
            ]}
          />
        </Group>
        <Group title="Timeline · steps (horizontal ≥1024px)">
          <Timeline items={steps} />
        </Group>
        <Group title="Timeline · milestones">
          <Timeline items={milestones} variant="milestones" />
        </Group>
      </ShowcaseSection>
      <Section background="dark" padding="sm">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
            { label: "Case study" },
          ]}
        />
        <div className="mt-10">
          <Timeline items={steps} />
        </div>
      </Section>

      {/* MOTION ------------------------------------------------------------ */}
      <ShowcaseSection id="motion" title="Marquee & Reveal">
        <Group title="Marquee (hover or focus to pause)">
          <Marquee
            label="Technologies"
            items={tech.map((name) => (
              <span key={name} className="font-heading text-h3 font-bold text-subtle">
                {name}
              </span>
            ))}
          />
        </Group>
        <Group title="Reveal">
          <Reveal>
            <FeatureCard
              icon="Eye"
              title="Revealed once"
              text="Fades up 16px when it enters the viewport."
            />
          </Reveal>
        </Group>
        <Group title="RevealGroup (staggered grid)">
          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {["One", "Two", "Three"].map((n, i) => (
              <RevealItem key={n} index={i}>
                <FeatureCard
                  icon="Layers"
                  title={`Item ${n}`}
                  text="Each card follows the previous one."
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Group>
      </ShowcaseSection>

      {/* OVERLAYS ---------------------------------------------------------- */}
      <ShowcaseSection id="overlays" title="Modal, Toast & BackToTop" background="tint">
        <div className="flex flex-wrap gap-10">
          <Group title="Modal">
            <ModalDemo />
          </Group>
          <Group title="Toast">
            <ToastDemo />
          </Group>
          <Group title="BackToTop">
            <p className="text-small text-muted">Scroll down 600px; it appears bottom-right.</p>
          </Group>
        </div>
      </ShowcaseSection>

      {/* FORMS ------------------------------------------------------------- */}
      <ShowcaseSection id="forms" title="Form controls">
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="demo-name" required>
              Name
            </Label>
            <Input
              id="demo-name"
              placeholder="Your name"
              autoComplete="name"
              aria-describedby="demo-name-help"
            />
            <HelperText id="demo-name-help">How should I address you?</HelperText>
          </div>
          <div>
            <Label htmlFor="demo-email" required>
              Email
            </Label>
            <Input
              id="demo-email"
              type="email"
              defaultValue="not-an-email"
              invalid
              aria-describedby="demo-email-error"
            />
            <FieldError id="demo-email-error">Enter a valid email address.</FieldError>
          </div>
          <div>
            <Label htmlFor="demo-service">Service</Label>
            <Select id="demo-service" placeholder="Choose a service" defaultValue="">
              <option value="mvp">MVP Development</option>
              <option value="ai">AI Integration & Automation</option>
              <option value="devops">DevOps & Cloud</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="demo-budget">Budget (invalid)</Label>
            <Select
              id="demo-budget"
              placeholder="Choose a range"
              defaultValue=""
              invalid
              aria-describedby="demo-budget-error"
            >
              <option value="a">[BUDGET_RANGE_1]</option>
            </Select>
            <FieldError id="demo-budget-error">Please choose a budget range.</FieldError>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="demo-message" required>
              Project details
            </Label>
            <Textarea id="demo-message" maxLength={500} placeholder="What are you building?" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="demo-file">Attachment</Label>
            <FileDrop
              id="demo-file"
              name="attachment"
              accept=".pdf,.doc,.docx,.png,.jpg"
              maxSizeMB={10}
              multiple
            />
          </div>
          <div className="md:col-span-2">
            <Checkbox id="demo-consent" name="consent" label="I agree to the privacy policy." />
            <Checkbox
              id="demo-consent-error"
              name="consent-error"
              invalid
              label="Invalid checkbox state."
            />
          </div>
          <div>
            <Button type="button" rightIcon={<Send aria-hidden="true" className="size-4" />}>
              Send message
            </Button>
          </div>
        </div>
      </ShowcaseSection>

      {/* ABOUT-PAGE PIECES ------------------------------------------------- */}
      <ShowcaseSection id="about-pieces" title="Availability, skill pillar, placeholders">
        <Group title="AvailabilityBadge (driven by siteConfig.availability)">
          <div className="flex flex-wrap gap-3">
            <AvailabilityBadge status="available" />
            <AvailabilityBadge status="limited" />
            <AvailabilityBadge status="booked" />
          </div>
        </Group>
        <Group title="SkillPillar">
          <div className="max-w-xs">
            <SkillPillar
              icon="Bot"
              title="AI engineering"
              text="Practical AI features that are measured and monitored."
              skills={["LLM APIs", "RAG", "Agents", "Evaluation"]}
            />
          </div>
        </Group>
        <Group title="PlaceholderText">
          <p className="text-muted">
            <PlaceholderText text="Based in [CITY], India since [YEAR]." />
          </p>
        </Group>
      </ShowcaseSection>

      {/* CAROUSEL --------------------------------------------------------- */}
      <ShowcaseSection id="carousel" title="Testimonial carousel">
        <Group title="Arrows, dots, ←/→ keys and swipe (placeholder data)">
          <TestimonialCarousel
            label="Sample testimonials"
            items={[1, 2, 3].map((n) => ({
              quote: `[ADD REAL TESTIMONIAL ${n}]`,
              name: `[CLIENT_NAME_${n}]`,
              role: "[CLIENT_ROLE]",
              company: "[CLIENT_COMPANY]",
              linkedinUrl: n === 1 ? "https://www.linkedin.com/" : undefined,
            }))}
          />
        </Group>
      </ShowcaseSection>

      {/* ILLUSTRATION ------------------------------------------------------ */}
      <ShowcaseSection id="illustration" title="Illustration" background="tint">
        <Illustration name="placeholder-illustration.svg" width={480} height={320} alt="" />
      </ShowcaseSection>
    </>
  );
}

function ShowcaseSection({
  id,
  title,
  background = "white",
  children,
}: {
  id: string;
  title: string;
  background?: "white" | "tint";
  children: React.ReactNode;
}) {
  return (
    <Section id={id} background={background} padding="sm">
      <h2 className="border-b border-border pb-3 text-h2 font-extrabold">{title}</h2>
      <div className="mt-8 space-y-10">{children}</div>
    </Section>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-eyebrow font-medium text-muted uppercase">{title}</h3>
      {children}
    </div>
  );
}
