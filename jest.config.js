/**
 * Jest configuration for an ES Module (type: 'module') Node.js project.
 * The transformIgnorePatterns setting is CRITICAL to resolve the 
 * "ReferenceError: require is not defined" error when importing 
 * CommonJS libraries (like 'uuid') in an ESM test environment.
 */
export default {
    // Collect coverage from your source files
    collectCoverageFrom: [
        "PrismaAirs.js"
    ],
    // Force Jest to transform modules in node_modules that are CJS, 
    // especially 'uuid', to make them compatible with ESM.
    transformIgnorePatterns: [
        "/node_modules/(?!uuid)/"
    ],
    // The test environment for Node.js projects
    testEnvironment: 'node',
};