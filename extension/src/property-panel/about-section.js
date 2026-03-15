/**
 * About — property panel section.
 *
 * @module property-panel/about-section
 */

import { PACKAGE_VERSION } from "../util/logger";

const aboutSection = {
  type: "items",
  label: "About",
  items: {
    headerText: {
      component: "text",
      label: `HelpButton.qs v${PACKAGE_VERSION}\nConfigurable help button for Qlik Sense.`,
    },
    linkGithub: {
      component: "link",
      label: "GitHub — docs & source",
      url: "https://github.com/ptarmiganlabs/help-button.qs",
    },
    linkIssues: {
      component: "link",
      label: "Report a bug / request a feature",
      url: "https://github.com/ptarmiganlabs/help-button.qs/issues/new/choose",
    },
    linkPtarmigan: {
      component: "link",
      label: "Ptarmigan Labs",
      url: "https://ptarmiganlabs.com",
    },
  },
};

export default aboutSection;
