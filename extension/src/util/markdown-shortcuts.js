/**
 * Markdown keyboard-shortcut helpers for HelpButton.qs.
 *
 * Attaches common formatting shortcuts to a <textarea> element:
 *   - Ctrl/Cmd + B → **bold**
 *   - Ctrl/Cmd + I → *italic*
 *   - Ctrl/Cmd + K → [text](url)
 *
 * Each shortcut wraps the current selection (or inserts placeholder
 * text when nothing is selected) and fires an `input` event so that
 * character counters and submit-state listeners stay in sync.
 */

/**
 * Wrap (or insert) Markdown syntax around the current selection in a
 * textarea.
 *
 * @param {HTMLTextAreaElement} textarea - Target element.
 * @param {string} before - Prefix to insert before the selection.
 * @param {string} after  - Suffix to insert after the selection.
 * @param {string} [placeholder] - Fallback text when nothing is selected.
 */
function wrapSelection(textarea, before, after, placeholder) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);
  const inner = selected || placeholder || "";

  // Build the replacement
  const replacement = before + inner + after;
  textarea.value = value.slice(0, start) + replacement + value.slice(end);

  // Place cursor: if there was a selection keep it highlighted inside
  // the markers; otherwise select the placeholder so the user can
  // immediately type over it.
  const newStart = start + before.length;
  const newEnd = newStart + inner.length;
  textarea.selectionStart = newStart;
  textarea.selectionEnd = newEnd;
  textarea.focus();

  // Notify listeners (character counters, submit-state, etc.)
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Handle the Ctrl/Cmd + K shortcut for inserting a Markdown link.
 *
 * If text is selected it becomes the link text; otherwise a
 * placeholder is used for both text and URL parts.
 *
 * @param {HTMLTextAreaElement} textarea - Target element.
 */
function insertLink(textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  if (selected) {
    // Use selection as link text, place cursor inside the URL part
    const replacement = "[" + selected + "](url)";
    textarea.value = value.slice(0, start) + replacement + value.slice(end);
    // Select "url" so the user can type the actual URL immediately
    const urlStart = start + selected.length + 3; // after "[text]("
    textarea.selectionStart = urlStart;
    textarea.selectionEnd = urlStart + 3; // length of "url"
  } else {
    const replacement = "[text](url)";
    textarea.value = value.slice(0, start) + replacement + value.slice(end);
    // Select "text" so user can type the link label
    textarea.selectionStart = start + 1;
    textarea.selectionEnd = start + 5; // length of "text"
  }

  textarea.focus();
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Attach Markdown keyboard shortcuts to a textarea element.
 *
 * @param {HTMLTextAreaElement} textarea - The textarea to enhance.
 */
export function attachMarkdownShortcuts(textarea) {
  if (!textarea) return;

  textarea.addEventListener("keydown", (e) => {
    // Require Ctrl (Windows/Linux) or Cmd (macOS)
    if (!e.ctrlKey && !e.metaKey) return;
    // Ignore if other modifiers (Shift, Alt) are also pressed
    if (e.altKey) return;

    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        wrapSelection(textarea, "**", "**", "bold");
        break;
      case "i":
        e.preventDefault();
        wrapSelection(textarea, "*", "*", "italic");
        break;
      case "k":
        e.preventDefault();
        insertLink(textarea);
        break;
      // no default — let all other shortcuts pass through
    }
  });
}
