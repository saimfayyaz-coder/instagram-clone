import { globalTeardown as detoxGlobalTeardown } from 'detox/runners/jest';
import { TestApi } from './testApi';

// Runs once after all test files: deletes every user this run created
export default async function globalTeardown() {
  try {
    await TestApi.deleteRun();
  } finally {
    await detoxGlobalTeardown();
  }
}
