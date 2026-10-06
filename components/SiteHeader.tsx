"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteIcon } from "./SiteIcon";

const navigationItems = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/projects", label: "作品", icon: "projects" },
  { href: "/capabilities", label: "能力", icon: "capabilities" },
  { href: "/blog", label: "文章", icon: "blog" },
  { href: "/about", label: "关于", icon: "about" },
] as const;

function isCurrentPath(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-brand" href="/" aria-label="zhujiechong 首页">
          zhujiechong
        </Link>
        <nav aria-label="主导航">
          <ul className="site-navigation">
            {navigationItems.map(({ href, label, icon }) => {
              const isCurrent = isCurrentPath(pathname, href);

              return (
                <li key={href}>
                  <Link
                    className="site-navigation__link"
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <SiteIcon name={icon} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
