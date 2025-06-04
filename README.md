# FMportal

FMportal is a React application bootstrapped with Vite. It provides an integrated, user-friendly platform that streamlines maintenance tasks, asset management, and auditing processes.

## Table of Contents

-   [Getting Started](#getting-started)
-   [Folder Structure](#folder-structure)
-   [Scripts](#scripts)
-   [Configuration](#configuration)
-   [Contributing](#contributing)

## Getting Started

### Prerequisites

-   Node.js _(v18 or higher recommended)_
-   npm _(v7 or higher) or Yarn (v1.22 or higher)_

### Installation

1. Clone the repository:\
   `git clone git@bitbucket.org:toolboxgroup/fm-portal-react.git`
2. Navigate to the project directory:\
   `cd fm-portal-react`
3. Install dependencies:\
   `npm install`
4. Set up environment variables by creating a .env file in the root directory. You can use .env.example as a template:\
   `cp .env.example .env`
5. Start the development server:\
   `npm run dev`\
   The application should now be running on http://localhost:5173.

## Folder Structure

```
├── src/
│   ├── app/                 # Contains the core application setup files, such as:
│   |   ├── routes/          # The application routes
│   |   ├── App.tsx          # Main application component.
│   |   ├── main.tsx         # Application entry point, rendering the root React component.
│   |   ├── Provider.tsx     # Wraps providers for context, state management, and other global configurations.
│   |   ├── Router.tsx       # Sets up the app's routing configuration.
│   ├── assets/              # Static assets (e.g., images, fonts)
│   ├── columnDefinitions/   # Houses MUI DataGrid column definitions for reuse across the app.
│   ├── components/          # Reusable UI components (e.g., buttons, input fields)
│   ├── constants/           # Contains application-wide constants, static values, and configuration settings
│   ├── features/            # Feature-based modules (e.g., Dashboard, User management)
│   |   ├── components/      # Contains reusable components specific to this feature
│   |   ├── hooks/           # Any custom hooks that are unique to this feature
│   |   ├── services/        # API calls and data-fetching logic scoped to the feature
│   |   ├── store/           # State management logic specific to the feature
│   |   ├── types/           # Type definitions for this feature
│   |   ├── index.ts         # Entry point that re-exports feature modules, making them easily accessible
│   ├── hooks/               # Custom React hooks
│   ├── lang/                # Contains translation files for internationalization
│   ├── lib/                 # Libraries, including third-party configs (e.g., MUI setup)
│   ├── mocks/               # MSW config & handlers
│   ├── services/            # API calls and data-fetching logic
│   ├── store/               # Global state management (e.g. Zustand)
│   ├── test/                # Unit tests
│   ├── theme/               # Theme configuration
│   ├── types/               # Typescript interfaces
│   └── utils/               # Utility functions and helpers (e.g., formatting)
├── public/                  # Public assets (e.g., index.html)
├── .env.example             # Example environment variables file
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
├── netlify.toml             # Netlify deployment configuration
├── README.md                # This file
└── package.json             # Project dependencies and scripts
```

### Key Folders

-   `src/components/`\
    Contains shared, reusable UI components, such as buttons or modal dialogs, which can be used across multiple features.

-   `src/features/`\
    Each feature or module of the app is contained here, with its own components, hooks, and logic. Examples could include Dashboard, UserManagement, etc.

-   `src/hooks/`\
    Custom React hooks that encapsulate reusable logic, such as API requests or state management across components.

-   `src/lib/`\
    Configuration for third-party libraries and custom modules, such as MUI theme configurations or localization setup.

-   `src/App/Router` & `src/App/routes/`\
    Handles the routing setup using react-router-dom. Each route can point to a specific feature or component.

-   `src/services/`\
    API-related logic, often abstracted into functions that call backend services, fetch data, and handle responses.

-   `src/store/`\
    State management files, like Redux slices or context providers, for maintaining global application state.

-   `src/utils/`\
    General utility functions and helpers, such as data formatters, validators, and date handlers.\
    It also includes specialized API-related utilities, with `src/utils/api/` for API logic.

## Scripts

The following scripts are available in package.json:

-   **dev**:\
    Starts the development server on localhost:5173.\
    `npm run dev`
-   **build**:\
    Compiles the app for production to the dist folder.\
    `npm run build`
-   **preview**:\
    Serves the production build locally.\
    `npm run preview`
-   **lint**:\
    Lints the code using ESLint.\
    `npm run lint`
-   **format**:\
    Formats the code using Prettier.\
    `npm run format`

## Configuration

Configuration settings for the app (e.g., API base URL, environment variables) are managed in the .env file. This file is not committed to source control for security reasons, so you'll need to create one by copying .env.example.

## CI/CD

We use Netlify for continuous deployment and previewing pull requests. Every time a new branch is pushed or a pull request is created, Netlify automatically deploys a preview of the application, allowing you to view changes in a live environment before merging.

-   **Deploy Previews**:\
    Each pull request will trigger a deploy preview on Netlify, which can be accessed via the URL provided in the pull request comment.
-   **Production Deployment**:\
    Once a pull request is merged into the main branch, the changes will be automatically deployed to production on Netlify.

This setup allows for easy testing and validation of new features or bug fixes, providing a smooth workflow from development to production.

## API (JSON Spec)

Our application communicates with the backend using the [JSON specification](https://jsonapi.org/). This standard helps ensure consistency across API endpoints and simplifies tasks like pagination, filtering, and handling relationships.

Key aspects include:

-   **Resource Naming**:\
    All endpoints are structured using resource names in plural form (e.g., /users, /posts).
-   **Filtering**:\
    Filters can be applied by appending query parameters like ?filter[name]=John.
-   **Pagination**:\
    Endpoints that return large datasets support pagination with page[number] and page[size] parameters.
-   **Relationships**:\
    Relationships between resources are handled using related resource links (e.g., /users/1/relationships/posts).

This structure allows for efficient and predictable communication between the frontend and backend.

By including this, you'll ensure developers understand the expectations for interacting with the API and how they can utilize these conventions when making requests.

## Mock Service Worker (MSW)

**MSW** is a tool used to mock API requests in the browser. It intercepts outgoing network requests and provides mocked responses, allowing you to work with simulated data during development or testing. This can be useful for front-end development when the backend is not yet available or to isolate certain behaviors.

1. **Starting the MSW Service**\
   The MSW service is automatically started when the app is run in the development environment. This is configured in the src/mocks folder.

2. **Creating Mock Handlers**\
   MSW uses handlers to intercept specific network requests. The handlers are defined in src/mocks/handlers.ts. These handlers map the URL paths and request methods to their corresponding mock responses.

Example of a handler for a GET request:

```
import {http, delay, HttpResponse} from "msw";
import { CONTRACTOR_DATABASE } from "../constants/api";

import contractorDatabase from "./responses/contractorDatabase";

import {
    API_BASE_URL,
    API_VERSION,
} from "../constants/api";

const handlers = [
    http.get(`${API_BASE_URL}/${API_VERSION}/${CONTRACTOR_DATABASE}*`, () => {
        return HttpResponse.json(contractorDatabase, { status: 200 });
    }),
];

export { handlers };
```

## Contributing

1. Clone the repository and create a new branch:\
   `git checkout -b feature/your-feature-name`
2. Make your changes and test thoroughly.
    - there can't be any TS validation errors
3. Commit your changes with a clear commit message:\
   `git commit -m "Add a brief description of your changes"`
    - there are pre-commit TS validation checks, if validation fails the commit will be cancelled
        - in case of an EMERGENCY (only) there is an option to skip TS validation by adding `SKIP_TS_CHECK=1 ` before git command:
        `SKIP_TS_CHECK=1 git commit -m "Add a brief description of your changes"`
4. Push your branch to the repository:\
   `git push origin feature/your-feature-name`
5. Open a pull request to the main branch.

Please make sure not to commit directly to the main branch and keep your branch up-to-date with the latest changes in main.

Thank you for reading.
