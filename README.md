# playwright-playground-swaglabs

Comprehensive end-to-end test suite for the [SauceDemo](https://www.saucedemo.com/) e-commerce application, built with **Playwright Test** and **TypeScript**.

This project serves as a realistic **automation playground**, demonstrating:

- clean and scalable **Page Object Model (POM)**,
- tagged **smoke / regression / accessibility / api / network / security / seo / visual** suites,
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
│  │  ├─ problem-user/
│  │  ├─ product-browsing/
│  │  └─ shopping-cart/
│  ├─ accessibility/               # WCAG compliance tests
│  ├─ api/                         # API endpoint tests
│  ├─ network/                     # Network resilience tests
│  ├─ security/                    # OWASP security tests
│  ├─ seo/                         # SEO metadata tests
│  └─ visual/                      # Visual regression tests
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

Create a `.env` file in project root:

```
BASE_URL=https://www.saucedemo.com
PASSWORD=your_password_here
API_KEY=your_api_key_here
```

`utils/config.ts` loads these values via `dotenv`.

CI (GitHub Actions / Jenkins)

Environment variables are injected via:

- GitHub Secrets → `PASSWORD: ${{ secrets.SWAGLABS_PASSWORD }}` and `API_KEY: ${{ secrets.API_KEY }}`
- Jenkins Credentials → `PASSWORD = credentials('swaglabs_password')` and `API_KEY = credentials('api_key')`

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

# API tests
npm run test:api

# Network resilience
npm run test:network

# Security tests (OWASP)
npm run test:security

# SEO validation
npm run test:seo

# Visual regression
npm run test:visual
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

- `@smoke` — critical path
- `@regression` — extended workflow coverage
- `@accessibility` — axe-core WCAG checks
- `@api` — API endpoint validation
- `@network` — network resilience and error handling
- `@security` — OWASP security testing
- `@seo` — SEO metadata validation
- `@visual` — visual regression tests

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

Accessibility tests use `@axe-core/playwright`.

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

- folder: `/tests/api`
- stack: Playwright APIRequestContext + TypeScript
- includes: `GET` /users, `POST` /users, `POST` /login (negative)

In order to use POST requests, configure your API key in the `.env` file or CI/CD credentials.

## 🌐 Network Resilience Testing

Network tests validate application behavior under various network conditions using Playwright's route mocking capabilities:

- **API Failure Handling** - Testing graceful degradation when API endpoints return errors (500, 503)
- **Image Loading Failures** - Verifying UI remains functional when resource loading fails
- **Maintenance Scenarios** - Simulating maintenance pages and service unavailability
- **Error Messages** - Validating user-friendly error messages are displayed
- **Fallback Behavior** - Ensuring proper fallback mechanisms are in place

Test coverage uses route interception and mocking:

```typescript
// Example: Mock API failure
await page.route('**/api/inventory', async (route) => {
    await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
    })
})

// Example: Mock maintenance page
await page.route('**/inventory.html', async (route) => {
    await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<h1>Maintenance in progress</h1>',
    })
})
```

Execute with:

```bash
npm run test:network
```

All network tests are tagged with `@network`.

## 🔒 Security Testing (OWASP)

Security tests follow OWASP Top 10 guidelines and include:

- **SQL Injection** - Testing injection prevention in login and input fields
- **XSS (Cross-Site Scripting)** - Validating proper encoding/escaping of user inputs
- **Broken Access Control** - Verifying authentication and authorization controls
- **Session Management** - Testing session fixation, termination, and handling
- **Authentication Security** - Checking password field types, autocomplete, form methods
- **Security Misconfiguration** - Validating HTTPS, security headers, cookie attributes
- **Input Validation** - Testing special characters, null bytes, long strings

Test coverage:

```typescript
// Example: XSS Testing
await attemptLogin(page, "<script>alert('XSS')</script>", 'test')
await verifyNoXssExecution(page)

// Example: SQL Injection Testing
await attemptLogin(page, "' OR '1'='1", 'test')
await verifyLoginFailed(page)
```

Execute with:

```bash
npm run test:security
```

All security tests are tagged with `@security` and use helper functions from `utils/security-helpers.ts`.

## 🔍 SEO Testing

SEO tests validate basic metadata and page structure:

- **Title Tags** - Verifying page titles are present and descriptive
- **Meta Descriptions** - Checking meta description tags
- **Charset Declaration** - Validating UTF-8 charset
- **Canonical Links** - Testing canonical URL implementation
- **Metadata Consistency** - Ensuring consistent metadata across pages

Test coverage includes Login, Inventory, and Cart pages.

Example:

```typescript
await verifyBasicSeoMetadata(page)
const metaCharset = page.locator('meta[charset]')
await expect(metaCharset).toHaveAttribute('charset', 'utf-8')
```

Execute with:

```bash
npm run test:seo
```

All SEO tests are tagged with `@seo`.

## 🔄 CI / CD

GitHub Actions

Workflow file: `.github/workflows/playwright.yml`

Pipeline:

- Checkout repo
- Install Node LTS
- `npm ci`
- Install browsers + Linux deps
- Run full Playwright test suite
- Upload HTML report as artifact

Secrets:

- `SWAGLABS_PASSWORD` → mapped to `PASSWORD` env

Jenkins (optional)

Local Jenkins in Docker using `jenkins/jenkins:lts-jdk17`.

**Setup:**

```bash
# Pull and run Jenkins
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --name jenkins jenkins/jenkins:lts-jdk17

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Configuration:**

1. Access Jenkins at `http://localhost:8080`
2. Install suggested plugins + HTML Publisher Plugin
3. Configure credentials (Manage Jenkins → Credentials):
    - Add Secret Text: `swaglabs_password` with your password value
    - Add Secret Text: `api_key` with your API key value
4. Create new Pipeline job pointing to your repository

**Pipeline stages:**

- Checkout repository
- Install dependencies with `npm ci`
- Install Playwright browsers with `npx playwright install --with-deps`
- Run tagged test suites:
    - Smoke tests (all branches)
    - Regression tests (main/master only)
    - Accessibility tests (main/master only)
    - Security tests (main/master only)
    - API tests (all branches)
    - Network tests (all branches)
    - SEO tests (all branches)
- Publish results:
    - JUnit XML report
    - Archived artifacts (screenshots, traces, videos)
    - HTML test report

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
