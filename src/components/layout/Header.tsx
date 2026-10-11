import { HeaderClient } from "@/components/layout/HeaderClient";
import type { HeaderNav, MegaGroupView } from "@/components/layout/navTypes";
import { Icon } from "@/components/ui/Icon";
import {
  contactDetails,
  ctaNav,
  mainNav,
  megaMenuPromo,
  servicesMegaMenu,
  socialLinks,
} from "@/content/navigation";

/**
 * Server wrapper: resolves the service icon names here so the full lucide icon map never
 * reaches the client bundle, and hands the interactive header only the plain data it needs —
 * so no content module (and none of the service copy behind it) is bundled for the browser.
 */
export function Header() {
  const groups: MegaGroupView[] = servicesMegaMenu.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      iconNode: <Icon icon={item.icon} strokeWidth={1.75} className="size-5" />,
    })),
  }));

  const nav: HeaderNav = {
    main: mainNav.map((item) => ({
      label: item.label,
      href: item.href,
      hasMega: Boolean(item.megaMenu),
    })),
    cta: ctaNav,
    promo: megaMenuPromo,
    contact: contactDetails,
    social: socialLinks,
  };

  return <HeaderClient groups={groups} nav={nav} />;
}
