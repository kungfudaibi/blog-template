"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "作品" },
  { href: "/capabilities", label: "能力" },
  { href: "/blog", label: "文章" },
  { href: "/about", label: "关于" },
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
          <span aria-hidden="true">&gt;_</span>
          zhujiechong
        </Link>
        <nav aria-label="主导航">
          <ul className="site-navigation">
            {navigationItems.map(({ href, label }) => {
              const isCurrent = isCurrentPath(pathname, href);

              return (
                <li key={href}>
                  <Link
                    className="site-navigation__link"
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {label}
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
