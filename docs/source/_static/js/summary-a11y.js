/**
 * summary-a11y.js — PyTorch Docs <summary> accessible names
 *
 * WCAG 4.1.2 Name, Role, Value: interactive elements must have accessible names.
 *
 * axe-core violation: summary-name (962 nodes across 51 pages)
 *
 * Two patterns identified in the audit:
 *
 * Pattern A — API reference pages (torch.html, nn.html, etc.):
 *   <details><summary></summary>...</details>
 *   The <summary> is completely empty. The parent <details> wraps a
 *   parameter group (e.g., "Parameters", "Returns", "Raises").
 *   Fix: infer the label from the first heading or dt inside <details>,
 *   or from a data attribute set by Sphinx.
 *
 * Pattern B — Sidebar navigation (tutorials, all pages):
 *   <summary>
 *     <span class="toctree-toggle" role="presentation">
 *       <i class="fa-solid fa-chevron-down"></i>
 *     </span>
 *   </summary>
 *   The only child has role="presentation" so its text is hidden from AT.
 *   The <details> wraps a sidebar nav section whose label is in the
 *   preceding <a> sibling of the parent <li>.
 *   Fix: find the associated nav link text and set aria-label on <summary>.
 */
(function () {
  "use strict";

  /**
   * Infer an accessible label for a <summary> element.
   * Returns null if no label can be determined.
   */
  function inferSummaryLabel(summaryEl) {
    var details = summaryEl.parentElement;
    if (!details) return null;

    // Pattern B: sidebar toctree toggle
    // The parent <li> has a preceding <a> with the section title
    var li = details.closest("li");
    if (li) {
      // Look for a direct child <a> of the <li> (sibling of <details>)
      var link = li.querySelector(":scope > a, :scope > p > a");
      if (link && link.textContent.trim()) {
        return "Toggle section: " + link.textContent.trim();
      }
      // Also check for a <span> with the title
      var span = li.querySelector(":scope > span.caption-text, :scope > p");
      if (span && span.textContent.trim()) {
        return "Toggle section: " + span.textContent.trim();
      }
    }

    // Pattern A: API parameter details block
    // Look for a heading or field-name inside <details>
    var heading = details.querySelector(
      "h1, h2, h3, h4, h5, h6, .field-name, dt, .rubric, p.rubric"
    );
    if (heading && heading.textContent.trim()) {
      return heading.textContent.trim();
    }

    // Check for a data-label attribute set by Sphinx extensions
    if (details.dataset && details.dataset.label) {
      return details.dataset.label;
    }

    // Check aria-label on the <details> itself
    if (details.getAttribute("aria-label")) {
      return details.getAttribute("aria-label");
    }

    // Last resort: use the text of the first visible text node inside <details>
    var walker = document.createTreeWalker(
      details,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Skip the summary itself
          if (parent === summaryEl || summaryEl.contains(parent)) {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip hidden elements
          var style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") {
            return NodeFilter.FILTER_REJECT;
          }
          var text = node.textContent.trim();
          return text.length > 2
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        },
      }
    );
    var textNode = walker.nextNode();
    if (textNode) {
      var text = textNode.textContent.trim();
      // Truncate long text
      return text.length > 60 ? text.substring(0, 57) + "…" : text;
    }

    return null;
  }

  /**
   * Check if a <summary> element has an accessible name.
   */
  function hasAccessibleName(summaryEl) {
    // Direct aria-label
    if (summaryEl.getAttribute("aria-label")) return true;
    // aria-labelledby pointing to a valid element
    var labelledBy = summaryEl.getAttribute("aria-labelledby");
    if (labelledBy) {
      var labelEl = document.getElementById(labelledBy);
      if (labelEl && labelEl.textContent.trim()) return true;
    }
    // Non-empty text content (excluding role="presentation" children)
    var clone = summaryEl.cloneNode(true);
    // Remove presentation children from clone
    clone.querySelectorAll('[role="presentation"]').forEach(function (el) {
      el.remove();
    });
    if (clone.textContent.trim()) return true;

    return false;
  }

  /**
   * Fix all <summary> elements that lack accessible names.
   */
  function fixSummaryElements() {
    var summaries = document.querySelectorAll("summary");
    summaries.forEach(function (summary) {
      if (hasAccessibleName(summary)) return;

      var label = inferSummaryLabel(summary);
      if (label) {
        summary.setAttribute("aria-label", label);
      } else {
        // Absolute fallback: generic expand/collapse label
        var details = summary.parentElement;
        var isOpen = details && details.open;
        summary.setAttribute(
          "aria-label",
          isOpen ? "Collapse section" : "Expand section"
        );
        // Update label when toggled
        if (details) {
          details.addEventListener("toggle", function () {
            summary.setAttribute(
              "aria-label",
              details.open ? "Collapse section" : "Expand section"
            );
          });
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixSummaryElements);
  } else {
    fixSummaryElements();
  }

  // Re-run when dynamic content is added (e.g., sphinx-design tabs, lazy sections)
  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      var hasNewNodes = mutations.some(function (m) {
        return m.addedNodes.length > 0;
      });
      if (hasNewNodes) {
        fixSummaryElements();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
