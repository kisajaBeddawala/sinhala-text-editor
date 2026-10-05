# Sinhala Canvas

Sinhala Canvas is a modern, responsive web application built with **Next.js + TypeScript** that allows users to create beautiful Sinhala text-based images for social media.

## Features

- **Live Preview:** Immediate visual feedback with an accurate, 1:1 responsive preview of the final export.
- **Sinhala Font Support:** Fully integrated with Sinhala web fonts (e.g., Noto Sans Sinhala, Abhaya Libre) for perfect Unicode rendering.
- **Typography Controls:** Customization for font size, weight, bold, italic, line height, letter spacing, and alignment.
- **Backgrounds:** Support for solid colors and gradients (with directional controls), along with beautiful built-in presets.
- **Text Effects:** Toggles for customizable text shadows and text strokes.
- **Canvas Presets:** Quick output sizing options (1:1, 4:5, 9:16, 16:9, etc.) and support for custom output resolutions.
- **Local Storage State:** Your ongoing work is seamlessly persisted in your browser's local storage.
- **Exporting:** High-quality PNG and JPG client-side exporting at precise chosen resolutions.
- **History System:** Undo & Redo via UI or keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS V4
- **State/Hooks:** Custom React Hooks
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Type or paste your Sinhala text into the left sidebar.
2. Customize the appearance using the Typography, Colors, Background, and Effects sections.
3. Select an Aspect Ratio or enter custom dimensions.
4. Download the resulting image using the "Export PNG" or "JPG" buttons.
