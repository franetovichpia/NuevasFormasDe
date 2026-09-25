import { expect, test } from "@playwright/test";

import { mainNavigation } from "../data/navigation";

test.describe("Navegación y accesos", () => {
  test("cada enlace del menú apunta a una sección existente", async ({
    page,
  }) => {
    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    for (const item of mainNavigation) {
      const id = item.href.split("#")[1];

      await expect(
        page.locator(`[id="${id}"]`),
        `Falta la sección #${id} (${item.label})`,
      ).toHaveCount(1);
    }
  });

  test("el menú lleva a su sección también desde /entrevistas", async ({
    page,
  }) => {
    await page.goto("/entrevistas", {
      waitUntil: "domcontentloaded",
    });

    await page.goto(
      mainNavigation.find(
        (item) => item.label === "Eventos",
      )!.href,
    );

    await expect(
      page.locator("#eventos"),
    ).toBeVisible();
  });

  test("/entrevistas muestra el listado, los filtros y la flecha para volver", async ({
    page,
  }) => {
    await page.goto("/entrevistas", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        name: "Todas las entrevistas.",
      }),
    ).toBeVisible();

    await expect(
      page.getByLabel("Red social"),
    ).toBeVisible();

    await expect(
      page.getByLabel("Categoría"),
    ).toBeVisible();

    await expect(
      page.getByRole("link", {
        name: "Volver",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      "/#conversaciones",
    );
  });

  test("el botón Ingresar abre el modal y lleva al login", async ({
    page,
  }) => {
    await page.setViewportSize({
      width: 1440,
      height: 900,
    });

    await page.goto("/", {
      waitUntil: "domcontentloaded",
    });

    await page
      .getByRole("button", {
        name: "Ingresar",
      })
      .first()
      .click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();

    await dialog
      .getByRole("link", {
        name: "Ingresar al panel",
      })
      .click();

    await expect(page).toHaveURL(
      /\/admin\/login$/,
    );

    await expect(
      page.getByRole("link", {
        name: "Volver al sitio",
      }),
    ).toBeVisible();
  });

  test("el panel no se puede abrir sin sesión", async ({
    page,
    request,
  }) => {
    for (const path of [
      "/admin",
      "/admin/eventos",
      "/admin/eventos/nuevo",
      "/admin/entrevistas",
    ]) {
      await page.goto(path);

      await expect(page).toHaveURL(
        /\/admin\/login$/,
      );
    }

    const upload = await request.post(
      "/api/admin/upload",
    );

    expect(upload.status()).toBe(401);
  });
});
