import fs from 'fs';
import path from 'path';

// Loads e2e/.env.e2e (gitignored) into process.env. Real env vars win, so CI can inject secrets.
const ENV_FILE = path.join(__dirname, '..', '.env.e2e');

if (fs.existsSync(ENV_FILE)) {
  fs.readFileSync(ENV_FILE, 'utf8')
    .split(/\r?\n/)
    .forEach(line => {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2];
      }
    });
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Copy e2e/.env.e2e.example to e2e/.env.e2e and fill it in.`);
  }
  return value;
};

// Where the backend's test-data API lives and the secret it expects
export const E2E_ENV = {
  get apiUrl() {
    return required('E2E_API_URL').replace(/\/+$/, '');
  },
  get testToken() {
    return required('E2E_TEST_TOKEN');
  },
};
