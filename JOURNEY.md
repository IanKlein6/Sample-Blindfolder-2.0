# The BlindFolder 2.0 Journey

This document captures the personal and technical journey of developing the second version of BlindFolder, an application that automates the blinding of microscopy files.

## 🎯 Motivation
I built BlindFolder 2.0 to solve a real-world problem encountered in scientific labs — the tedious and error-prone task of blinding microscopy images. I collaborated with a doctoral student from the University of Freiburg to build a better tool that combines automation with a clean, professional interface.

## 🧪 Early Challenges
- **Preload script errors**: Electron wouldn't load the preload file from the `asar` bundle.
- **IPC failures**: Menu actions silently failed because `window.electronAPI` was undefined in production.
- **Asset management**: Icons weren’t visible on light backgrounds until I rebuilt them with proper contrast.
- **Build debugging**: Repeated trial and error to get `electron-builder` to create a single portable `.exe`.

## ⚙️ Debugging Process
- Learned how to inspect `.asar` contents to check if files were missing.
- Used the terminal heavily to test `.exe` launches, logs, and permissions.
- Used `electron-builder --dir` and `--portable` targets to test multiple output types.

## 🏆 Milestones
- ✔️ Built working UI with Material-UI and theming
- ✔️ Connected React to Electron IPC cleanly
- ✔️ Packaged final version as a single-file `.exe` and `.dmg`
- ✔️ Wrote comprehensive README, added licensing, and published to GitHub

## 🚀 What I Learned
- Deeper understanding of Electron architecture (main vs renderer, preload security)
- IPC best practices
- The value of clear logging and separation of concerns
- How to automate builds with `electron-builder`

## 🙌 Final Reflection
This was a real learning journey. I built something from the ground up, debugged difficult platform issues, and created something I’m proud to share. I learned how to build, document, and distribute a real desktop app.