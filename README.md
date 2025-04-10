# qj_frontend

A Vue.js-based frontend application for the Quantify Jiu-Jitsu platform, providing users with an interactive interface to engage with the platform's features.

## Features

- **Vue.js Framework**: Utilizes Vue 3 for building a reactive and modular user interface.
- **Tailwind CSS**: Incorporates Tailwind CSS for utility-first styling.
- **Responsive Design**: Ensures compatibility across various devices and screen sizes.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or higher is recommended).
- **npm**: Node Package Manager, typically bundled with Node.js.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kuanting-wu/qj_frontend.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd qj_frontend
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

## Development

To start the development server with hot-reloading:

```bash
npm run serve
```

The application will be accessible at `http://localhost:8080` by default.

## Build

To compile and minify the application for production:

```bash
npm run build
```

The compiled files will be located in the `dist` directory.

## Project Structure

```
qj_frontend/
├── .github/workflows/    # GitHub Actions workflows
├── .vscode/              # VS Code settings
├── public/               # Static assets
├── src/
│   ├── assets/           # Image and other asset files
│   ├── components/       # Vue components
│   ├── views/            # Page views
│   ├── App.vue           # Root Vue component
│   └── main.js           # Entry point of the application
├── .gitignore            # Git ignore file
├── babel.config.js       # Babel configuration
├── package.json          # Project metadata and dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── vue.config.js         # Vue CLI configuration
```