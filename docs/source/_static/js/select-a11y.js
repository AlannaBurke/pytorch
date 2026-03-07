/**
 * select-a11y.js — PyTorch Docs form control accessible names
 *
 * WCAG 4.1.2 Name, Role, Value: every form control must have an accessible name.
 *
 * axe-core violation: select-name
 * Affected elements: version-switcher <select> and any other unlabelled
 * <select> elements injected by the pydata-sphinx-theme or bootstrap.
 *
 * Fix: observe the DOM for <select> elements that lack aria-label,
 * aria-labelledby, or an associated <label>, and add an appropriate
 * aria-label based on the element's context.
 */
(function () {
  "use strict";

  /**
   * Infer a descriptive label for a <select> element from its context.
   * Falls back to a generic "Select an option" label.
   */
  function inferLabel(selectEl) {
    // Version switcher: the button sibling or parent class gives context
    var container = selectEl.closest(
      ".version-switcher__container, [class*='version'], [class*='switcher']"
    );
    if (container) return "Select documentation version";

    // Search-related selects
    if (
      selectEl.closest("[class*='search']") ||
      selectEl.id.toLowerCase().includes("search")
    ) {
      return "Search options";
    }

    // Check for a visible preceding label-like element
    var prev = selectEl.previousElementSibling;
    if (prev && prev.textContent.trim()) {
      return prev.textContent.trim();
    }

    // Check parent for a heading
    var parent = selectEl.parentElement;
    if (parent) {
      var heading = parent.querySelector("h1, h2, h3, h4, h5, h6, legend");
      if (heading && heading.textContent.trim()) {
        return heading.textContent.trim();
      }
    }

    return "Select an option";
  }

  /**
   * Add aria-label to any <select> that lacks an accessible name.
   */
  function labelUnnamedSelects() {
    var selects = document.querySelectorAll("select");
    selects.forEach(function (sel) {
      // Skip if already labelled
      if (
        sel.hasAttribute("aria-label") ||
        sel.hasAttribute("aria-labelledby") ||
        (sel.id && document.querySelector('label[for="' + sel.id + '"]'))
      ) {
        return;
      }
      sel.setAttribute("aria-label", inferLabel(sel));
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", labelUnnamedSelects);
  } else {
    labelUnnamedSelects();
  }

  // Re-run when the theme injects dynamic content (version switcher loads async)
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      var hasNewNodes = mutations.some(function (m) {
        return m.addedNodes.length > 0;
      });
      if (hasNewNodes) {
        labelUnnamedSelects();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
