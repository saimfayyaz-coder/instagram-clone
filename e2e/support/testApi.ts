import { E2E_ENV } from './env';

// Client for the backend's test-data API (server: src/routes/e2e.routes.js).
// Each test file creates its own fresh user, so tests never share data and parallel runs never clash.

export interface TestUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface CreateUserOptions {
  // Gives the user one post, so their home feed is not empty
  withPost?: boolean;
}

// One id per test run: every user it creates is named e2e_<runId>_<random>, and teardown deletes them all.
// globalSetup sets it once; CI can pass its pipeline id instead.
const RUN_ID_ENV = 'E2E_RUN_ID';

export const ensureRunId = (): string => {
  if (!process.env[RUN_ID_ENV]) {
    process.env[RUN_ID_ENV] = process.env.CI_PIPELINE_ID ?? Date.now().toString(36);
  }
  return process.env[RUN_ID_ENV] as string;
};

const request = async <T>(method: 'POST' | 'DELETE', route: string, body?: object): Promise<T> => {
  const response = await fetch(`${E2E_ENV.apiUrl}/test${route}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'x-e2e-token': E2E_ENV.testToken },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // 404 usually means the server was started without E2E_TEST_API_ENABLED=true
    throw new Error(`Test API ${method} ${route} failed: ${response.status} ${await response.text()}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
};

export const TestApi = {
  async createUser(options: CreateUserOptions = {}): Promise<TestUser> {
    const { user } = await request<{ user: TestUser }>('POST', '/users', {
      runId: ensureRunId(),
      ...options,
    });
    return user;
  },

  // Deletes every user this run created, with their posts and follows
  async deleteRun(): Promise<number> {
    const { deletedUsers } = await request<{ deletedUsers: number }>(
      'DELETE',
      `/runs/${ensureRunId()}`,
    );
    return deletedUsers;
  },

  // Deletes users left behind by older runs that crashed before teardown
  async deleteStaleRuns(): Promise<number> {
    const { deletedUsers } = await request<{ deletedUsers: number }>('DELETE', '/runs/stale');
    return deletedUsers;
  },
};
