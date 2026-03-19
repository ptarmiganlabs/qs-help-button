/**
 * Modal Markdown editor dialog for HelpButton.qs property panel.
 *
 * Opens a full-featured Markdown editor with:
 *   - Live preview pane (rendered Markdown → HTML)
 *   - Formatting toolbar (Bold, Italic, Code, Link, OL, UL, Blockquote)
 *   - Keyboard shortcuts via attachMarkdownShortcuts()
 *   - Character counter (respects maxlength)
 *   - Save / Cancel actions
 *
 * Usage from the property panel:
 *   openMarkdownEditor({ value, maxlength, title, onSave })
 */

import { markdownToHtml } from "../util/markdown";
import {
  attachMarkdownShortcuts,
  applyBold,
  applyItalic,
  applyCode,
  applyLink,
  applyOrderedList,
  applyUnorderedList,
  applyBlockquote,
} from "../util/markdown-shortcuts";
import { makeSvg } from "./icons";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PREFIX = "hbqs-md-editor";

// Toolbar button definitions
const TOOLBAR_ITEMS = [
  {
    key: "bold",
    title: "Bold (Ctrl+B)",
    icon: "<strong>B</strong>",
    action: applyBold,
  },
  {
    key: "italic",
    title: "Italic (Ctrl+I)",
    icon: "<em>I</em>",
    action: applyItalic,
  },
  {
    key: "code",
    title: "Inline code (Ctrl+E)",
    icon: "&lt;/&gt;",
    action: applyCode,
  },
  {
    key: "link",
    title: "Link (Ctrl+K)",
    // chain-link SVG icon
    icon: null,
    svgKey: "link",
    action: applyLink,
  },
  { key: "sep1", separator: true },
  {
    key: "ol",
    title: "Ordered list (Ctrl+Shift+7)",
    icon: "1.",
    action: applyOrderedList,
  },
  {
    key: "ul",
    title: "Unordered list (Ctrl+Shift+8)",
    icon: "•",
    action: applyUnorderedList,
  },
  {
    key: "quote",
    title: "Blockquote (Ctrl+Shift+.)",
    icon: "❝",
    action: applyBlockquote,
  },
];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

/** Reference to the current backdrop element (if open). */
let activeBackdrop = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Open the Markdown editor dialog.
 *
 * @param {object} opts
 * @param {string} opts.value      - Current Markdown text.
 * @param {number} [opts.maxlength] - Character limit (omit for unlimited).
 * @param {string} [opts.title]    - Dialog heading.
 * @param {Function} opts.onSave   - Called with the new text when the user clicks Save.
 */
