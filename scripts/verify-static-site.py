#!/usr/bin/env python3
"""Static release checks for the FishFull site."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OFFICIAL_LOGO = "/fishfull.jpg"
COPYRIGHT = "Copyright © 2026Fishfull漁有料版權所有"
TEXT_EXTENSIONS = {".html", ".js", ".css"}
BRAND_LOGO_CLASS = "brand-logo-img"
BRAND_LOGO_ALLOWED_FILES = {"fishfull-site-shell.js"}


def read(path: str) -> str:
    target = ROOT / path
    if not target.exists():
        raise AssertionError(f"Missing required file: {path}")
    return target.read_text(encoding="utf-8")


def assert_contains(path: str, needle: str, reason: str) -> None:
    if needle not in read(path):
        raise AssertionError(f"{path}: missing {reason}: {needle}")


def public_text_files():
    for path in ROOT.rglob("*"):
        if path.is_file() and path.suffix in TEXT_EXTENSIONS and ".git" not in path.parts:
            yield path


def assert_legacy_brand_logo_svg_cleanup() -> None:
    shell = read("fishfull-site-shell.js")
    for term in [
        "blockedBrandLogoSvgSelector",
        "removeBannedBrandLogoSvg",
        'svg[class="brand-logo-img"]',
        "svg.brand-logo-img",
    ]:
        if term not in shell:
            raise AssertionError(f"fishfull-site-shell.js must force-remove legacy brand SVG elements: {term}")

    brand_css = read("fishfull-brand.css")
    if BRAND_LOGO_CLASS in brand_css:
        raise AssertionError("fishfull-brand.css must not keep brand-logo-img hide-only CSS residue")

    offenders: list[str] = []
    for path in public_text_files():
        rel = str(path.relative_to(ROOT))
        if rel in BRAND_LOGO_ALLOWED_FILES:
            continue
        if BRAND_LOGO_CLASS in path.read_text(encoding="utf-8", errors="ignore"):
            offenders.append(rel)
    if offenders:
        raise AssertionError("brand-logo-img may only appear in fishfull-site-shell.js forced-removal code: " + ", ".join(offenders))


def assert_official_logo_guard() -> None:
    shell = read("fishfull-site-shell.js")
    for term in [
        f"var logoSrc = '{OFFICIAL_LOGO}'",
        "generatedTrademarkSelector",
        "removeGeneratedTrademarkVisuals",
        "removeAlternateTrademarkVisuals",
        "dedupeBrandLogos",
        "removeDuplicateCopyrightText",
        COPYRIGHT,
    ]:
        if term not in shell:
            raise AssertionError(f"fishfull-site-shell.js missing official-logo guard term: {term}")

    html_paths = sorted(ROOT.glob("*.html")) + sorted((ROOT / "pages").glob("*.html"))
    for path in html_paths:
        content = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        for tag in re.findall(r"<img[^>]+(?:brand|logo|商標)[^>]*>", content, flags=re.IGNORECASE):
            if OFFICIAL_LOGO not in tag:
                raise AssertionError(f"{rel}: brand/logo image must use {OFFICIAL_LOGO}: {tag}")
        count = content.count(COPYRIGHT)
        if count > 1:
            raise AssertionError(f"{rel}: static copyright statement appears {count} times")


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

    if "orientation: landscape" not in read("pages/ar-ultra-small-phone.css"):
        raise AssertionError("pages/ar-ultra-small-phone.css must protect mobile landscape AR view")
    if "touch-action: manipulation" not in read("pages/ar-stall-tap-safe.css"):
        raise AssertionError("pages/ar-stall-tap-safe.css must keep mobile controls tappable")
    if "removeFallbackFish" not in read("pages/ar-official-model-only.js"):
        raise AssertionError("pages/ar-official-model-only.js must remove substitute fish art")
    if ".phone-fish" not in read("pages/ar-no-generated-fish-visuals.css"):
        raise AssertionError("pages/ar-no-generated-fish-visuals.css must guard generated hero fish visuals")
    if "ar.html" not in read("home.js"):
        raise AssertionError("home.js must expose the root-level AR game entry")


def main() -> int:
    for path in [
        "index.html",
        "ar.html",
        "home.js",
        "fishfull.jpg",
        "fishfull-brand.css",
        "fishfull-site-shell.js",
        "pages/ar-mobile-fish-fit.css",
        "pages/ar-ultra-small-phone.css",
        "pages/ar-safe-view.css",
        "pages/ar-stall-tap-safe.css",
        "pages/ar-official-model-only.css",
        "pages/ar-official-model-only.js",
        "pages/ar-no-generated-fish-visuals.css",
    ]:
        read(path)

    assert_legacy_brand_logo_svg_cleanup()
    assert_official_logo_guard()
    assert_ar_entry_is_primary()
    print("FishFull static checks passed: official logo, forced legacy brand SVG removal, no brand-logo-img CSS residue, AR guards, and generated-visual cleanup are present.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AssertionError as exc:
        print(f"FishFull static check failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
