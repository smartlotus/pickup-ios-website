#!/usr/bin/env python3
"""Verify Pickup iOS showcase site integrity, UTF-8, HTML balance, links, and bilingual completeness."""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"

VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

DEFERRED_MEDIA_ASSETS = {
    "assets/pickup-ios-intro.mp4",
    "assets/video-poster.png",
    "assets/screens/iphone-journal.png",
    "assets/screens/iphone-timeline.png",
    "assets/screens/iphone-revisit.png",
    "assets/screens/iphone-datavault.png",
    "assets/screens/iphone-mono.png",
    "assets/screens/ipad-splitview.png",
}

FORBIDDEN_EXTERNAL_PATTERNS = (
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "googletagmanager.com",
    "google-analytics.com",
    "cdn.jsdelivr.net",
    "unpkg.com",
    "esm.run",
)


class SiteHTMLAuditor(HTMLParser):
    def __init__(self, filename: str) -> None:
        super().__init__(convert_charrefs=True)
        self.filename = filename
        self.stack: list[str] = []
        self.errors: list[str] = []
        self.ids: set[str] = set()
        self.links: list[tuple[str, str]] = []
        self.main_count = 0
        self.h1_count = 0
        self.in_summary = False
        self.in_svg = False

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        if tag == "svg":
            self.in_svg = True

        if not self.in_svg and tag not in VOID_ELEMENTS:
            self.stack.append(tag)

        el_id = attrs.get("id")
        if el_id:
            if el_id in self.ids:
                self.errors.append(f"{self.filename}: duplicate id '{el_id}'")
            self.ids.add(el_id)

        if tag == "main":
            self.main_count += 1
        elif tag == "h1":
            self.h1_count += 1
            if self.in_summary:
                self.errors.append(f"{self.filename}: heading <h1> nested inside <summary>")
        elif tag in {"h2", "h3", "h4", "h5", "h6"} and self.in_summary:
            self.errors.append(f"{self.filename}: heading <{tag}> nested inside <summary>")
        elif tag == "summary":
            self.in_summary = True

        if attrs.get("role") == "tab" and "aria-controls" in attrs:
            self.errors.append(f"{self.filename}: tab '{el_id}' must not declare aria-controls")

        if tag == "dialog":
            if "role" in attrs or "aria-modal" in attrs:
                self.errors.append(f"{self.filename}: <dialog id='{el_id}'> must not declare role or aria-modal")
            if "aria-labelledby" not in attrs and "aria-label" not in attrs:
                self.errors.append(f"{self.filename}: <dialog id='{el_id}'> missing accessible name")

        if tag == "img":
            if "alt" not in attrs:
                self.errors.append(f"{self.filename}: <img> missing alt attribute ({attrs.get('src')})")
            if not attrs.get("width") or not attrs.get("height"):
                self.errors.append(f"{self.filename}: <img> missing explicit width/height ({attrs.get('src')})")

        if tag == "video":
            if not attrs.get("width") or not attrs.get("height"):
                self.errors.append(f"{self.filename}: <video> missing explicit width/height")

        for attr_name in ("href", "src", "poster"):
            val = attrs.get(attr_name)
            if val:
                self.links.append((attr_name, val))

    def handle_endtag(self, tag: str) -> None:
        if tag == "svg":
            self.in_svg = False
            return
        if self.in_svg:
            return
        if tag == "summary":
            self.in_summary = False
        if tag in VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append(f"{self.filename}: unexpected closing </{tag}>")
            return
        top = self.stack.pop()
        if top != tag:
            self.errors.append(f"{self.filename}: mismatched closing </{tag}> (expected </{top}>)")


def check_utf8_and_clean(path: Path) -> str:
    raw = path.read_bytes()
    text = raw.decode("utf-8", errors="strict")
    if "\ufffd" in text:
        raise ValueError(f"{path}: contains Unicode replacement character U+FFFD")
    if "Ã" in text or "â€" in text:
        raise ValueError(f"{path}: contains likely UTF-8 mojibake sequence")
    return text


def validate_html_file(filename: str, expected_lang: str, required_tokens: list[str]) -> list[str]:
    errors: list[str] = []
    path = SITE / filename
    text = check_utf8_and_clean(path)

    if f'<html lang="{expected_lang}"' not in text:
        errors.append(f"{filename}: expected <html lang=\"{expected_lang}\">")

    for forbidden in FORBIDDEN_EXTERNAL_PATTERNS:
        if forbidden in text:
            errors.append(f"{filename}: forbidden external dependency '{forbidden}'")

    for token in required_tokens:
        if token not in text:
            errors.append(f"{filename}: missing required token/section '{token}'")

    auditor = SiteHTMLAuditor(filename)
    auditor.feed(text)
    auditor.close()
    errors.extend(auditor.errors)

    if auditor.stack:
        errors.append(f"{filename}: unclosed HTML tags remaining: {auditor.stack}")
    if auditor.main_count != 1:
        errors.append(f"{filename}: expected exactly 1 <main>, found {auditor.main_count}")
    if auditor.h1_count != 1:
        errors.append(f"{filename}: expected exactly 1 <h1>, found {auditor.h1_count}")

    for attr_name, target in auditor.links:
        if target.startswith(("https://", "http://")):
            if not target.startswith("https://github.com/smartlotus/pickup-ios"):
                errors.append(f"{filename}: unexpected external URL '{target}'")
            continue
        if target.startswith("#"):
            frag = target[1:]
            if frag and frag not in auditor.ids:
                errors.append(f"{filename}: broken fragment link '#{frag}'")
            continue
        if target in DEFERRED_MEDIA_ASSETS:
            continue
        resolved = (SITE / target).resolve()
        if not resolved.exists():
            errors.append(f"{filename}: broken local {attr_name}='{target}'")

    return errors