export function openMarkdownEditor({ value, maxlength, title, onSave }) {
  // Close any existing instance
  closeMarkdownEditor();

  // -- Backdrop --
  const backdrop = document.createElement("div");
  backdrop.className = `${PREFIX}-backdrop`;
  backdrop.addEventListener("click", closeMarkdownEditor);

  // -- Dialog --
  const dialog = document.createElement("div");
  dialog.className = `${PREFIX}-dialog`;
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", title || "Markdown editor");
  dialog.addEventListener("click", (e) => e.stopPropagation());

  // -- Header --
  const header = document.createElement("div");
  header.className = `${PREFIX}-header`;

  const titleEl = document.createElement("h3");
  titleEl.className = `${PREFIX}-title`;
  titleEl.textContent = title || "Markdown Editor";
  header.appendChild(titleEl);

  const closeBtn = document.createElement("button");
  closeBtn.className = `${PREFIX}-close`;
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = makeSvg("close", 16);
  closeBtn.addEventListener("click", closeMarkdownEditor);
  header.appendChild(closeBtn);

  dialog.appendChild(header);

  // -- Toolbar --
  const toolbar = document.createElement("div");
  toolbar.className = `${PREFIX}-toolbar`;

  // We'll capture the textarea reference below
  let textarea;

  TOOLBAR_ITEMS.forEach((item) => {
    if (item.separator) {
      const sep = document.createElement("span");
      sep.className = `${PREFIX}-toolbar-sep`;
      toolbar.appendChild(sep);
      return;
    }

    const btn = document.createElement("button");
    btn.className = `${PREFIX}-toolbar-btn`;
    btn.setAttribute("type", "button");
    btn.setAttribute("title", item.title);
    btn.setAttribute("tabindex", "-1");
    if (item.svgKey) {
      btn.innerHTML = makeSvg(item.svgKey, 14);
    } else {
      btn.innerHTML = item.icon;
    }
    btn.addEventListener("click", () => {
      if (textarea) {
        item.action(textarea);
        textarea.focus();
      }
    });
    toolbar.appendChild(btn);
  });

  dialog.appendChild(toolbar);

  // -- Body (editor + preview) --
  const body = document.createElement("div");
  body.className = `${PREFIX}-body`;

  // Editor pane
  const editorPane = document.createElement("div");
  editorPane.className = `${PREFIX}-editor-pane`;

  const editorLabel = document.createElement("div");
  editorLabel.className = `${PREFIX}-pane-label`;
  editorLabel.textContent = "Markdown";
  editorPane.appendChild(editorLabel);

  textarea = document.createElement("textarea");
  textarea.className = `${PREFIX}-textarea`;
  textarea.value = value || "";
  textarea.setAttribute("spellcheck", "true");
  if (maxlength) textarea.setAttribute("maxlength", String(maxlength));
  editorPane.appendChild(textarea);

  // Character counter
  const counterRow = document.createElement("div");
  counterRow.className = `${PREFIX}-counter`;

  const updateCounter = () => {
    const len = textarea.value.length;
    if (maxlength) {
      counterRow.textContent = `${len} / ${maxlength}`;
      counterRow.classList.toggle(
        `${PREFIX}-counter--warn`,
        len > maxlength * 0.9,
      );
    } else {
      counterRow.textContent = `${len} characters`;
    }
  };
  updateCounter();
  editorPane.appendChild(counterRow);

  body.appendChild(editorPane);

  // Preview pane
  const previewPane = document.createElement("div");
  previewPane.className = `${PREFIX}-preview-pane`;

  const previewLabel = document.createElement("div");
  previewLabel.className = `${PREFIX}-pane-label`;
  previewLabel.textContent = "Preview";
  previewPane.appendChild(previewLabel);

  const preview = document.createElement("div");
  preview.className = `${PREFIX}-preview hbqs-markdown-content`;
  preview.innerHTML = markdownToHtml(value || "");
  previewPane.appendChild(preview);

  body.appendChild(previewPane);
  dialog.appendChild(body);

  // -- Footer --
  const footer = document.createElement("div");
  footer.className = `${PREFIX}-footer`;

  const cancelBtn = document.createElement("button");
  cancelBtn.className = `${PREFIX}-btn ${PREFIX}-btn--cancel`;
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", closeMarkdownEditor);
  footer.appendChild(cancelBtn);

  const saveBtn = document.createElement("button");
  saveBtn.className = `${PREFIX}-btn ${PREFIX}-btn--save`;
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    if (typeof onSave === "function") {
      onSave(textarea.value);
    }
    closeMarkdownEditor();
  });
  footer.appendChild(saveBtn);

  dialog.appendChild(footer);

  // -- Wire up live preview + counter --
  textarea.addEventListener("input", () => {
    preview.innerHTML = markdownToHtml(textarea.value);
    updateCounter();
  });

  // -- Keyboard shortcuts --
  attachMarkdownShortcuts(textarea);

  // -- Escape to close --
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      closeMarkdownEditor();
    }
  };
  document.addEventListener("keydown", onKeyDown);
  backdrop._hbqsKeyHandler = onKeyDown;

  // -- Mount --
  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);
  activeBackdrop = backdrop;

  // Focus textarea
  textarea.focus();
}

/**
 * Close the Markdown editor dialog if open.
 */
export function closeMarkdownEditor() {
  if (activeBackdrop) {
    if (activeBackdrop._hbqsKeyHandler) {
      document.removeEventListener("keydown", activeBackdrop._hbqsKeyHandler);
    }
    activeBackdrop.remove();
    activeBackdrop = null;
  }
}
