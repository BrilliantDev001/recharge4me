# Frontend — Screen-by-Screen Build

React + Vite + JavaScript + vanilla CSS. No CSS frameworks, no component libraries.

## Folder Structure

```
src/
├── assets/
│   ├── images/          # exported design images, illustrations
│   └── icons/            # SVG icons
├── components/
│   ├── common/            # shared, reusable pieces (Button, Input, Modal, Dropdown...)
│   └── layout/            # Header, Footer, Sidebar, PageWrapper...
├── pages/
│   └── PageName/
│       ├── PageName.jsx
│       └── PageName.css   # co-located, scoped styles per page
├── styles/
│   ├── variables.css      # design tokens (colors, type, spacing) — single source of truth
│   ├── reset.css          # cross-browser baseline reset
│   └── global.css         # base element styles built from tokens
├── data/                  # mock data constants simulating backend responses
├── hooks/                 # custom hooks (useModal, usePagination, useForm...)
├── context/                # React context providers for cross-cutting state
├── utils/                  # pure helper functions (formatters, validators...)
├── routes/                 # route config if it grows beyond App.jsx
├── App.jsx
└── main.jsx
```

## Conventions

- **Co-located styles**: every component/page gets its own `.css` file next to it, importing tokens from `styles/variables.css`. No giant shared stylesheet.
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for CSS class names.
- **Design tokens only**: no hardcoded hex/px values in component CSS — always reference `var(--...)` from `variables.css`.
- **Accessibility baseline**: all interactive elements get hover, active, disabled, and `:focus-visible` states by default.
- **Mock data**: lives in `src/data/`, shaped like the real future API response.

## Workflow

Screens are built one at a time from uploaded mockups (Desktop + Mobile). Each screen becomes its own folder under `pages/`, with any newly-needed reusable pieces extracted into `components/common/` or `components/layout/`.

## Getting Started

```bash
npm install
npm run dev
```
