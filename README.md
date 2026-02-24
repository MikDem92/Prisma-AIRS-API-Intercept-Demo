# Prisma AIRS API Intercept Demo

This project demonstrates a fully functional, browser-based chat interface backed by a Node.js/Express server. It is structured to facilitate the integration of a Large Language Model (LLM) for response generation and Palo Alto Networks Prisma AIRS - API Intercept for security scanning.

## Prerequisites

You must have the following installed on your system:

**PRISMA AIRS:**
Make sure you have Prisma AIRS - API Intercept deployed. Refer to the following documentation for more:
https://docs.paloaltonetworks.com/ai-runtime-security/activation-and-onboarding/ai-runtime-security-api-intercept-overview

**RUNTIME ENVIRONMENT:**
The demo application is built with Node.js, so you require:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager)

**AI MODELS:**
The demo uses AI models hosted via the Azure AI Foundry. Make sure you have a project with an inference model of your choice (e.g. gpt-4o-mini) deployed.

**DATABASE:**
Also make sure you have a **CosmosDB** instance for storing the conversation context (regular NoSQL option). There should be one database with two containers:

- One container for storing the chat prompts and responses (should have **chatId** spedified as the partition key).
- Another one for storing internal user data with arbitrary content (arbitrary partition key).

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

Since the `src/settings.js` file is ignored by Git (it contains sensitive keys), you must create it manually. This file will hold all endpoints and API keys required for the generic LLM, your CosmosDB instance and the Prisma AIRS client.

Create a new file at **`src/settings.js`** and add the following content. Populate the string values (`""`) with your actual configuration details.

```javascript
export const AI_CHAT_ENDPOINT = "";
export const AI_CHAT_MODEL = "";
export const AI_CHAT_KEY = "";

export const PRISMA_AIRS_ENDPOINT = "";
export const PRISMA_AIRS_SECURITY_KEY = "";

export const COSMOSDB_ENDPOINT = "";
export const COSMOSDB_KEY = "";
export const COSMOSDB_DATABASE = "";
export const COSMOSDB_CONTAINER_CHATS = "";
export const COSMOSDB_CONTAINER_DATA = "":
```

In `src/ai.js` specify the Security Profile ID of the rule set you want to test:

```javascript
const PRISMA_AIRS_PROFILE_ID = "";
```

### 4. Run the Server

Start the Node.js/Express application using the defined `start` script:

```bash
npm start
```

### 5. Stop the Server

Stop the Node.js/Express application by pressing Ctrl+C on Windows or control+C on Mac.
