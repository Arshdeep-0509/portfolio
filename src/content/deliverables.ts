import type { FileNode } from "@/components/ui/FileTree";

/**
 * The handover kit: what every client receives, whatever the service. Shown on Home as a file
 * tree and referenced from /approach. Each line restates a commitment made elsewhere on the site.
 */

export const handoverKit = {
  label: "The handover kit",
  title: "Everything you need to run it without me",
  emphasis: "without me",
  ownership: [
    "The code lives in a private repository that becomes yours. An NDA and an IP assignment are signed before work begins, not at the end.",
    "Design files, documentation and cloud accounts sit in your name, so any developer or in-house team can carry on where I stop.",
  ],
  points: [
    "Repository transferred to you",
    "NDA and IP assignment signed upfront",
    "No lock-in, ever",
  ],
  treeLabel: "What you receive",
  tree: [
    {
      name: "your-product/",
      children: [
        { name: "app/", note: "production build, key flows tested" },
        { name: "design/", note: "Figma files, components, UI kit" },
        { name: "docs/", note: "architecture, setup and environment notes" },
        { name: "infra/", note: "hosting, domain, SSL, CI/CD pipeline" },
        { name: "ROADMAP.md", note: "plan for the next release" },
        { name: "SUPPORT.md", note: "bug-fix window after launch" },
      ],
    },
  ] satisfies FileNode[],
};
