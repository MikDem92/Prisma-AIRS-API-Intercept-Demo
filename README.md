# Prisma AIRS (API Intercept) - Demo
[![Node.js CI](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo/actions/workflows/ci.yml)
[![CodeQL Advanced](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo/actions/workflows/codeql.yml/badge.svg)](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo/actions/workflows/codeql.yml)

This project demonstrates a fully functional, browser-based chat interface backed by a Node.js/Express server. It is structured to facilitate the integration of a Large Language Model (LLM) for response generation and Palo Alto Networks Prisma AIRS - API Intercept for security scanning.

## Prerequisites

You must have the following installed on your system:

* **Node.js** (LTS version 18.x or higher recommended)
* **npm** (Node Package Manager - comes with Node.js)

---

## Local Setup and Installation

Follow these steps to get the demo running on your machine.

### 1. Clone the Repository

If you haven't already, clone the repository and navigate into the project directory.

```bash
git clone https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo.git
cd Prisma-AIRS-API-Intercept-Demo
```

### 2. Install Dependencies

Install all necessary Node.js packages (`express`, `openai`, `uuid`, etc.):

```bash
npm install
```

### 3. Configure Your Environment

Since the `src/constants.js` file is ignored by Git (it contains sensitive keys), you must create it manually. This file will hold all endpoints and API keys required for both the generic LLM and the Prisma AIRS client.

Create a new file at **`src/constants.js`** and add the following content. Populate the string values (`""`) with your actual configuration details.

```javascript
export const AI_CHAT_ENDPOINT = "";
export const AI_CHAT_MODEL = "";
export const AI_CHAT_KEY = "";

export const PRISMA_AIRS_ENDPOINT = "";
export const PRISMA_AIRS_SECURITY_KEY = "";
export const PRISMA_AIRS_PROFILE_ID = "";
```

**Important**: Keep your API keys secure and never commit them to version control.

### 4. Run the Application

Start the Node.js/Express application using the defined `start` script:

```bash
npm start
```

The server will start on the default port (typically `http://localhost:3000`). Open your web browser and navigate to this URL to access the chat interface.

### 5. Stop the Server

Stop the Node.js/Express application by pressing `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) in the terminal.

---

## Development

### Running Tests

The project includes a comprehensive test suite using Jest with ES modules support:

```bash
npm test
```

The tests cover:
- PrismaAirs client functionality
- API payload structure validation
- Error handling scenarios
- Mock integrations

### Project Structure

```
├── src/
│   ├── ai.js                 # AI/LLM integration logic
│   ├── constants.js          # Configuration (create manually)
│   ├── prismaAirs.js         # Prisma AIRS client implementation
│   └── prismaAirs.test.js    # Test suite
├── index.html                # Frontend chat interface
├── index.js                  # Express server entry point
├── package.json              # Dependencies and scripts
├── jest.config.js            # Jest configuration for ES modules
└── .gitignore               # Git ignore rules
```

### Key Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Testing**: Jest with ES modules support
- **Security**: Prisma AIRS API Intercept
- **AI Integration**: OpenAI API (or compatible endpoints)

---

## CI/CD Pipeline

This repository includes GitHub Actions workflows for:

- **Continuous Integration**: Automated testing on push/PR
- **Code Security**: CodeQL analysis for vulnerability detection
- **Cross-platform Testing**: Linux, Windows, and macOS environments

The tests run automatically when you push changes or create pull requests.

---

## Troubleshooting

### Common Issues

**Jest ES Modules Error**: If you encounter `jest is not defined` errors, ensure you're using Node.js 18+ and the Jest configuration supports ES modules.

**Missing Constants File**: Create `src/constants.js` with your API keys as described in step 3.

**Port Already in Use**: If port 3000 is busy, modify the port in `index.js` or kill the process using that port.

**Dependencies Issues**: Delete `node_modules` and run `npm install` again:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- Check the [Issues](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo/issues) section
- Review the test files for usage examples
- Ensure all environment variables are properly configured
