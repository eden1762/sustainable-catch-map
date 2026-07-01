#!/usr/bin/env python3
"""Lightweight release checks for the FishFull static site.

The site is intentionally simple and static, so this script gives `npm run build`
a real verification step without generating duplicate output files.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COPYRIGHT = "Copyright © 2026Fishfull漁有料版權所有"
OFFICIAL_LOGO = "/fishfull.jpg"
PUBLIC_TEXT_EXTENSIONS = {".html", ".js", ".css"}
GENERATED_LOGO_GUARD_TERMS = [
    "generatedTrademarkSelector",
    "removeGeneratedTrademarkVisuals",
    "round-fish-logo",
    "ai-generated-logo",
    "legacy-fishfull-mark",
]


def read(path: str) -> str:
    target = ROOT / path
    if not target.exists():
        raise AssertionError(f"Missing required file: {path}")
    return target.read_text(encoding="utf-8")


def assert_contains(path: str, needle: str, reason: str) -> None:
    content = read(path)
    if needle not in content:
        raise AssertionError(f"{path}: missing {reason}: {needle}")


def assert_no_public_phrase(phrase: str) -> None:
    offenders: list[str] = []
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix in PUBLIC_TEXT_EXTENSIONS and ".git" not in path.parts:
            if phrase in path.read_text(encoding="utf-8", errors="ignore"):
                offenders.append(str(path.relative_to(ROOT)))
    if offenders:
        raise AssertionError(f"Public copy contains banned phrase {phrase!r}: {', '.join(offenders)}")


def assert_official_logo_guard() -> None:
    shell = read("fishfull-site-shell.js")
    if f"var logoSrc = '{OFFICIAL_LOGO}'" not in shell:
        raise AssertionError("fishfull-site-shell.js must enforce /fishfull.jpg as the site logo")
    if COPYRIGHT not in shell:
        raise AssertionError("fishfull-site-shell.js must enforce the exact copyright footer")
    if "dedupeBrandLogos" not in shell:
        raise AssertionError("fishfull-site-shell.js must remove duplicate or alternate brand-logo visuals")
    if "removeAlternateTrademarkVisuals" not in shell:
        raise AssertionError("fishfull-site-shell.js must remove SVG, icon, or generated alternate trademark visuals")
    if "removeDuplicateCopyrightText" not in shell:
        raise AssertionError("fishfull-site-shell.js must remove duplicate copyright text outside the managed footer")
    for term in GENERATED_LOGO_GUARD_TERMS:
        if term not in shell:
            raise AssertionError(f"fishfull-site-shell.js must guard against generated logo assets: {term}")

    html_paths = sorted(ROOT.glob("*.html")) + sorted((ROOT / "pages").glob("*.html"))
    for path in html_paths:
        content = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        if "fishfull-site-shell.js" not in content:
            raise AssertionError(f"{rel}: missing shared shell that enforces logo and footer")
        brand_imgs = re.findall(r"<img[^>]+(?:brand|logo|商標)[^>]*>", content, flags=re.IGNORECASE)
        for tag in brand_imgs:
            if OFFICIAL_LOGO not in tag:
                raise AssertionError(f"{rel}: brand/logo image must use {OFFICIAL_LOGO}: {tag}")
        static_copyrights = content.count(COPYRIGHT)
        if static_copyrights > 1:
            raise AssertionError(f"{rel}: static copyright statement appears {static_copyrights} times")


def assert_ar_entry_is_primary() -> None:
    assert_contains("ar.html", 'data-page="ar-game"', "root-level AR game page marker")
    assert_contains("ar.html", "/pages/ar-mobile-fish-fit.css", "mobile AR full-fish fit guard")
    assert_contains("ar.html", "/pages/ar-safe-view.css", "AR safe-view frame")
    assert_contains("ar.html", "Back to the full 3D fish", "English full-fish return action")

    home = read("home.js")
    if "ar.html" not in home:
        raise AssertionError("home.js must expose the root-level AR game entry")


def main() -> int:
    required_files = [
        "index.html",
        "ar.html",
        "home.js",
        "fishfull.jpg",
        "fishfull-site-shell.js",
        "pages/ar-mobile-fish-fit.css",
        "pages/ar-safe-view.css",
    ]
    for path in required_files:
        read(path)

    assert_official_logo_guard()
    assert_ar_entry_is_primary()
    assert_no_public_phrase("Elon Musk")
    assert_no_public_phrase("first principles")
    print("FishFull static checks passed: official logo, no duplicate footer guard, generated-logo cleanup, alternate trademark cleanup, AR entry, and mobile fish-fit guard are present.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as exc:
        print(f"FishFull static check failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
