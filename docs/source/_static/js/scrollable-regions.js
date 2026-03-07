/**
 * scrollable-regions.js — PyTorch Docs keyboard access for scrollable code blocks
 *
 * WCAG 2.1.1 Keyboard: all functionality must be operable via keyboard.
 *
 * axe-core violation: scrollable-region-focusable (26 nodes across 4 pages)
 *
 * Pattern: <pre id="codecellN"> elements that overflow horizontally are
 * scrollable but have no tabindex, so keyboard users cannot scroll them.
 *
 * Fix: detect all <pre> elements that are horizontally or vertically
 * scrollable and add tabindex="0" so they enter the tab order, plus
 * aria-label so screen readers announce the purpose of the focusable region.
 *
 * We also add a visible focus ring via CSS (see keyboard-nav.css) so the
 * focused code block is clearly indicated.
 */
(function () {
  "use strict";

  /**
   * Check if an element is scrollable (has overflow content).
   */
  function isScrollable(el) {
    return (
      el.scrollWidth > el.clientWidth + 1 ||
      el.scrollHeight > el.clientHeight + 1
    );
  }

  /**
   * Infer a label for a code block from its context.
   */
  function inferCodeLabel(preEl) {
    // Check for a preceding heading
    var parent = preEl.parentElement;
    if (parent) {
      // Look for a heading sibling before this <pre>
      var siblings = Array.from(parent.children);
      var idx = siblings.indexOf(preEl);
      for (var i = idx - 1; i >= 0; i--) {
        var sib = siblings[i];
        if (/^H[1-6]$/.test(sib.tagName)) {
          return "Code block: " + sib.textContent.trim();
        }
      }
      // Check grandparent for a heading
      var gp = parent.parentElement;
      if (gp) {
        var heading = gp.querySelector("h1, h2, h3, h4, h5, h6");
        if (heading) {
          return "Code block in: " + heading.textContent.trim();
        }
      }
    }
    // Use the id if present
    if (preEl.id) {
      return "Code block " + preEl.id.replace(/codecell/, "#");
    }
    return "Scrollable code block";
  }

  /**
   * Make all scrollable <pre> elements keyboard-focusable.
   */
  function makeScrollableRegionsFocusable() {
    // Target <pre> elements (code blocks) and any other scrollable containers
    var candidates = document.querySelectorAll(
      "pre, .highlight, div[class*='highlight'], .code-block-wrapper"
    );

    candidates.forEach(function (el) {
      // Skip if already focusable
      if (
        el.hasAttribute("tabindex") ||
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.tagName === "BUTTON" ||
        el.tagName === "A"
      ) {
        return;
      }

      if (isScrollable(el)) {
        el.setAttribute("tabindex", "0");
        // Add accessible label if not already present
        if (!el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
          el.setAttribute("aria-label", inferCodeLabel(el));
        }
        // Add role if not already set (pre is not a landmark role)
        if (!el.getAttribute("role")) {
          el.setAttribute("role", "region");
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", makeScrollableRegionsFocusable);
  } else {
    makeScrollableRegionsFocusable();
  }

  // Re-run after page load (some code blocks may be lazy-rendered)
  window.addEventListener("load", makeScrollableRegionsFocusable);
})();
