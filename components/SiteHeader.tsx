"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { IconFacebook, IconInstagram, IconLinkedIn, IconSearch, IconX } from "./Icons";

const THEME_KEY = "at-theme";
const THEME_EVENT = "at-theme-change";

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_EVENT, onStoreChange);
}

function darkSnapshot() {
  return document.documentElement.classList.contains("dark-mode");
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = useSyncExternalStore(subscribeTheme, darkSnapshot, () => false);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark-mode");
    document.documentElement.classList.toggle("dark-mode", next);
    document.body.classList.toggle("dark-mode", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* ignore private mode */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const onLetter = pathname.startsWith("/begrippen/letter");
  const onGlossary =
    pathname === "/" ||
    pathname === "/begrippen" ||
    (pathname.startsWith("/begrippen/") && !onLetter);

  return (
    <header className="at-header" id="top">
      <div className="at-topbar">
        <div className="at-container at-topbar-inner">
          <ul className="at-social" aria-label="Sociale media">
            <li>
              <a href="#top" aria-label="Facebook">
                <IconFacebook />
              </a>
            </li>
            <li>
              <a href="#top" aria-label="X">
                <IconX />
              </a>
            </li>
            <li>
              <a href="#top" aria-label="LinkedIn">
                <IconLinkedIn />
              </a>
            </li>
            <li>
              <a href="#top" aria-label="Instagram">
                <IconInstagram />
              </a>
            </li>
          </ul>
          <Link href="/begrippen" className="at-logo" aria-label="TOPBOT / AI Terms">
            <Image src="/images/logo/logo.svg" alt="TOPBOT / AI Terms" width={193} height={65} priority />
          </Link>
          <div className="at-top-actions">
            <button
              type="button"
              className="at-mode"
              onClick={toggleTheme}
              aria-pressed={dark}
              title="Donkere modus"
            >
              <span className="at-mode-label">{dark ? "Dark" : "Light"}</span>
              <span className="at-track" aria-hidden="true">
                <span className="at-knob" />
              </span>
            </button>
            <a href="#contact" className="at-btn">
              Term gemist?
            </a>
          </div>
        </div>
      </div>
      <div className="at-navband">
        <div className="at-container at-navband-inner">
          <button
            type="button"
            className="at-burger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="hoofdmenu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            id="hoofdmenu"
            className={menuOpen ? "at-menu is-open" : "at-menu"}
            aria-label="Hoofdmenu"
            onClick={() => setMenuOpen(false)}
          >
            <ul className="at-nav">
              <li>
                <Link href="/begrippen">Home</Link>
              </li>
              <li>
                <Link href="/begrippen" className={onGlossary ? "is-current" : undefined} aria-current={onGlossary ? "page" : undefined}>
                  Begrippen
                </Link>
              </li>
              <li>
                <Link href="/begrippen/letter/a" className={onLetter ? "is-current" : undefined} aria-current={onLetter ? "page" : undefined}>
                  A–Z
                </Link>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
          <Link className="at-find" href="/begrippen#filters" aria-label="Zoeken">
            <IconSearch size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
