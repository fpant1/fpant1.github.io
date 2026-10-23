import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/", "/blog/", "/projects/", "/cv/", "/projects/1_project/", "/projects/2_project/", "/blog/2025/advanced-images/"];
for (const theme of ["light", "dark"]) {
  test.describe(theme + " theme", () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    });
    test("header position stays stable between pages", async ({ page }) => {
      let baseline;
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await page.evaluate(() => document.fonts.ready);
        const box = await page.locator(".site-header").boundingBox();
        const brand = await page.locator(".site-brand").boundingBox();
        const nav = (await page.locator(".site-navigation").isVisible()) ? await page.locator(".site-navigation").boundingBox() : null;
        const geometry = { height: box.height, brandX: brand.x, brandY: brand.y, navX: nav?.x ?? 0 };
        if (baseline) {
          for (const key of Object.keys(geometry))
            expect(Math.abs(geometry[key] - baseline[key]), route + " " + key).toBeLessThanOrEqual(1);
        } else baseline = geometry;
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        expect(overflow, route + " horizontal overflow").toBe(false);
      }
    });
    for (const route of routes) {
      test("accessible page " + route, async ({ page }) => {
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto(route);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("main")).toBeVisible();
        const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(result.violations).toEqual([]);
        expect(errors).toEqual([]);
      });
    }
  });
}
test("homepage photo and introduction are not clipped or covered", async ({ page }) => {
  await page.goto("/");
  const photo = page.locator(".profile-hero__media img");
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  const header = await page.locator(".site-header").boundingBox();
  const intro = await page.locator(".profile-hero__text").boundingBox();
  const image = await photo.boundingBox();
  expect(intro.y).toBeGreaterThanOrEqual(header.y + header.height);
  expect(image.y).toBeGreaterThanOrEqual(header.y + header.height);
  const hero = await page.locator(".profile-hero").boundingBox();
  expect(image.y + image.height).toBeLessThanOrEqual(hero.y + hero.height + 1);
  if (page.viewportSize().width < 768) {
    expect(image.y + image.height).toBeLessThanOrEqual(intro.y);
  } else {
    expect(image.x).toBeGreaterThan(intro.x);
  }
});

test("first visit starts light and a chosen dark theme survives reload", async ({ page, isMobile }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("button", { name: /Change colour theme/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme-setting", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("keyboard menu, escape and theme toggle work", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  if (isMobile) {
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "projects", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await menu.click();
  }
  const themeToggle = page.getByRole("button", { name: /Change colour theme/ });
  await expect(page.locator("html")).toHaveAttribute("data-theme-setting", "light");
  await expect(themeToggle).toHaveAccessibleName("Change colour theme. Current: light. Next: dark.");
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(themeToggle).toHaveAccessibleName("Change colour theme. Current: dark. Next: system.");
  await page.emulateMedia({ colorScheme: "dark" });
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme-setting", "system");
  await expect(themeToggle).toHaveAccessibleName("Change colour theme. Current: system (dark). Next: light.");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(themeToggle).toHaveAccessibleName("Change colour theme. Current: system (light). Next: light.");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme-setting", "system");
});
test("robot animation uses the reduced motion poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/");
  const image = page.locator('img[src*="robot-thumbnail.webp"]');
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((element) => element.currentSrc)).toContain("robot-poster.webp");
});

test("travel gallery advances and stays within the reading column", async ({ page }) => {
  await page.goto("/blog/2025/advanced-images/");
  const gallery = page.locator("swiper-container").first();
  await expect.poll(() => gallery.evaluate((element) => element.swiper?.activeIndex)).toBe(0);
  await gallery.getByRole("button", { name: "Next slide" }).click();
  await expect.poll(() => gallery.evaluate((element) => element.swiper.activeIndex)).toBe(1);
  const galleryBox = await gallery.boundingBox();
  const articleBox = await page.locator(".post-content").boundingBox();
  expect(galleryBox.width).toBeLessThanOrEqual(articleBox.width + 1);
});
test("navigation remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.getByRole("link", { name: "projects", exact: true })).toBeVisible();
  await context.close();
});
