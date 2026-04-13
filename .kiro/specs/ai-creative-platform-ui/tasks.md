# Implementation Plan: AI Creative Platform UI

## Overview

Implement a dark-themed AI creative platform homepage using Next.js App Router (JavaScript), MUI v5+ (`sx`/`styled`), and Lucide React icons. The build follows a component-by-component approach: foundation first (theme + layout), then static components, then interactive components, then data wiring, finishing with tests.

## Tasks

- [x] 1. Install test dependencies and configure Jest
  - Install `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `fast-check` as dev dependencies
  - Create `jest.config.js` using `next/jest` transformer with `testEnvironment: 'jsdom'`
  - Create `jest.setup.js` importing `@testing-library/jest-dom`
  - Add `"test": "jest --passWithNoTests"` script to `package.json`
  - _Requirements: testing infrastructure for all subsequent test sub-tasks_

- [x] 2. Create MUI ThemeRegistry and update root layout
  - [x] 2.1 Implement `src/app/components/ThemeRegistry.js`
    - `'use client'` directive
    - Create Emotion cache with `@emotion/cache` and `createCache`
    - Use `useServerInsertedHTML` from `next/navigation` to flush styles for SSR
    - Wrap children with `ThemeProvider` (dark theme: `palette.mode: 'dark'`, `primary.main: '#c084fc'`, `background.default: '#0f0f0f'`, `background.paper: '#1a1a1a'`) and `CssBaseline`
    - Use `@mui/material-nextjs` `AppRouterCacheProvider` per the MUI Next.js App Router guide
    - _Requirements: 1.1 (dark theme foundation)_
  - [x] 2.2 Update `src/app/layout.js`
    - Import and wrap `{children}` with `ThemeRegistry`
    - Set `<html>` and `<body>` to remove default margin/padding via `CssBaseline`
    - Keep existing Geist font variables
    - _Requirements: 1.1_

- [x] 3. Create static data files
  - [x] 3.1 Create `src/app/data/navItems.js`
    - Export a `NAV_ITEMS` array with objects `{ id, label, icon, isNew, href }`
    - Include items: Home, Image Generation, Video, Blueprints (isNew: true), Flow State, Upscaler, Canvas, Draw, plus bottom items (Settings, User)
    - Import Lucide React icons for each item
    - _Requirements: 1.2, 1.3_
  - [x] 3.2 Create `src/app/data/toolTabs.js`
    - Export a `TOOL_TABS` array with objects `{ id, label, isNew }`
    - Include: Image, Video, Blueprints (isNew: true), Flow State, Upscaler, Canvas, Draw
    - _Requirements: 3.1, 3.2_
  - [x] 3.3 Create `src/app/data/blueprints.js`
    - Export a `BLUEPRINTS` array with objects `{ id, title, imageUrl, isNew }`
    - Include at least 6 sample blueprint cards with placeholder image paths
    - _Requirements: 4.1, 4.2_

- [x] 4. Implement Sidebar component
  - [x] 4.1 Create `src/app/components/Sidebar.js` (Server Component)
    - Fixed-position MUI `Box` or `Drawer` variant, dark background (`background.paper`)
    - Logo area at top using MUI `Box` + `Typography`
    - Scrollable nav list: map over `NAV_ITEMS`, render icon + label + optional NEW `Chip` per item
    - Upgrade `Button` at bottom
    - User avatar (`Avatar`) at bottom
    - All styling via MUI `sx` prop — no inline styles, no Tailwind
    - Guard missing icon with conditional render (label still shows)
    - _Requirements: 1.2, 1.3, 1.4, 1.5_
  - [x] 4.2 Write unit tests for Sidebar
    - Test that all nav item labels from `NAV_ITEMS` are rendered
    - Test that the Blueprints item renders a NEW chip
    - Test that the Upgrade button is present
    - _Requirements: 1.2, 1.3, 1.4_
  - [ ] 4.3 Write property test for Sidebar nav items (Property 1)
    - **Property 1: Sidebar nav items always have icon and label**
    - Generate arbitrary arrays of nav item objects with random labels and stub icon components
    - Render `Sidebar` with generated data and assert every label appears in the output
    - **Validates: Requirements 1.2**

- [x] 5. Implement HeroSection component
  - [x] 5.1 Create `src/app/components/HeroSection.js` (Server Component)
    - Full-width MUI `Box` with `backgroundImage` in `sx` (cinematic dark gradient or placeholder)
    - `Typography` variant `h1` rendering "YOURS TO CREATE" with large, bold, letter-spaced styling
    - Subtitle text below headline
    - All styling via `sx`
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ] 5.2 Write unit tests for HeroSection
    - Test that "YOURS TO CREATE" heading is rendered
    - Test that a subtitle element is present
    - _Requirements: 2.1, 2.2_

- [x] 6. Implement PromptBar component
  - [x] 6.1 Create `src/app/components/PromptBar.js` (Client Component)
    - `'use client'` directive
    - Controlled MUI `TextField` with `value` / `onChange` state
    - MUI `Button` labeled "Generate" — disabled when `value.trim() === ''`
    - Accepts optional `onGenerate` prop called with current prompt value on button click
    - All styling via `sx`
    - _Requirements: 2.4, 2.5, 2.6_
  - [ ] 6.2 Write unit tests for PromptBar
    - Test that the text field and Generate button are present
    - Test that Generate button is disabled when input is empty
    - Test that Generate button is enabled after typing
    - _Requirements: 2.4, 2.5, 2.6_

- [x] 7. Implement ToolTabs component
  - [x] 7.1 Create `src/app/components/ToolTabs.js` (Client Component)
    - `'use client'` directive
    - MUI `Tabs` + `Tab` components, `useState` for `activeTab`
    - Map over `TOOL_TABS`; render each as a `Tab` with optional NEW `Chip` badge
    - Styled with `sx` to match dark theme (purple active indicator)
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 7.2 Write unit tests for ToolTabs
    - Test that all tab labels are rendered
    - Test that the Blueprints tab renders a NEW chip
    - _Requirements: 3.1, 3.2_
  - [ ] 7.3 Write property test for ToolTabs tab selection (Property 2)
    - **Property 2: Tab selection is exclusive**
    - Generate arbitrary lists of tabs (min 2) and a random index to click
    - Render `ToolTabs`, simulate click on the chosen tab, assert only that tab has `aria-selected="true"`
    - **Validates: Requirements 3.3**

- [x] 8. Implement BlueprintCard and FeaturedBlueprints components
  - [x] 8.1 Create `src/app/components/BlueprintCard.js` (Server Component)
    - MUI `Card` with `CardMedia` (image) and `CardContent` (title `Typography`)
    - Optional NEW `Chip` overlay when `isNew` is true
    - Fallback background color in `sx` when `imageUrl` is missing
    - Props: `{ title, imageUrl, isNew }`
    - _Requirements: 4.2, 4.3_
  - [ ] 8.2 Write property test for BlueprintCard (Property 3)
    - **Property 3: Blueprint cards render required fields**
    - Generate arbitrary `{ title, imageUrl, isNew }` objects
    - Render `BlueprintCard` and assert title text is present; assert NEW chip presence matches `isNew`
    - **Validates: Requirements 4.2**
  - [x] 8.3 Create `src/app/components/FeaturedBlueprints.js` (Server Component)
    - Section heading "Featured Blueprints" (`Typography`) + "View More" `Link`
    - Horizontally scrollable MUI `Box` (`overflowX: 'auto'`, `display: 'flex'`, `gap`) containing `BlueprintCard` instances mapped from `BLUEPRINTS`
    - All styling via `sx`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ] 8.4 Write unit tests for FeaturedBlueprints
    - Test that "Featured Blueprints" heading is rendered
    - Test that "View More" link is present
    - Test that all blueprint card titles from `BLUEPRINTS` are rendered
    - _Requirements: 4.1, 4.3, 4.4_

- [x] 9. Checkpoint — wire everything into page layout
  - [x] 9.1 Update `src/app/page.js`
    - Import and compose `Sidebar`, `HeroSection`, `PromptBar`, `ToolTabs`, `FeaturedBlueprints`
    - Outer MUI `Box` with `display: 'flex'` for sidebar + main content layout
    - Main content area stacks `HeroSection`, `PromptBar`, `ToolTabs`, `FeaturedBlueprints` vertically
    - All layout via `sx`
    - _Requirements: 1.1, 2.1, 3.1, 4.1_
  - [x] 9.2 Update `src/app/globals.css`
    - Remove default Next.js boilerplate styles; keep only minimal resets (`*, *::before, *::after { box-sizing: border-box; }` and `body { margin: 0; }`)
    - _Requirements: 1.1_
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Final checkpoint — run full test suite
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` with a minimum of 100 iterations each
- All styling must use MUI `sx` prop or `styled` — no inline styles, no Tailwind, no CSS modules for component styles
- Server Components cannot use hooks; only `PromptBar` and `ToolTabs` are Client Components
- The `ThemeRegistry` uses `@mui/material-nextjs` `AppRouterCacheProvider` for correct Emotion SSR in Next.js App Router
