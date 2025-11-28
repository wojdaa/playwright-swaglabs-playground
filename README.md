# playwright-playground-swaglabs

Comprehensive end-to-end test suite for the [SauceDemo](https://www.saucedemo.com/) e-commerce application, built with **Playwright Test** and **TypeScript**.

This project serves as a realistic **automation playground**, demonstrating:

- clean and scalable **Page Object Model (POM)**,
- tagged **smoke / regression / accessibility / visual** suites,
- strong use of **helpers + utilities**,
- **CI integration** (GitHub Actions + local Jenkins),
- best practices for configuration & environment separation,
- example **visual regression workflow**,
- example **accessibility testing** with Axe.

---

## 🚀 Tech Stack

- **Playwright Test** (`@playwright/test`)
- **TypeScript**
- **axe-core** (`@axe-core/playwright`)
- **dotenv**
- **GitHub Actions**
- **Jenkins** (optional)

---

## 📁 Project Structure

```text
.
├─ .github/
│  └─ workflows/
│     └─ playwright.yml            # GitHub Actions pipeline
├─ pages/                          # Page Object Model classes
│  ├─ base.page.ts
│  ├─ login.page.ts
│  ├─ inventory.page.ts
│  ├─ cart.page.ts
│  ├─ checkout-step-one.page.ts
│  ├─ checkout-step-two.page.ts
│  ├─ checkout-complete.page.ts
│  └─ ...
├─ tests/
│  ├─ e2e/
│  │  ├─ authentication/
│  │  ├─ checkout/
│  │  ├─ navigation/
│  │  ├─ performance-user/
│  │  └─ problem-user/
│  └─ visual/
│     └─ tablet-view.spec.ts       # visual regression tests
├─ test-data/
│  └─ users.json
├─ utils/
│  ├─ config.ts                    # env + global config
│  ├─ test-helpers.ts              # login helpers, visual snapshot utils, etc.
│  └─ ...
├─ IMPLEMENTATION-SUMMARY.md       # summary of scripts & tags
├─ TEST-TAGS.md                    # full tag documentation
├─ playwright.config.ts
├─ package.json
└─ README.md
```

## ⚙️ Configuration & Environment Variables

This project uses environment variables for configuration.

Local development

Create a ```.env``` file in project root:
```
BASE_URL=https://www.saucedemo.com
PASSWORD=secret_sauce
```
```utils/config.ts``` loads these values via ```dotenv```.

CI (GitHub Actions / Jenkins)

Environment variables are injected via:
- GitHub Secrets → ```PASSWORD: ${{ secrets.SWAGLABS_PASSWORD }}```
- Jenkins Credentials → ```PASSWORD = credentials('swaglabs-password')```

No secrets stored in repository.

## ▶️ Running Tests

Install dependencies
```
npm install
npx playwright install
```
Run all tests
```
npm test
# or
npx playwright test
```
Tagged suites
```
# Smoke tests
npm run test:smoke

# Full regression
npm run test:regression

# Accessibility (axe-core)
npm run test:accessibility

# Critical scenarios
npm run test:critical
```
Browser / execution modes
```npm run test:chromium
npm run test:firefox
npm run test:webkit

npm run test:ui        # Playwright UI mode
npm run test:headed    # headful tests
npm run test:debug     # with debugger
```
HTML report
```
npm run report
```

## 🏷️ Test Tags

All tag documentation is stored in:

- TEST-TAGS.md
- IMPLEMENTATION-SUMMARY.md

Short summary:

- ```@smoke``` — critical path
- ```@regression``` — extended workflow coverage
- ```@critical``` — tests with stronger business impact
- ```@accessibility``` — axe-core checks
- ```@visual``` — visual regression tests

Usage:
```
npx playwright test --grep @smoke
```

## 🖼️ Visual Regression Testing

Visual snapshots live next to the test:
```
tests/visual/tablet-view.spec.ts-snapshots/
  visual-tablet-order-complete.png
  ...
```
Visual helper:
```
await takeVisualSnapshot(page, 'visual-tablet-order-complete', {fullPage: true});
```
Updating snapshots

If UI changes intentionally:
```
npx playwright test tests/visual/tablet-view.spec.ts --update-snapshots
```
Tip: Regenerate snapshots on Linux (same as GitHub Actions runner) for consistent results.

## ♿ Accessibility Testing (axe-core)

Accessibility tests use ```@axe-core/playwright```.

Example:
```
const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
expect(accessibilityScanResults.violations).toEqual([]);
```
Execute with:
```
npm run test:accessibility
```

## 🔌 API Tests (Reqres.in)
- folder: ```/tests/api```
- stack: Playwright APIRequestContext + TypeScript
- includes: ```GET``` /users, ```POST``` /users, ```POST``` /login (negative)

In order to use POST please use following ```x-api-key``` header: ```reqres-free-v1``` 

## 🔄 CI / CD

GitHub Actions

Workflow file: ```.github/workflows/playwright.yml```

Pipeline:
- Checkout repo
- Install Node LTS
- ```npm ci```
- Install browsers + Linux deps
- Run full Playwright test suite
- Upload HTML report as artifact

Secrets:
- ```SWAGLABS_PASSWORD``` → mapped to ```PASSWORD``` env

Jenkins (optional)

Local Jenkins in Docker using ```jenkins/jenkins:lts-jdk17```.

Pipeline performs:
- Checkout
- ```npm ci```
- ```npx playwright install```
- Run tests
- Archive:
  - ```test-results/**/*``` (screenshots, traces, videos)
  - ```playwright-report/**```

This integration is included as a learning/demo setup.

## 🤝 Contributing & Extending

When adding new tests:

Follow POM conventions in pages/.

Add tags (@smoke, @regression, etc.).

Prefer helpers for shared flows (login, addToCart, checkout).

Keep snapshot baseline names consistent.

Update README if adding new suites, commands or tags.

## 📄 License

ISC