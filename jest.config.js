/**
 * Jest configuration for an ES Module (type: 'module') Node.js project.
 * The transformIgnorePatterns setting is CRITICAL to resolve the 
 * "ReferenceError: require is not defined" error when importing 
 * CommonJS libraries (like 'uuid') in an ESM test environment.
 */
export default {
    rootDir: '.', 
    
    // Explicitly define the source directory for module resolution.
    moduleDirectories: ['node_modules', 'src'], 

    // Corrected to lowercase 'p' to match the file system: prismaAirs.js
    collectCoverageFrom: [
        "src/prismaAirs.js" 
    ],
    // Force Jest to transform modules in node_modules that are CJS, 
    // especially 'uuid', to make them compatible with ESM.
    transformIgnorePatterns: [
        "/node_modules/(?!uuid)/"
    ],
    testEnvironment: 'node',
};