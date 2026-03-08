# The Journey to BlindFolder 2.0

This document captures the technical and personal development journey of creating **BlindFolder 2.0**, a production-ready desktop application designed to automate the "blinding" of microscopy images in scientific research environments. What began as a lightweight tool evolved into a polished, cross-platform utility built with real-world lab workflows in mind.

---

## Motivation

The idea for BlindFolder came from a concrete need: reduce bias and save time during image analysis in biological research. Manual blinding of microscopy samples — especially in confocal microscopy of Drosophila cells — was tedious and error-prone. I partnered with Medical Doctoral student **Jost Wiggering** at the University of Freiburg to design a better solution.

BlindFolder 1.0 was a minimal utility that simply renamed folders. With real lab usage came feedback and a need for a more refined tool. That feedback guided the creation of BlindFolder 2.0.

---

## Early Challenges

### Preload Script Failures

One of the most frustrating hurdles came early in the packaging phase: **Electron would not load preload scripts correctly** when bundled inside the `.asar` archive. This caused IPC bridges (`window.electronAPI`) to silently fail in production. We solved this by unpacking preload scripts explicitly using `asarUnpack`, ensuring that context bridges were always available.

### Icons and Assets

UI assets disappeared when switching to light themes. The issue? Our icon set lacked contrast and proper transparency. We recreated assets with clear backgrounds and appropriate color contrast for both themes.

### Build Instability

Getting a portable Windows `.exe` and a working macOS `.dmg` was anything but smooth. Initial builds would crash or hang, and logging in packaged apps was non-existent. I learned to launch `.app` bundles manually from the terminal and read `console.log` output in real time. For `.exe` builds, I used `cmd` to verify behavior and ensure all assets were bundled.

---

## Solving Real-World Issues

### Persistent Settings

BlindFolder had to remember user preferences across sessions. I implemented a `localStorage`-based system to persist values like theme, whether to show instructions on startup, and update settings. React components were updated to initialize their state from this store.

### Update Flow

We needed a seamless way to keep users up to date. I built a version checker that fetches the latest release from GitHub, compares it with the current version, and prompts the user with "Ignore" or "Remind Me Later" options. Users can also check manually from the settings panel.

### UI and Responsiveness

Creating a modern feel was a priority. I used **Material UI (MUI)** extensively and designed the layout using its `Grid` and `Box` components. I added a fully functional dark mode toggle and ensured responsiveness across display sizes.

### Instruction Modal

Users unfamiliar with the app needed onboarding. I created a modal that appears on first launch and can be disabled via settings. This struck a balance between user guidance and customizability.

---

## Debugging and Insights

I spent many hours learning the inner workings of Electron:

- How to safely use `contextBridge` with `preload.js`
- When IPC channels are registered and how their lifecycle works
- How to debug `.asar` bundles by inspecting their contents
- Why some renderer-side scripts fail silently if main handlers are not initialized in time
- How to run packaged `.app` and `.exe` files from the command line for logging

These lessons allowed me to fix long-standing bugs that had haunted earlier versions and ensure full reliability in production.

---

## Major Improvements Made

### New Features

- **Settings Panel**
  - Auto-update check toggle
  - Dark mode toggle
  - Instruction modal visibility toggle
  - Manual "Check for Updates Now" button

- **GitHub Update Checker**
  - Fetches latest release
  - Compares version numbers
  - Shows a non-blocking dialog with options

- **Cross-platform Build Verification**
  - `.dmg` for macOS verified on real hardware
  - Portable `.exe` for Windows tested in multiple environments with no installation needed

- **Error Handling & Logging**
  - Improved logging paths and ensured visibility in packaged apps
  - IPC failures are now clearly logged instead of failing silently

---

## Technical Lessons Learned

Throughout this journey, I gained valuable insights:

- **Electron Architecture**: The separation of main, renderer, and preload contexts is crucial. Misplacing code across these boundaries leads to subtle bugs.
- **IPC Handling**: Timing and registration order of IPC handlers matter. The preload script must be loaded *before* the renderer begins communication.
- **Build Tooling**: `electron-builder` is powerful but brittle. Configuring it for portable Windows builds and notarized macOS `.dmg` distributions took careful iteration.
- **UI/UX Thinking**: A minimal UI is not enough — responsiveness, accessibility, and customization matter just as much.
- **Cross-Platform Awareness**: Packaging, path resolution, and environment-specific behavior must be tested *on actual devices*.

---

## Final Reflection

BlindFolder 2.0 started as a niche research tool but grew into a flexible, production-grade application. Each problem I encountered was an opportunity to grow — technically and creatively.

This project has taught me how to:

- Design usable, intuitive software for non-technical users
- Debug platform-specific packaging issues
- Bridge Electron's security layers safely
- Write clear, structured documentation
- Release confidently to production

The result is an application that delivers real value in a research setting, with features that make the task of image blinding faster, safer, and more reliable.

---

## Looking Ahead

This isn’t the end of the journey. BlindFolder 2.0 lays the foundation for future expansion — whether that means supporting new scientific workflows, integrating additional image processing steps, or deploying the app across more labs.

If you’re interested in contributing ideas or collaborating on future features, feel free to reach out.

---

