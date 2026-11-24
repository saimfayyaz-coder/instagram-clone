import { globalSetup as detoxGlobalSetup } from 'detox/runners/jest';
import { TestApi, ensureRunId } from './testApi';

// Runs once before all test files: picks the run id and clears leftovers from crashed runs
export default async function globalSetup() {
  ensureRunId();
  await TestApi.deleteStaleRuns();
  await detoxGlobalSetup();
}
