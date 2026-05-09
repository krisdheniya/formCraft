# Dynamic Nested Form Builder

A robust, feature-rich dynamic nested form builder application built with React. This application allows users to create complex hierarchical forms with nested questions, conditional logic, various input types, and drag-and-drop reordering capabilities.

## Live Demo
> **[Link to Live Deployment]** *https://form-maker-ashen.vercel.app/*

---

## Features

- **Dynamic Question Management**: Add, duplicate, edit, and delete questions effortlessly.
- **Infinite Nesting (Sub-questions)**: Create deep hierarchies of sub-questions with automatic, hierarchical numbering (e.g., Q1, Q1.1, Q1.1.1).
- **Multiple Question Types**: Supports various input forms including:
  - Short Answer
  - Email (with auto-validation)
  - Phone (with auto-validation)
  - Multiple Choice
  - Checkboxes
  - Dropdown
- **Conditional Logic Engine**: Attach dependency rules to sub-questions so they only appear if a parent question matches specific criteria (e.g., "Show if Q1 is 'Option 1'").
- **Drag & Drop Reordering**: Easily reorganize root questions and sub-questions using a fluid drag-and-drop interface.
- **Auto-Save & Local Storage**: Automatically saves the form state to the browser's local storage to prevent data loss.
- **Builder & Preview Modes**: Seamlessly toggle between building the form structure and previewing the final end-user experience.
- **Inline Editing & Collapsible Nodes**: Edit question properties inline and collapse complex branches for better visibility while building.
- **Form Metadata**: Manage overarching form details like title and description.
- **Validation Engine**: Pre-built validators for strict email and phone number formatting.

---

## Tech Stack

- **React (`react`, `react-dom`)**: Core UI library used to build the interactive interface.
- **Vite (`vite`, `@vitejs/plugin-react`)**: Ultra-fast frontend build tool and development server.
- **dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)**: Powerful, accessible drag-and-drop toolkit used for reordering questions.
- **Lucide React (`lucide-react`)**: Modern, crisp SVG icon library.
- **NanoID (`nanoid`)**: Lightweight generator for secure, unique identifiers for form fields.
- **Docker / Nginx**: Multi-stage containerization for optimized production deployments.

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd task_intern2
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).

---

## Docker Deployment

This project includes a multi-stage Dockerfile that builds the React application and serves it via an Nginx web server.

### Build the Image
```bash
docker build -t form-maker .
```

### Run the Container
```bash
docker run -p 3000:80 form-maker
```
*The app will be accessible at `http://localhost:3000`.*

### About the Dockerfile
The `Dockerfile` uses a **multi-stage build** approach:
1. **Stage 1 (Builder)**: Uses `node:18-alpine` to install NPM dependencies and build the optimized static bundle (`npm run build`).
2. **Stage 2 (Server)**: Uses a lightweight `nginx:alpine` image. It copies the built assets from Stage 1 into Nginx's public directory and uses a custom `nginx.conf` to serve the application and handle client-side routing.

---

## Project Structure

```text
src/
├── components/          # Reusable UI React components
│   ├── ConditionalLogic/# Components managing dependency rules and badges
│   ├── FormBuilder/     # Main layout, canvas, and header for the builder mode
│   ├── Preview/         # Read-only components for the Form Preview mode
│   ├── Question/        # Core question node, actions, and structure wrappers
│   ├── QuestionTypes/   # Specific input editors (Email, Phone, Dropdown, etc.)
│   └── shared/          # Generic reusable components (Toast, EmptyState, etc.)
├── engine/              # Core business logic separated from UI
│   ├── dependencyEngine.js # Evaluates rules to determine if a question should render
│   ├── numberingEngine.js  # Calculates hierarchical "Q1.2.1" numbering dynamically
│   └── validationEngine.js # Checks inputs against formatting constraints
├── hooks/               # Custom React hooks
│   ├── useAutoSave.js   # Syncs global form state to localStorage
│   ├── useFormBuilder.js# Context consumption and generic builder helpers
│   └── ...              # Other modularized logic hooks
├── store/               # State Management (Context + useReducer)
│   ├── formReducer.js   # Pure reducer handling all complex state mutations safely
│   ├── actions.js       # Constants for form actions
│   ├── initialState.js  # Default shape of the form data
│   └── selectors.js     # Helper functions to extract specific state slices
└── utils/               # Pure utility functions
    ├── treeUtils.js     # Helpers for graph traversal, cycle-prevention, and flat-tree logic
    ├── idGenerator.js   # Wrapper around nanoid
    ├── localStorageUtils.js # Abstractions for safe browser storage interactions
    └── constants.js     # Global constant definitions
```

---

## How It Works

- **State Management (Flat-Tree Architecture)**: Instead of deeply nested objects which are hard to mutate and traverse, questions are stored in a flat dictionary map (`questions: { [id]: Question }`). Hierarchy is maintained via a `rootQuestionIds` array and individual `childIds` references on each question node. This ensures lightning-fast updates and makes cyclical dependency prevention much simpler.
- **Auto-Numbering**: `numberingEngine.js` generates labels on the fly during rendering. It traverses the form's flat state starting from `rootQuestionIds`, passing index paths down to children to construct labels like `1.2.1`.
- **Conditional Logic**: Sub-questions can have a `dependencyRule` defined. The `dependencyEngine.js` evaluates these rules against the current state of parent answers to determine if the dependent question should be rendered in the DOM.
- **Drag and Drop (`dnd-kit`)**: Sorting relies on rearranging the `rootQuestionIds` or a parent's `childIds` array. `@dnd-kit` handles the visual aspect, while the `formReducer` safely executes the array reordering logic under the hood.
- **Local Storage Persistence**: The `useAutoSave` custom hook listens for changes to the form state. On every change, it triggers a debounced save to the browser's `localStorage`. When the app loads, `localStorageUtils.js` hydrates the initial state, allowing the user to seamlessly resume their work.
