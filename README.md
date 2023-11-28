# Data Donation Importers

This repository contains an NPM module for extracting data from Data Download Packages (DDP) ([https://www.aup-online.com/content/journals/10.5117/CCR2022.2.001.ARAU](See Araujo et al.)).
It provides a standardized approach for writing _recipes_ for extracting data from CSV, JSON and HTML files, with support for DDPs in multiple languages.
For the majority of DDPs this standardized approach is sufficiently flexible.

Please note that this module is still experimental, and primarily designed for use within our research team.
It is currently being used and tested in the (https://github.com/ccs-amsterdam/DigitalFootprintsLab)[DigitalFootprintsLab] application.
As it has now been successfully used in several studies, the future goal is to properly clean it up and offer it as a modular component that can be used in other data donation applications.

# Demo

A demo version can be found [https://kasperwelbers.github.io/data-donation-importers](here).
You can upload a file, folder or zip file, and create an extraction 'recipe'.
If the zip file is a Google Takeout package, you can also select one of the example recipes.

# Development guide

This repository doubles as containing the NPM module with the importer components, and as a GUI for trying them out and developing recipes.
The module parts are in src/lib. The GUI stuff is in src/AppComponents. Run the following terminal comments to install the module and run the GUI.

```bash
npm install
npm start
```

The components can then be exported in src/lib/index.js, and published to NPM.
(don't forget to increment version)

```bash
npm run build_npm
npm publish
```
