/** @type {import('jest').Config} */
const config = {
    // Use the 'js' extension for module resolution
    moduleFileExtensions: ['js'],
    // Look for test files ending in .test.js
    testMatch: ['**/src/**/*.test.js'],
    // Set test environment to node
    testEnvironment: 'node',
  };
  
  export default config;