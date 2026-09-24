import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Tiempo máximo permitido para cada test.
  timeout: 60_000,

  // Evita sobrecargar Next.js ejecutando todo al mismo tiempo.
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  // Solo reintenta automáticamente en integración continua.
  retries: process.env.CI ? 2 : 0,

  // Máximo de dos procesos simultáneos en la computadora.
  workers: process.env.CI ? 1 : 2,

  reporter: [
    ["list"],
    ["html", { open: "never" }],
  ],

  expect: {
    timeout: 15_000,
  },

  use: {
    baseURL: "http://127.0.0.1:3000",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});