/** @type {import('jest').Config} */
const config = {
    // Use the 'js' extension for module resolution
    moduleFileExtensions: ['js'],
    
    // Look for test files ending in .test.js
    testMatch: ['**/src/**/*.test.js'],
    
    // Set test environment to node
    testEnvironment: 'node',
  
    // CRITICAL FIX: Instruct Jest to transform the uuid package
    transformIgnorePatterns: [
      // This regex ignores all of node_modules EXCEPT 'uuid'
      '/node_modules/(?!uuid)/',
    ],
  };
  
  export default config;