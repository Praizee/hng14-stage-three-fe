import { test, expect, type Page } from '@playwright/test';

const STORAGE = {
  users: 'habit-tracker-users',
  session: 'habit-tracker-session',
  habits: 'habit-tracker-habits',
};

async function clearAll(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
}

async function seedUser(page: Page, email: string, password: string, userId = 'u1') {
  await page.goto('/');
  await page.evaluate(
    ({ email, password, userId, key }) => {
      localStorage.setItem(
        key,
        JSON.stringify([
          { id: userId, email, password, createdAt: new Date().toISOString() },
        ]),
      );
    },
    { email, password, userId, key: STORAGE.users },
  );
}

async function seedSession(page: Page, userId = 'u1', email = 'a@b.com') {
  await page.goto('/');
  await page.evaluate(
    ({ s, key }) => localStorage.setItem(key, JSON.stringify(s)),
    { s: { userId, email }, key: STORAGE.session },
  );
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await clearAll(page);
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await seedUser(page, 'a@b.com', 'pw12345');
    await seedSession(page);
    await page.goto('/');
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@user.com');
    await page.getByTestId('auth-signup-password').fill('pw12345');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    const session = await page.evaluate(
      (k) => localStorage.getItem(k),
      STORAGE.session,
    );
    expect(session).toContain('new@user.com');
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Two users; only u1's habits should render.
    await page.goto('/');
    await page.evaluate(
      ({ usersKey, habitsKey }) => {
        localStorage.setItem(
          usersKey,
          JSON.stringify([
            { id: 'u1', email: 'one@x.com', password: 'pw', createdAt: 'x' },
            { id: 'u2', email: 'two@x.com', password: 'pw', createdAt: 'x' },
          ]),
        );
        localStorage.setItem(
          habitsKey,
          JSON.stringify([
            {
              id: 'h1',
              userId: 'u1',
              name: 'Drink Water',
              description: '',
              frequency: 'daily',
              createdAt: 'x',
              completions: [],
            },
            {
              id: 'h2',
              userId: 'u2',
              name: 'Read Books',
              description: '',
              frequency: 'daily',
              createdAt: 'x',
              completions: [],
            },
          ]),
        );
      },
      { usersKey: STORAGE.users, habitsKey: STORAGE.habits },
    );

    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('one@x.com');
    await page.getByTestId('auth-login-password').fill('pw');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toHaveCount(0);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await seedUser(page, 'a@b.com', 'pw');
    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('2L');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await seedUser(page, 'a@b.com', 'pw');
    await seedSession(page);
    await page.goto('/');
    await page.evaluate(
      (key) =>
        localStorage.setItem(
          key,
          JSON.stringify([
            {
              id: 'h1',
              userId: 'u1',
              name: 'Drink Water',
              description: '',
              frequency: 'daily',
              createdAt: 'x',
              completions: [],
            },
          ]),
        ),
      STORAGE.habits,
    );

    await page.goto('/dashboard');
    const streak = page.getByTestId('habit-streak-drink-water');
    await expect(streak).toContainText('0');
    await page.getByTestId('habit-complete-drink-water').click();
    await expect(streak).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await seedUser(page, 'a@b.com', 'pw');
    await seedSession(page);
    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await seedUser(page, 'a@b.com', 'pw');
    await seedSession(page);
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');

    const session = await page.evaluate(
      (k) => localStorage.getItem(k),
      STORAGE.session,
    );
    expect(session).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
    context,
  }) => {
    await seedUser(page, 'a@b.com', 'pw');
    await seedSession(page);
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    // Wait for service worker to activate and control the page.
    await page.waitForFunction(
      () => navigator.serviceWorker && !!navigator.serviceWorker.controller,
      undefined,
      { timeout: 10_000 },
    );

    await context.setOffline(true);
    await page.reload();

    // App shell should render — not a network-error chrome page.
    const visible = await Promise.race([
      page
        .getByTestId('dashboard-page')
        .waitFor({ timeout: 5000 })
        .then(() => true)
        .catch(() => false),
      page
        .getByTestId('splash-screen')
        .waitFor({ timeout: 5000 })
        .then(() => true)
        .catch(() => false),
    ]);
    expect(visible).toBe(true);

    await context.setOffline(false);
  });
});
