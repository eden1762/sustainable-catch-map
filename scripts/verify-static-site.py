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
    assert_contains("ar.html", "/pages/ar-ultra-small-phone.css", "ultra-small phone and landscape AR guard")
    assert_contains("ar.html", "/pages/ar-safe-view.css", "AR safe-view frame")
    assert_contains("ar.html", "/pages/ar-stall-tap-safe.css", "fish-stall tap-safe mobile controls")
    assert_contains("ar.html", "/pages/ar-official-model-only.css", "AR official 3D model only styles")
    assert_contains("ar.html", "/pages/ar-official-model-only.js", "AR official 3D model only behavior")
    assert_contains("ar.html", "/pages/ar-no-generated-fish-visuals.css", "AR generated fish visual guard")
    assert_contains("ar.html", "Back to the full 3D fish", "English full-fish return action")

    phone_guard = read("pages/ar-ultra-small-phone.css")
    if "orientation: landscape" not in phone_guard or "FishFull AR landscape guard" not in phone_guard:
        raise AssertionError("pages/ar-ultra-small-phone.css must protect the full 3D fish in mobile landscape view")
    if "overflow-x: clip" not in phone_guard or "max-block-size" not in phone_guard:
        raise AssertionError("pages/ar-ultra-small-phone.css must prevent landscape AR control overflow")

    tap_safe = read("pages/ar-stall-tap-safe.css")
    if "touch-action: manipulation" not in tap_safe or "max-inline-size" not in tap_safe:
        raise AssertionError("pages/ar-stall-tap-safe.css must keep fish-stall AR controls tappable without horizontal overflow")
    if "自製品牌圖形" not in tap_safe:
        raise AssertionError("pages/ar-stall-tap-safe.css must document that it does not add generated brand graphics")

    model_only_css = read("pages/ar-official-model-only.css")
    model_only_js = read("pages/ar-official-model-only.js")
    if ".ar-fallback-fish" not in model_only_css or "display: none !important" not in model_only_css:
        raise AssertionError("pages/ar-official-model-only.css must hide substitute fish art")
    if "removeFallbackFish" not in model_only_js or "modelReady" not in model_only_js:
        raise AssertionError("pages/ar-official-model-only.js must remove substitute fish art and hold photos until the full 3D model is ready")

    generated_fish_guard = read("pages/ar-no-generated-fish-visuals.css")
    if ".phone-fish" not in generated_fish_guard or "display: none !important" not in generated_fish_guard:
        raise AssertionError("pages/ar-no-generated-fish-visuals.css must hide generated hero fish drawings")

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
        "pages/ar-ultra-small-phone.css",
        "pages/ar-safe-view.css",
        "pages/ar-stall-tap-safe.css",
        "pages/ar-official-model-only.css",
        "pages/ar-official-model-only.js",
        "pages/ar-no-generated-fish-visuals.css",
    ]
    for path in required_files:
        read(path)

    assert_official_logo_guard()
    assert_ar_entry_is_primary()
    assert_no_public_phrase("Elon Musk")
    assert_no_public_phrase("first principles")
    print("FishFull static checks passed: official logo, no duplicate footer guard, generated-logo cleanup, alternate trademark cleanup, AR entry, mobile fish-fit guard, landscape phone guard, fish-stall tap-safe controls, official 3D model-only AR guard, and no generated hero fish visuals are present.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as exc:
        print(f"FishFull static check failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
