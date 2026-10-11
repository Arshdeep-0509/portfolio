import { HeaderClient } from "@/components/layout/HeaderClient";
import type { HeaderNav } from "@/components/layout/navTypes";
import {
  contactDetails,
  headerCopy,
  mainNav,
  servicesMenu,
  socialLinks,
} from "@/content/navigation";
import { siteConfig } from "@/content/site";

/**
 * Server wrapper: hands the interactive header only the plain data it needs, so no content
 * module (and none of the service copy behind it) is bundled for the browser.
 */
export function Header() {
  const nav: HeaderNav = {
    main: mainNav,
    services: servicesMenu,
    copy: headerCopy,
    contact: contactDetails,
    social: socialLinks,
    availability: siteConfig.availability,
  };
  return <HeaderClient nav={nav} />;
}
