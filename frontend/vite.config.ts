import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      domains: ['localhost'],
      /** optional, days before certificate expires */
      ttlDays: 30,
      /** custom certification directory */
      certDir: './cert',
    }),
  ],
});