def main() -> int:
    errors: list[str] = []

    required_files = [
        SITE / "index.html",
        SITE / "en.html",
        SITE / "style.css",
        SITE / "app.js",
        SITE / "translations.js",
        SITE / "_headers",
        SITE / "assets" / "icon.png",
        ROOT / "wrangler.jsonc",
        ROOT / "README.md",
        ROOT / "LICENSE",
    ]
    for f in required_files:
        if not f.exists() or f.stat().st_size == 0:
            errors.append(f"Missing or empty required file: {f}")

    for text_file in [
        SITE / "index.html",
        SITE / "en.html",
        SITE / "style.css",
        SITE / "app.js",
        SITE / "translations.js",
        SITE / "_headers",
        ROOT / "wrangler.jsonc",
        ROOT / "README.md",
        ROOT / "LICENSE",
    ]:
        if text_file.exists():
            try:
                content = check_utf8_and_clean(text_file)
                for forbidden in FORBIDDEN_EXTERNAL_PATTERNS:
                    if forbidden in content:
                        errors.append(f"{text_file.name}: forbidden external pattern '{forbidden}'")
            except Exception as exc:
                errors.append(str(exc))

    # Validate wrangler.jsonc
    try:
        wrangler = json.loads((ROOT / "wrangler.jsonc").read_text(encoding="utf-8"))
        if wrangler.get("name") != "pickup-ios" or wrangler.get("pages_build_output_dir") != "site":
            errors.append(f"wrangler.jsonc invalid config: {wrangler}")
    except Exception as exc:
        errors.append(f"wrangler.jsonc parse failure: {exc}")

    shared_required = [
        "liquid-glass-refraction",
        "feTurbulence",
        "feDisplacementMap",
        "dev-tab-iphone",
        "dev-tab-ipad",
        "sim-panel-journal",
        "sim-panel-timeline",
        "sim-panel-revisit",
        "sim-panel-ai",
        "sim-panel-vault",
        "assets/icon.png",
        "assets/video-poster.png",
        "assets/pickup-ios-intro.mp4",
        "assets/screens/iphone-journal.png",
        "assets/screens/iphone-timeline.png",
        "assets/screens/iphone-revisit.png",
        "assets/screens/iphone-datavault.png",
        "assets/screens/iphone-mono.png",
        "assets/screens/ipad-splitview.png",
        "https://github.com/smartlotus/pickup-ios",
        "https://github.com/smartlotus/pickup-ios/releases/latest",
        "closedby=\"any\"",
        "© 2026 渚有潜 / Zhuyouqian · MIT License",
    ]

    zh_required = shared_required + [
        "把日子，",
        "免 $99 开发者费侧载",
        "在线体验液态玻璃",
        "观看 60fps 介绍片",
        "换一条记忆",
        "给过去的自己写一句回应",
        "0 bytes",
        "立即模拟备份",
        "SideStore / AltStore",
        "Sideloadly",
        "Xcode",
    ]

    en_required = shared_required + [
        "Keep the",
        "Zero $99 Apple Dev Fee",
        "Try Liquid Glass Live",
        "Watch 60fps Film",
        "Pick Another Memory",
        "Leave a reply to your past self",
        "0 bytes",
        "Simulate Backup Now",
        "SideStore / AltStore",
        "Sideloadly",
        "Xcode",
    ]

    errors.extend(validate_html_file("index.html", "zh-CN", zh_required))
    errors.extend(validate_html_file("en.html", "en", en_required))

    # Check CSS braces balance
    css = (SITE / "style.css").read_text(encoding="utf-8")
    if css.count("{") != css.count("}"):
        errors.append(f"style.css: unbalanced braces ({css.count('{')} open vs {css.count('}')} close)")

    # Verify modern-web-guidance key constructs exist
    if "@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))" not in css:
        errors.append("style.css: missing scroll-timeline + animation-range @supports guard")
    if "overscroll-behavior: contain" not in css:
        errors.append("style.css: missing dialog overscroll-behavior: contain")

    if errors:
        for err in errors:
            print(f"[FAIL] {err}", file=sys.stderr)
        return 1

    print("[OK] All Pickup iOS website verification checks passed!")
    print("     Checked UTF-8, zero mojibake, balanced HTML/CSS, zero external trackers/fonts,")
    print("     dual-language parity (index.html + en.html), 5 simulator tabs, 6 native screen paths,")
    print("     native <dialog> + video attributes, and Wrangler/Cloudflare configuration.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
