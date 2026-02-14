# Qlik Sense Help Button

This repository contains different implementations (variants) of an add-on help button for the client-managed Qlik Sense Enterprise On Windows to suit different environment needs.

The help button is designed to be injected into the Qlik Sense toolbar, providing users with quick access to support resources or custom and configurable help directly within the Qlik Sense interface.

## Functionality

The main purpose of this tool is to inject a helpful button into the Qlik Sense toolbar, assisting users with context-aware help or general support links.

Qlik's own help button takes the user to Qlik's online help resources, which are great but maybe not always ideal for organizations that have custom documentation or want to provide specific support links. This add-on allows for a more tailored help experience.

![Qlik Sense Help Button Demo](./variants/bug-report/docs/screenshot-animated.gif)

## Variants

Current available variants:

* **[Basic](./variants/basic/README.md)**
  * A vanilla JavaScript implementation.
  * Zero dependencies.
  * Injects directly via `client.html` in the standard Qlik Sense web client.
  * Best for simple setups where minimizing complexity is key.

* **[Bug Report](./variants/bug-report/README.md)**
  * Everything in Basic, plus a built-in **Bug Report** dialog.
  * Clicking "Report a bug" opens a modal pre-populated with Qlik Sense context (user ID, name, Sense version, app ID, sheet ID, URL).
  * The user adds a free-text description and submits — the report is POSTed as JSON to a configurable webhook endpoint.
  * Flexible authentication: no auth, custom header, Sense session passthrough, or arbitrary headers.
  * Zero dependencies, vanilla JavaScript.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
