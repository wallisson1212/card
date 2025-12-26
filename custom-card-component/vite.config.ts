import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use the 'exemplo' folder as root when running the dev server so the example app's index.html is served.
  ...(command === 'serve' ? { root: 'exemplo' } : {}),
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'CustomCardComponent',
      fileName: (format) => `custom-card-component.${format}.js`,
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
}));