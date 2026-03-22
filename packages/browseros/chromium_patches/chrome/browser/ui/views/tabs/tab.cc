diff --git a/chrome/browser/ui/views/tabs/tab.cc b/chrome/browser/ui/views/tabs/tab.cc
index 0000000000000..thriveos000001
--- a/chrome/browser/ui/views/tabs/tab.cc
+++ b/chrome/browser/ui/views/tabs/tab.cc
@@ -1,6 +1,7 @@
 // Copyright 2012 The Chromium Authors
 // Use of this source code is governed by a BSD-style license that can be
 // found in the LICENSE file.
+// ThriveOS: Pinned tab glow effects for ThriveOS dashboard tabs

 #include "chrome/browser/ui/views/tabs/tab.h"

@@ -48,6 +49,36 @@ namespace {
 constexpr float kMinimumContrastRatioForOutline = 1.3f;
 }  // namespace

+namespace thriveos {
+
+// ThriveOS dashboard tab URLs that receive custom glow treatment
+// in the vertical tab strip.
+static const char* const kOverviewUrl = "https://thriveos.app/dashboard";
+static const char* const kBizboxUrl   = "https://thriveos.app/dashboard/bizbox";
+static const char* const kLifebudUrl  = "https://thriveos.app/dashboard/lifebud";
+
+enum class ThriveOSTabKind { kNone, kOverview, kBizbox, kLifebud };
+
+ThriveOSTabKind GetThriveOSTabKind(const GURL& url) {
+  const std::string& spec = url.spec();
+  if (spec == kOverviewUrl || base::StartsWith(spec, std::string(kOverviewUrl) + "?") ||
+      base::StartsWith(spec, std::string(kOverviewUrl) + "#")) {
+    return ThriveOSTabKind::kOverview;
+  }
+  if (base::StartsWith(spec, kBizboxUrl)) {
+    return ThriveOSTabKind::kBizbox;
+  }
+  if (base::StartsWith(spec, kLifebudUrl)) {
+    return ThriveOSTabKind::kLifebud;
+  }
+  return ThriveOSTabKind::kNone;
+}
+
+}  // namespace thriveos
+
 // Helper to get the URL of the tab's WebContents (nullptr-safe).
+static GURL GetTabUrl(const TabRendererData& data) {
+  return data.url;
+}
+
 // ... (existing helpers unchanged)

@@ -285,6 +320,7 @@ void Tab::PaintTabBackground(gfx::Canvas* canvas,
                              const SkPath& clip,
                              float scale) {
   // Existing background paint (unchanged) ...
+  PaintThriveOSTabGlow(canvas, clip, scale);
 }

+void Tab::PaintThriveOSTabGlow(gfx::Canvas* canvas,
+                                const SkPath& clip,
+                                float scale) {
+  // Identify which ThriveOS tab this is (if any) by checking the tab URL.
+  GURL url = GetTabUrl(data_);
+  thriveos::ThriveOSTabKind kind = thriveos::GetThriveOSTabKind(url);
+  if (kind == thriveos::ThriveOSTabKind::kNone) return;
+
+  gfx::Rect bounds = GetLocalBounds();
+  cc::PaintFlags flags;
+  flags.setAntiAlias(true);
+  flags.setStyle(cc::PaintFlags::kStroke_Style);
+
+  if (kind == thriveos::ThriveOSTabKind::kOverview) {
+    // Overview: subtle purple glow border around the entire tab
+    // Primary border — medium purple, semi-transparent
+    flags.setColor(SkColorSetARGB(80, 167, 139, 250));   // rgba(167,139,250,0.31)
+    flags.setStrokeWidth(1.5f * scale);
+    flags.setLooper(skia::CreateEventuallyConsistentBlurDrawLooper(3.0f * scale,
+                                                                    SkPoint::Make(0, 0),
+                                                                    SkColorSetARGB(50, 167, 139, 250)));
+    SkRect rect = SkRect::MakeLTRB(
+        bounds.x() + 1, bounds.y() + 1,
+        bounds.right() - 1, bounds.bottom() - 1);
+    canvas->sk_canvas()->drawRoundRect(rect, 6.0f * scale, 6.0f * scale, flags);
+
+    // Outer soft glow layer
+    flags.setColor(SkColorSetARGB(30, 196, 181, 253));   // rgba(196,181,253,0.12)
+    flags.setStrokeWidth(3.0f * scale);
+    SkRect outerRect = SkRect::MakeLTRB(
+        bounds.x(), bounds.y(),
+        bounds.right(), bounds.bottom());
+    canvas->sk_canvas()->drawRoundRect(outerRect, 7.0f * scale, 7.0f * scale, flags);
+
+  } else {
+    // Bizbox / Lifebud: thin glowing underline at the bottom of the tab
+    SkColor lineColor = (kind == thriveos::ThriveOSTabKind::kBizbox)
+        ? SkColorSetARGB(210, 147, 197, 253)   // pastel blue
+        : SkColorSetARGB(210, 249, 168, 212);  // pastel pink
+
+    flags.setStyle(cc::PaintFlags::kFill_Style);
+    flags.setColor(lineColor);
+    flags.setLooper(skia::CreateEventuallyConsistentBlurDrawLooper(
+        4.0f * scale, SkPoint::Make(0, 0), lineColor));
+
+    // 1.5px line spanning tab width inset by 4px each side
+    float lineY = bounds.bottom() - 1.5f * scale;
+    canvas->sk_canvas()->drawRoundRect(
+        SkRect::MakeLTRB(bounds.x() + 4, lineY,
+                         bounds.right() - 4, lineY + 1.5f * scale),
+        1.0f, 1.0f, flags);
+  }
+}
