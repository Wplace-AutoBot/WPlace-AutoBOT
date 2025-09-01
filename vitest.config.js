import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            reporter: ['text', 'lcov'],
            enabled: true,
        },
        // Exclude e2e tests from vitest (they're handled by Playwright)
        exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    },
});
