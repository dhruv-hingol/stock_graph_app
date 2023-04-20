import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
const express = require('express');
const app = express();

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.jsx')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));
