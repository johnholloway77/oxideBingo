# Oxide Bingo

## Purpose

Oxide Bingo is a simple little web app for generating and displaying randomized bingo cards for players who listen to the *Oxide and Friends* podcast from Oxide Computer Company.

This is a silly little thing, not to be taken seriously. It is not made by, supported, nor endorsed by Oxide Computer Company. It in no way speaks for Oxide Computer Company.

Game can be played at [https://oxide.bingo](https://oxide.bingo).

---

## Development & AI Usage

**Original Development**: This project was initially created by John Holloway (human developer) as a fun side project for the Oxide and Friends podcast community.

**AI-Assisted Improvements**: Claude (Anthropic's AI assistant) was used to assist with:
- Performance optimizations (font subsetting, event delegation, canvas-based animations)
- Code review and refactoring suggestions
- Accessibility improvements (ARIA attributes, keyboard navigation)
- Modern CSS patterns (custom properties, animations)
- Build configuration (Vite optimization)
- Documentation and best practices

The core application logic, design decisions, and implementation were human-driven, with AI serving as a productivity tool for code improvements and expediency.

---

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - For performant confetti animations
- **CSS3** - Modern styling with custom properties and animations
- **LocalStorage** - Client-side game state persistence

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/oxideBingo.git
cd oxideBingo

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with hot reload
npm run dev

# Server will start at http://localhost:3000
```

The dev server includes:
- Hot Module Replacement (HMR) - changes appear instantly
- TypeScript compilation on the fly
- Source maps for debugging

### Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in the /dist directory
```

Production build includes:
- Minified JavaScript with Terser
- Code splitting for optimal loading
- Removed console.logs
- Optimized CSS

### Preview Production Build

```bash
# Preview the production build locally
npm run preview

# Server will start at http://localhost:4173
```

---

## Project Structure

```
oxideBingo/
├── public/               # Static assets
│   ├── style.css        # Main stylesheet
│   ├── tiles.json       # Bingo phrases
│   ├── *.webp          # Images
│   └── *.woff2         # Optimized fonts
├── resources/           # TypeScript modules
│   ├── gamelogic.ts    # Game state and bingo detection
│   └── ui.ts           # UI interactions and animations
├── index.html          # Main HTML file
├── index.ts            # Application entry point
├── vite.config.ts      # Build configuration
└── tsconfig.json       # TypeScript configuration
```

---

## Features

### Game Mechanics
- **5×5 Bingo Grid** with center free space
- **Randomized tiles** from a pool of podcast-related phrases
- **Multiple bingo detection** - rows, columns, and diagonals
- **State persistence** - saves game for 3 hours in localStorage
- **Confetti celebration** on bingo wins

### User Experience
- **Keyboard accessible** - navigate with arrow keys, toggle with Space/Enter
- **Screen reader support** - full ARIA attributes
- **Toast notifications** - clear feedback for actions
- **Card export** - download as JPEG or copy to clipboard
- **Responsive design** - works on mobile and desktop
- **Reduced motion support** - respects user preferences

### Performance
- **Optimized fonts** - 99.6% size reduction (2.2MB → 8.3KB)
- **Inlined SVG** - eliminates extra HTTP request
- **Event delegation** - efficient event handling
- **Canvas animations** - GPU-accelerated confetti
- **Code splitting** - lazy-loads image export library
- **Debounced saves** - prevents localStorage blocking

---

## Customization

### Adding/Modifying Bingo Tiles

Edit `public/tiles.json` to change the bingo phrases:

```json
[
  "DTrace mentioned",
  "Bryan stutters in excitement",
  "Adam makes fun of Bryan",
  "80s TV show reference"
]
```

### Styling

All styles are in `public/style.css` using CSS custom properties:

```css
:root {
  --accent-primary: #48d597;  /* Change theme color */
  --bg-primary: #242930;      /* Background color */
}
```

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

Requires support for:
- ES2020 JavaScript
- CSS Custom Properties
- CSS Grid
- Canvas API

---

## License

This project is open source and available for personal use. Not affiliated with Oxide Computer Company.

---

## Acknowledgments

- Oxide Computer Company for the awesome podcast
- The Oxide and Friends community
- Claude AI for development assistance
- Vite team for the excellent build tool

---

## Disclaimer

**OxideBingo** is a fan-made project and is not made by, supported, or endorsed by Oxide Computer Company. This project does not reflect the views of the company. All trademarks belong to their respective owners.
