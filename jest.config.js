module.exports = {
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^components/(.*)': '<rootDir>/src/components/$1',
    '^common/(.*)': '<rootDir>/src/common/$1',
    '^extensions/(.*)': '<rootDir>/src/extensions/$1',
    '^actions/(.*)': '<rootDir>/src/store/actions/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/**.ts', 'src/**/**.tsx'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testEnvironment: 'node',
  verbose: true,
};
