/**
 * Theme presets for HelpButton.qs.
 *
 * Each preset defines a complete set of color values for the toolbar button,
 * popup panel, and default menu-item colors. Values use the Qlik color-picker
 * object format so they can be stored directly in the layout.
 *
 * The user selects a preset from a dropdown in the property panel. On change,
 * the preset colors are written into the layout, updating every color-picker.
 * Individual color-picker overrides still work after selecting a preset.
 *
 * Preset names match Onboard.qs for consistency across the Ptarmigan Labs
 * extension ecosystem.
 */

import { toPickerObj } from "../util/color";

/**
 * Default — neutral, minimal grey palette.
 */
export const defaultPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#595959"),
    backgroundColorHover: toPickerObj("#404040"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#595959"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#595959"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#595959"),
    headerTextColor: toPickerObj("#ffffff"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#595959"),
    bgColor: toPickerObj("#f5f5f5"),
    bgColorHover: toPickerObj("#e8e8e8"),
    textColor: toPickerObj("#333333"),
  },
};

/**
 * The Lean Green Machine — full-spectrum Qlik green.
 */
export const leanGreenPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#009845"),
    backgroundColorHover: toPickerObj("#007a38"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#009845"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#006b30"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#006b30"),
    headerTextColor: toPickerObj("#ffffff"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#009845"),
    bgColor: toPickerObj("#e8f5ee"),
    bgColorHover: toPickerObj("#c8ebd5"),
    textColor: toPickerObj("#004d25"),
  },
};

/**
 * Corporate Blue — authoritative blue palette with gold accents.
 */
export const corporateBluePreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#165a9b"),
    backgroundColorHover: toPickerObj("#12487c"),
    textColor: toPickerObj("#ffffff"),
    borderColor: toPickerObj("#0e3b65"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#0c3256"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#0c3256"),
    headerTextColor: toPickerObj("#ffcc33"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#165a9b"),
    bgColor: toPickerObj("#f0f6fc"),
    bgColorHover: toPickerObj("#dbeafe"),
    textColor: toPickerObj("#0c3256"),
  },
};

/**
 * Corporate Gold — warm gold palette with blue accents.
 */
export const corporateGoldPreset = {
  buttonStyle: {
    backgroundColor: toPickerObj("#ffcc33"),
    backgroundColorHover: toPickerObj("#ffe494"),
    textColor: toPickerObj("#222222"),
    borderColor: toPickerObj("#222222"),
    borderRadius: "4px",
  },
  popupStyle: {
    borderColor: toPickerObj("#0c3256"),
    borderRadius: "8px",
    headerBackgroundColor: toPickerObj("#0c3256"),
    headerTextColor: toPickerObj("#ffcc33"),
    separatorColor: toPickerObj("#e0e0e0"),
  },
  menuItemDefaults: {
    iconColor: toPickerObj("#165a9b"),
    bgColor: toPickerObj("#fffae6"),
    bgColorHover: toPickerObj("#fff3c4"),
    textColor: toPickerObj("#222222"),
  },
};

/**
 * Map of preset key → preset object.
 */
export const PRESETS = {
  default: defaultPreset,
  leanGreen: leanGreenPreset,
  corporateBlue: corporateBluePreset,
  corporateGold: corporateGoldPreset,
};

/**
 * Human-readable labels for each preset (property panel dropdown).
 */
export const PRESET_LABELS = {
  default: "Default",
  leanGreen: "The Lean Green Machine",
  corporateBlue: "Corporate Blue",
  corporateGold: "Corporate Gold",
};

/**
 * Apply a theme preset to a layout data object.
 *
 * Copies all color values from the preset into the layout's
 * buttonStyle, popupStyle, and each menu item's colors.
 *
 * @param {object} data - Extension layout data (mutated in place).
 * @param {string} presetKey - Key from PRESETS.
 */
export function applyPreset(data, presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  // Button style
  if (!data.buttonStyle) data.buttonStyle = {};
  Object.assign(data.buttonStyle, preset.buttonStyle);

  // Popup style
  if (!data.popupStyle) data.popupStyle = {};
  Object.assign(data.popupStyle, preset.popupStyle);

  // Menu item colors — apply preset defaults to every item
  if (data.menuItems && Array.isArray(data.menuItems)) {
    data.menuItems.forEach((item) => {
      item.iconColor = preset.menuItemDefaults.iconColor;
      item.bgColor = preset.menuItemDefaults.bgColor;
      item.bgColorHover = preset.menuItemDefaults.bgColorHover;
      item.textColor = preset.menuItemDefaults.textColor;
    });
  }
}
