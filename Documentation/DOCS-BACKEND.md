# Backend Documentation

## Overview

The backend consists of three files that together form the Electron process layer of Blindfolder. They handle window creation, security, OS interactions, and all file processing logic.

```
React UI (Renderer) -> contextBridge (preload.js) -> IPC -> Main Process (main.js / electron.js) -> OS
```

---

## Files

### main.js
**Role:** Entry point for the Electron application.

Responsible for creating the main application window, setting up the native menu bar, and launching the app. Also contains two IPC handlers for opening external URLs and retrieving the app version.

- `createWindow()` — Creates the BrowserWindow with size, icon, and security preferences. Loads the app in dev or production mode.
- `open-external` — Opens a URL in the system's default browser (used for the PayPal donation link).
- `get-app-version` — Returns the app version from `package.json` via `app.getVersion()`. Used to check for updates against GitHub releases.
- `template` — Defines the native menu bar structure (File, Edit, View, Window, Help) including macOS-specific app menus.

---

### preload.js
**Role:** Security bridge between the renderer process (React UI) and the main process.

Runs in the renderer context but has access to Node.js APIs. Uses Electron's `contextBridge` to selectively expose IPC-based APIs to the React UI without leaking Node.js or Electron internals into the renderer.

- `selectFolders()` — Opens the OS folder picker (multi-select). Returns a Promise resolving to an array of selected folder paths.
- `selectDestination()` — Opens the OS folder picker (single-select). Returns a Promise resolving to a single destination folder path.
- `processFiles(data)` — Sends folder data to the main process via IPC to blind the files. Returns a Promise resolving to the path of the generated log file (.xlsx or .csv).
- `openFolder(path)` — Opens a folder in the system file explorer (Finder / File Explorer).
- `getAppVersion()` — Returns the app version string from `package.json` (e.g. `"2.0.0"`).
- `openExternal(url)` — Opens a URL in the system's default browser.
- `onMenuSelectFolders(callback)` — Listens for File > Select Folder(s) menu action (Cmd+O / Ctrl+O). Fires the callback when triggered.
- `onMenuSelectDestination(callback)` — Listens for File > Select Destination menu action (Cmd+D / Ctrl+D). Fires the callback when triggered.

---

### electron.js
**Role:** The application's processing center.

Contains all IPC handlers that perform OS-level operations — folder selection, file blinding, and folder opening. Also contains the utility functions used during processing.

**IPC Handlers:**
- `select-folders` — Opens the OS folder picker with multi-select. Returns an array of selected folder paths.
- `select-destination` — Opens the OS folder picker with single-select. Returns the path of the selected destination folder.
- `process-folders` — Core processing handler. Collects all files from the selected folders, shuffles them randomly, copies them to the destination with anonymized names (`[prefix]_sample_1`, `_sample_2`, etc.), and generates a mapping log file (.xlsx or .csv). Returns the path to the log file.
- `open-folder` — Opens a folder path in the system file explorer using `shell.openPath()`.

**Functions:**
- `shuffleArray(array)` — Randomly shuffles an array in place using the Fisher-Yates algorithm. Used to randomize files before blinding.
- `extractNumberForSorting(filename)` — Extracts the first number from a filename as an integer. Used to sort rows correctly in the generated spreadsheet.

---

## IPC Channel Reference

All channels flow from Renderer to Main unless noted.

- `select-folders` — defined in `electron.js`, exposed via `preload.js`
- `select-destination` — defined in `electron.js`, exposed via `preload.js`
- `process-folders` — defined in `electron.js`, exposed via `preload.js`
- `open-folder` — defined in `electron.js`, exposed via `preload.js`
- `get-app-version` — defined in `main.js`, exposed via `preload.js`
- `open-external` — defined in `main.js`, exposed via `preload.js`
- `menu-select-folders` — Main to Renderer, fired by File menu in `main.js`, received in `preload.js`
- `menu-select-destination` — Main to Renderer, fired by File menu in `main.js`, received in `preload.js`

---

## Security Model

Electron's `contextIsolation` is enabled and `nodeIntegration` is disabled. This means the React UI has no direct access to Node.js or Electron APIs. All communication goes through `preload.js` via `contextBridge`, which acts as a controlled gateway — only the explicitly defined functions are accessible to the renderer.
