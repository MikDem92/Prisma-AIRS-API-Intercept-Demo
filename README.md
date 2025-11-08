# Prisma AIRS API Intercept Demo

This project demonstrates a fully functional, browser-based chat interface backed by a Node.js/Express server. It is structured to facilitate the integration of a Large Language Model (LLM) for response generation and Palo Alto Networks Prisma AIRS - API Intercept for security scanning.

## Prerequisites

You must have the following installed on your system:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager)

---

## Local Setup and Installation

Follow these steps to get the demo running on your machine.

### 1. Clone the Repository

If you haven't already, clone the repository and navigate into the project directory.

```bash
git clone [https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo.git](https://github.com/MikDem92/Prisma-AIRS-API-Intercept-Demo.git)
cd Prisma-AIRS-API-Intercept-Demo
```

### 2. Install Dependencies

Install all necessary Node.js packages (`express`, `uuid`, etc.):

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

### 4. Run the Server

Start the Node.js/Express application using the defined `start` script:

```bash
npm start
```

### 5. Stop the Server

Stop the Node.js/Express application by pressing Ctrl+C on Windows or control+C on Mac.
