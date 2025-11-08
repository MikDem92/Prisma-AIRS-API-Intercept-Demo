/** @type {import('jest').Config} */
const config = {
    // Use the 'js' extension for module resolution
    moduleFileExtensions: ['js'],
    // Look for test files ending in .test.js
    testMatch: ['**/src/**/*.test.js'],
    // Set test environment to node
    testEnvironment: 'node',
    
    // CRITICAL FIX: Explicitly tell Jest to treat .js files as ESM.
    // This resolves the "require is not defined" error when running in a Node ESM project.
    extensionsToTreatAsEsm: ['.js'],
  };
  
  export default config;