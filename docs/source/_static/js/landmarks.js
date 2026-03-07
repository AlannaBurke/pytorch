/**
 * landmarks.js — PyTorch Docs landmark and region accessibility fixes
 *
 * Addresses the following axe-core violations:
 *
 * 1. region (WCAG best-practice / 1.3.6):
 *    The HubSpot cookie banner (#hs-eu-policy-wording) renders outside any
 *    landmark region, causing axe to flag its content as "not within a
 *    landmark". Fix: wrap the banner in a <section role="dialog"> with an
 *    aria-label so it is properly announced.
 *
 * 2. landmark-unique (WCAG best-practice):
 *    Multiple <nav> elements on the same page must have distinct
 *    accessible names. The sidebar and header both render <nav> without
 *    aria-label. Fix: add aria-label to each <nav> based on its position.
 *
 * 3. link-name (WCAG 4.1.2 / 2.4.4):
 *    The logo link <a class="logo logo-img-1x"> has no text content or
 *    aria-label. Fix: add aria-label="PyTorch home" to logo links.
 */
(function () {
  "use strict";

  /* ── 1. Cookie banner region fix ────────────────────────────────────────── */
  function fixCookieBannerRegion() {
    var banner = document.getElementById("hs-eu-cookie-confirmation");
    if (!banner) return;
    if (
      banner.getAttribute("role") === "dialog" ||
      banner.getAttribute("role") === "region"
    ) {
      return; // already fixed
    }
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("aria-modal", "false");
    // Ensure the inner wording div is not a bare region
    var wording = document.getElementById("hs-eu-policy-wording");
    if (wording && !wording.getAttribute("role")) {
      wording.setAttribute("role", "document");
    }
  }

  /* ── 2. Landmark uniqueness fix ─────────────────────────────────────────── */
  function fixDuplicateLandmarks() {
    // Label <nav> elements that don't already have aria-label / aria-labelledby
    var navEls = document.querySelectorAll("nav:not([aria-label]):not([aria-labelledby])");
    navEls.forEach(function (nav) {
      // Identify by class or position
      if (
        nav.classList.contains("bd-sidebar-primary") ||
        nav.closest(".bd-sidebar-primary")
      ) {
        nav.setAttribute("aria-label", "Site navigation");
      } else if (
        nav.classList.contains("bd-sidebar-secondary") ||
        nav.closest(".bd-sidebar-secondary")
      ) {
        nav.setAttribute("aria-label", "On this page");
      } else if (
        nav.classList.contains("bd-header") ||
        nav.closest(".bd-header") ||
        nav.closest("header")
      ) {
        nav.setAttribute("aria-label", "Main navigation");
      } else if (nav.classList.contains("bd-breadcrumbs") || nav.closest(".bd-breadcrumbs")) {
        nav.setAttribute("aria-label", "Breadcrumb");
      } else if (nav.classList.contains("prev-next") || nav.closest(".prev-next-area")) {
        nav.setAttribute("aria-label", "Page navigation");
      } else {
        // Generic fallback — only if no other nav has this label
        var existing = document.querySelectorAll('nav[aria-label="Navigation"]');
        if (existing.length === 0) {
          nav.setAttribute("aria-label", "Navigation");
        }
      }
    });

    // Also label duplicate <main> elements (landmark-one-main)
    var mains = document.querySelectorAll("main");
    if (mains.length > 1) {
      mains.forEach(function (main, i) {
        if (!main.getAttribute("aria-label") && i > 0) {
          main.setAttribute("aria-label", "Secondary content " + i);
        }
      });
    }
  }

  /* ── 3. Logo link accessible name ───────────────────────────────────────── */
  function fixLogoLinks() {
    var logoLinks = document.querySelectorAll(
      "a.logo, a.logo-img-1x, a.navbar-brand, a[class*='logo']"
    );
    logoLinks.forEach(function (link) {
      if (
        link.getAttribute("aria-label") ||
        link.getAttribute("aria-labelledby") ||
        link.textContent.trim()
      ) {
        return;
      }
      link.setAttribute("aria-label", "PyTorch home");
    });
  }

  /* ── Run all fixes ───────────────────────────────────────────────────────── */
  function runFixes() {
    fixCookieBannerRegion();
    fixDuplicateLandmarks();
    fixLogoLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFixes);
  } else {
    runFixes();
  }

  // Re-run when dynamic content loads (cookie banner injects after page load)
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      var hasNewNodes = mutations.some(function (m) {
        return m.addedNodes.length > 0;
      });
      if (hasNewNodes) {
        runFixes();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
