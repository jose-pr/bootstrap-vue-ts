module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@(.*)$': '<rootDir>/src/$1'
  },
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json'
    }
  }
}
