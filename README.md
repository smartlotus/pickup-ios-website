# Pickup for iPhone & iPad (iOS 26 Liquid Glass) · Official Showcase

> **把日子，拾起来。 / Keep the little things.**

Official bilingual showcase website for **Pickup for iOS 26 & iPadOS**, engineered with zero external font/tracker requests, native iOS 26 Liquid Glass optical aesthetics, an interactive iPhone 17 Pro / iPad Pro Split-View simulator, and zero-fee sideload installation guides.

---

## 目录结构 / Structure

- `site/index.html` — 中文主站（无需 JavaScript 亦可完整阅读）
- `site/en.html` — English showcase (`<html lang="en">`)
- `site/style.css` — Purple Dark & Monochrome 双主题、SVG 折射滤镜、Scroll-Driven Animations、View Transitions、`@starting-style` 顶层弹窗与强制高对比度适配
- `site/translations.js` — 中英双语静态演示词条、AI 披露上下文、存储分布与影院章节数据
- `site/app.js` — 渐进增强交互引擎（双设备切换、5 大模拟器标签页、实时写入回看、模拟本地备份、顶层影院播放器与无障碍兜底）
- `site/assets/` — 应用图标 `icon.png`、实机截图 `screens/*.png`、介绍片 `pickup-ios-intro.mp4` 及封面 `video-poster.png`
- `site/_headers` — Cloudflare Pages UTF-8 字符集、安全响应头与视频字节范围缓存
- `wrangler.jsonc` — Cloudflare Pages 部署配置（`pickup-ios`）
- `scripts/verify_site.py` — 自动化静态与结构校验脚本

## 本地预览与校验 / Local Preview & Verification

```bash
# 运行站点结构、编码、链接与双语覆盖校验
python3 scripts/verify_site.py

# 启动本地静态预览服务器
python3 -m http.server 8788 --directory site
```

## 部署到 Cloudflare Pages / Deploy

```bash
wrangler pages deploy site --project-name pickup-ios
```

## 相关链接 / Links

- iOS Source Repository: <https://github.com/smartlotus/pickup-ios>
- Latest Releases & IPA: <https://github.com/smartlotus/pickup-ios/releases/latest>

© 2026 渚有潜 / Zhuyouqian · MIT License
