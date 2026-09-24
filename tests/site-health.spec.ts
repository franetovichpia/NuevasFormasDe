import { expect, test } from "@playwright/test";

test.describe("Nuevas formas de — estado general", () => {
  test("la página principal carga sin errores críticos", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    expect(response).not.toBeNull();
    expect(response?.ok()).toBeTruthy();

    await expect(page.locator("body")).toBeVisible();

    expect(
      consoleErrors,
      `Errores encontrados en la consola:\n${consoleErrors.join("\n")}`,
    ).toEqual([]);

    expect(
      pageErrors,
      `Errores de JavaScript:\n${pageErrors.join("\n")}`,
    ).toEqual([]);
  });

  test("la página tiene título y contenido", async ({ page }) => {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveTitle(/\S+/);
    await expect(page.locator("body")).toBeVisible();

    const visibleText = (await page.locator("body").innerText()).trim();

    expect(
      visibleText.length,
      "La página tiene muy poco contenido visible",
    ).toBeGreaterThan(50);
  });

  test("las imágenes visibles cargan correctamente", async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    const images = await page.locator("img:visible").all();

    for (let index = 0; index < images.length; index++) {
      const image = images[index];

      await image.evaluate((element) => {
        (element as HTMLElement).scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      });

      await page.waitForTimeout(200);

      await expect
        .poll(
          async () =>
            image.evaluate((element) => {
              const img = element as HTMLImageElement;

              if (!img.complete) {
                return 0;
              }

              return img.naturalWidth;
            }),
          {
            timeout: 15_000,
            message: `La imagen visible número ${index + 1} no pudo cargar`,
          },
        )
        .toBeGreaterThan(0);
    }
  });

  test("los enlaces internos responden correctamente", async ({
    page,
    request,
  }) => {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    const currentOrigin = new URL(page.url()).origin;

    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links
        .map((link) => (link as HTMLAnchorElement).href)
        .filter(Boolean),
    );

    const normalizedURLs = hrefs.flatMap((href) => {
      try {
        const url = new URL(href);

        if (url.origin !== currentOrigin) {
          return [];
        }

        url.hash = "";

        return [url.toString()];
      } catch {
        return [];
      }
    });

    const internalURLs = [...new Set(normalizedURLs)];
    const brokenLinks: string[] = [];

    for (const url of internalURLs) {
      const response = await request.get(url, {
        timeout: 15_000,
      });

      if (!response.ok()) {
        brokenLinks.push(`${response.status()} — ${url}`);
      }
    }

    expect(
      brokenLinks,
      `Enlaces internos con errores:\n${brokenLinks.join("\n")}`,
    ).toEqual([]);
  });

  test("la página no genera desplazamiento horizontal", async ({ page }) => {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    const measurements = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));

    expect(
      measurements.pageWidth,
      `La página mide ${measurements.pageWidth}px, pero la pantalla mide ${measurements.viewportWidth}px`,
    ).toBeLessThanOrEqual(measurements.viewportWidth + 1);
  });
});