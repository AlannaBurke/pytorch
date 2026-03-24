/**
 * keyboard-nav.js — PyTorch Docs keyboard navigation
 *
 * WCAG 2.1.1 Keyboard: scrollable regions must be keyboard-accessible.
 *
 * axe-core violation: scrollable-region-focusable
 * Affected elements: .highlight divs and .codeblock-height-limiter divs
 * whose content overflows horizontally or vertically.
 *
 * Fix: add tabindex="0" and role="region" with an aria-label to any
 * scrollable container that is not already focusable.
 */
(function () {
  "use strict";

  function makeScrollableRegionsFocusable() {
    // Select all code block wrappers and height-limited blocks
    var scrollableSelectors = [
      ".highlight",
      ".codeblock-height-limiter",
    ];

    scrollableSelectors.forEach(function (selector) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el) {
        // Only add tabindex if the element actually overflows
        var overflowsX = el.scrollWidth > el.clientWidth;
        var overflowsY = el.scrollHeight > el.clientHeight;

        if (overflowsX || overflowsY) {
          // Don't override if already focusable
          if (!el.hasAttribute("tabindex")) {
            el.setAttribute("tabindex", "0");
          }
          // Add role and label if not already set
          if (!el.hasAttribute("role")) {
            el.setAttribute("role", "region");
          }
          if (!el.hasAttribute("aria-label")) {
            el.setAttribute(
              "aria-label",
              "Code example — use arrow keys to scroll"
            );
          }
          // Add visual scroll hint class
          el.classList.add("is-scrollable");
        }
      });
    });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", makeScrollableRegionsFocusable);
  } else {
    makeScrollableRegionsFocusable();
  }

  // Re-run after any dynamic content loads (e.g., sphinx-design tabs)
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
          makeScrollableRegionsFocusable();
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
