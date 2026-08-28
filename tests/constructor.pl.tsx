import path from 'path';
import { expect, test } from '@playwright/test';

const bunId = '643d69a5c3f7b9001cfa093c';
const bunName = 'Краторная булка N-200i';
const fillingId = '643d69a5c3f7b9001cfa0941';
const fillingName = 'Биокотлета из марсианской Магнолии';
const orderNumber = 4242;
const harsDirectory = path.resolve(__dirname, 'hars');

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(path.join(harsDirectory, 'ingredients.har'), {
    url: '**/api/ingredients',
    notFound: 'abort'
  });
  await page.routeFromHAR(path.join(harsDirectory, 'user.har'), {
    url: '**/api/auth/user',
    notFound: 'abort'
  });
  await page.routeFromHAR(path.join(harsDirectory, 'order.har'), {
    url: '**/api/orders*',
    notFound: 'abort'
  });
});

test.describe('burger constructor', () => {
  test('adds a bun and a filling to the constructor', async ({ page }) => {
    await page.goto('/');

    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${fillingId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(constructor.getByText(fillingName)).toBeVisible();
  });
});

test.describe('ingredient modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page
      .getByTestId(`ingredient-${fillingId}`)
      .getByRole('link')
      .click();
  });

  test('opens with the selected ingredient data and closes by button', async ({
    page
  }) => {
    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText(fillingName)).toBeVisible();
    await expect(modal.getByText('4242', { exact: true })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('closes by overlay click', async ({ page }) => {
    const modal = page.getByTestId('modal');

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

test.describe('order creation', () => {
  test('creates an order and clears the constructor', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: '127.0.0.1',
        path: '/'
      }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    await page.goto('/');

    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${fillingId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('burger-constructor');
    await constructor
      .getByRole('button', { name: 'Оформить заказ' })
      .click();

    const modal = page.getByTestId('modal');
    await expect(
      modal.getByText(String(orderNumber), { exact: true })
    ).toBeVisible();
    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).not.toBeVisible();
  });
});
