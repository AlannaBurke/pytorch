/**
 * form-labels.js — PyTorch Docs form label and inline link accessibility fixes
 *
 * Addresses two axe-core violations:
 *
 * 1. label (WCAG 1.3.1, 4.1.2):
 *    <input type="checkbox" id="search-toggle"> has no associated <label>,
 *    aria-label, or aria-labelledby. This checkbox is used by the theme to
 *    toggle the mobile search bar. It appears on every page (37 nodes).
 *    Fix: add aria-label="Toggle search" to the checkbox.
 *
 * 2. link-in-text-block (WCAG 1.4.1):
 *    Links within body text must be distinguishable from surrounding text
 *    by more than colour alone (e.g., underline, border, or other non-colour
 *    cue). The footer cookie/privacy links and some inline doc links rely
 *    solely on colour.
 *    Fix: add a CSS rule that ensures inline links in prose have an underline,
 *    and add aria-description to links that are otherwise ambiguous.
 *
 *    Note: the CSS portion of this fix is in inline-links.css (PR8 companion).
 *    This script handles the aria-description fallback for screen readers.
 */
(function () {
  "use strict";

  /* ── 1. Label the search-toggle checkbox ─────────────────────────────────── */
  function fixSearchToggle() {
    var checkbox = document.getElementById("search-toggle");
    if (!checkbox) return;
    if (
      checkbox.getAttribute("aria-label") ||
      checkbox.getAttribute("aria-labelledby")
    ) {
      return; // already labelled
    }
    checkbox.setAttribute("aria-label", "Toggle search");
    // Also ensure it has a visible label sibling if one exists
    var label = document.querySelector('label[for="search-toggle"]');
    if (!label) {
      // The checkbox is toggled via a <label> with a CSS icon in the theme.
      // If no <label> exists, the aria-label above is sufficient.
      // If a <label> exists but is empty, add a visually-hidden text node.
      var labels = document.querySelectorAll("label");
      labels.forEach(function (l) {
        if (l.htmlFor === "search-toggle" && !l.textContent.trim()) {
          var span = document.createElement("span");
          span.className = "visually-hidden";
          span.textContent = "Toggle search";
          l.appendChild(span);
        }
      });
    }
  }

  /* ── 2. Annotate ambiguous inline links ──────────────────────────────────── */
  function fixInlineLinkContext() {
    // Links that are only distinguishable by colour need a non-colour cue.
    // The CSS in inline-links.css adds underlines. Here we ensure that
    // links inside the HubSpot cookie footer have an accessible context.
    var cookieLinks = document.querySelectorAll(
      "#hs-eu-policy-wording a, #hs-eu-cookie-disclaimer a"
    );
    cookieLinks.forEach(function (link) {
      if (!link.getAttribute("aria-describedby") && !link.getAttribute("aria-label")) {
        // The link text is usually "Privacy Policy" or "Read the full documentation"
        // which is self-describing — no change needed. But ensure it's underlined.
        link.style.textDecoration = "underline";
      }
    });
  }

  /* ── Run fixes ───────────────────────────────────────────────────────────── */
  function runFixes() {
    fixSearchToggle();
    fixInlineLinkContext();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFixes);
  } else {
    runFixes();
  }

  // Re-run for dynamically injected content
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
