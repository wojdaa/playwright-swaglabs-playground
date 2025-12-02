# Test Tags Documentation

## Overview

This project uses tags to categorize tests, making it easy to run specific test suites in different contexts (development, CI/CD, pre-release, etc.).

## Available Tags

### @smoke

**Purpose:** Critical path tests that must pass before any release.

**When to run:**

- Before every deployment
- After every major change
- In pre-commit hooks (optional)
- Quick validation of core functionality

**Coverage:**

- User login and authentication
- Product viewing and browsing
- Adding items to cart
- Complete checkout flow
- User logout

**Tests tagged with @smoke:**

- `Successful Login - Standard User`
- `View Product Inventory`
- `Add Single Item to Cart from Inventory`
- `Complete Checkout Flow - Single Item`
- `Successful Logout`

**Run command:**

```bash
npm run test:smoke
```

---

### @regression

**Purpose:** Comprehensive functional tests covering all features and edge cases.

**When to run:**

- In nightly test runs
- Before major releases
- After significant code changes
- Full validation cycle

**Coverage:**

- All authentication scenarios (valid/invalid credentials, locked users)
- Product browsing and sorting
- Shopping cart management (add/remove items)
- Complete checkout process with validations
- Navigation and menu interactions
- Social media links
- Special user scenarios (problem_user, performance_glitch_user)

**Run command:**

```bash
npm run test:regression
```

---

### @accessibility

**Purpose:** Tests ensuring WCAG 2.0/2.1 Level AA compliance and keyboard navigation.

**When to run:**

- During feature development
- Before releases
- Regular accessibility audits
- After UI changes

**Coverage:**

- Automated accessibility scanning (axe-core)
- Keyboard navigation
- Form labels and ARIA attributes
- Color contrast validation
- Focus management
- Screen reader compatibility
- Image alt text validation

**Test files:**

- `tests/accessibility/login-accessibility.spec.ts`
- `tests/accessibility/inventory-accessibility.spec.ts`
- `tests/accessibility/checkout-accessibility.spec.ts`
- `tests/accessibility/product-detail-accessibility.spec.ts`
- `tests/accessibility/keyboard-navigation.spec.ts`

**Run command:**

```bash
npm run test:accessibility
```

---

### @network

**Purpose:** Tests validating network behavior, error handling, and resilience scenarios.

**When to run:**

- During feature development involving API integrations
- Testing error handling and fallback mechanisms
- Validating application behavior during network failures
- Regular resilience testing

**Coverage:**

- Network mocking and route interception
- API failure handling
- Maintenance page scenarios
- Error message display
- Graceful degradation

**Test files:**

- `tests/network/network-mocking.spec.ts`
- `tests/network/inventory-maintenance.spec.ts`

**Run command:**

```bash
npm run test:network
```

---

### @api

**Purpose:** Tests validating API endpoints and backend functionality.

**When to run:**

- During API development
- Before backend deployments
- In integration testing
- Nightly regression runs

**Coverage:**

- API endpoint validation
- Request/response validation
- HTTP status codes
- Data structure validation
- Error handling
- Authentication/authorization

**Test files:**

- `tests/api/reqres.api.spec.ts`

**Tests tagged with @api:**

- `GET /users returns a list of users`
- `POST /users creates a new user`
- `POST /login fails with missing password`

**Run command:**

```bash
npm run test:api
```

---

### @security

**Purpose:** Security testing based on OWASP guidelines and best practices.

**When to run:**

- Before releases
- After security-related changes
- Regular security audits
- Compliance validation

**Coverage:**

- SQL injection testing
- Cross-site scripting (XSS) prevention
- Access control validation
- Session management security
- Authentication security
- Security misconfiguration checks
- Input validation

**Test files:**

- `tests/security/sql-injection.spec.ts`
- `tests/security/xss-testing.spec.ts`
- `tests/security/access-control.spec.ts`
- `tests/security/session-management.spec.ts`
- `tests/security/authentication-security.spec.ts`
- `tests/security/security-misconfiguration.spec.ts`
- `tests/security/input-validation.spec.ts`

**Run command:**

```bash
npm run test:security
```

---

### @seo

**Purpose:** Tests validating SEO metadata and search engine optimization elements.

**When to run:**

- After content changes
- Before releases
- SEO audits
- Marketing campaigns

**Coverage:**

- Page titles and meta descriptions
- Meta tags validation
- Structured data
- SEO metadata consistency

**Test files:**

- `tests/seo/seo-basic-metadata.spec.ts`

**Run command:**

```bash
npm run test:seo
```

---

### @visual

**Purpose:** Visual regression testing across different viewport sizes.

**When to run:**

- After UI changes
- Before releases
- Responsive design validation
- Cross-device testing

**Coverage:**

- Desktop view (1920x1080)
- Tablet view (768x1024)
- Mobile view (375x667)
- Screenshot comparison
- Visual consistency validation

**Test files:**

- `tests/visual/desktop-view.spec.ts`
- `tests/visual/tablet-view.spec.ts`
- `tests/visual/mobile-view.spec.ts`

**Run command:**

```bash
npm run test:visual
```

**Update snapshots:**

```bash
npm run test:visual:update
```

---

## npm Scripts Reference

```json
{
    "test": "playwright test", // Run all tests
    "test:smoke": "playwright test --grep @smoke", // Run smoke tests only
    "test:regression": "playwright test --grep @regression", // Run regression tests
    "test:accessibility": "playwright test --grep @accessibility", // Run accessibility tests
    "test:api": "playwright test --grep @api", // Run API tests only
    "test:network": "playwright test --grep @network", // Run network tests
    "test:security": "playwright test --grep @security", // Run security tests
    "test:seo": "playwright test --grep @seo", // Run SEO tests
    "test:visual": "playwright test --grep @visual", // Run visual regression tests
    "test:visual:update": "playwright test --grep @visual --update-snapshots", // Update visual snapshots
    "test:headed": "playwright test --headed", // Run with visible browser
    "test:ui": "playwright test --ui", // Run with UI mode
    "test:debug": "playwright test --debug", // Run in debug mode
    "test:chromium": "playwright test --project=chromium", // Run on Chromium only
    "test:firefox": "playwright test --project=firefox", // Run on Firefox only
    "test:webkit": "playwright test --project=webkit", // Run on WebKit only
    "report": "playwright show-report", // Show test report
    "codegen": "playwright codegen" // Generate test code
}
```

## CLI Examples

### Run specific tag combinations:

```bash
# Run tests tagged with @smoke OR @critical
npx playwright test --grep "@smoke|@critical"

# Run tests tagged with @regression but exclude @accessibility
npx playwright test --grep "@regression" --grep-invert "@accessibility"

# Run smoke tests on Chrome only
npm run test:smoke -- --project=chromium

# Run accessibility tests with headed browser
npm run test:accessibility -- --headed

# Run security tests
npm run test:security

# Run visual regression tests
npm run test:visual

# Update visual snapshots after intentional UI changes
npm run test:visual:update

# Run specific test file
npx playwright test tests/authentication/successful-login-standard-user.spec.ts

# Run tests in specific directory
npx playwright test tests/accessibility/
```

## CI/CD Integration

### Example GitHub Actions workflow:

```yaml
name: Playwright Tests

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    smoke-tests:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npm run test:smoke

    regression-tests:
        runs-on: ubuntu-latest
        if: github.event_name == 'push'
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npm run test:regression

    accessibility-tests:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
            - run: npm ci
            - run: npx playwright install --with-deps
            - run: npm run test:accessibility
```

## Best Practices

1. **Smoke tests should be fast** - Keep smoke suite under 5 minutes
2. **Tag appropriately** - Critical user journeys get @smoke, everything else gets @regression
3. **Run smoke tests frequently** - Before every commit or push
4. **Run regression tests nightly** - Full coverage on schedule
5. **Run accessibility tests regularly** - Especially after UI changes
6. **Use multiple tags** - Tests can have multiple tags (e.g., @smoke @regression)

## Test Execution Time Estimates

- **@smoke**: ~2-5 minutes (5-10 critical tests)
- **@regression**: ~15-30 minutes (60+ comprehensive tests)
- **@accessibility**: ~5-10 minutes (30+ accessibility checks)
- **@api**: ~1-2 minutes (API endpoint tests)
- **@network**: ~2-3 minutes (Network resilience tests)
- **@security**: ~5-10 minutes (25+ security checks)
- **@seo**: ~1-2 minutes (SEO metadata tests)
- **@visual**: ~3-5 minutes (Visual regression tests)
- **All tests**: ~30-50 minutes

## Adding Tags to New Tests

When creating new tests, add appropriate tags:

```typescript
test('My Critical Test @smoke @regression', async ({ page }) => {
    // test code
})

test('My Feature Test @regression', async ({ page }) => {
    // test code
})

test('My Accessibility Test @accessibility', async ({ page }) => {
    // test code
})

test('My API Test @api @regression', async ({ request }) => {
    // test code
})
```

## Tag Selection Guidelines

| Test Type                               | Tags to Use              |
| --------------------------------------- | ------------------------ |
| Critical user journey (login, checkout) | `@smoke @regression`     |
| Feature validation                      | `@regression`            |
| Edge cases and error handling           | `@regression`            |
| Accessibility checks                    | `@accessibility`         |
| API endpoint tests                      | `@api @regression`       |
| Performance tests                       | `@regression`            |
| Special user scenarios                  | `@regression`            |
| Network resilience tests                | `@network @regression`   |
| Security testing                        | `@security`              |
| SEO validation                          | `@seo`                   |
| Visual regression                       | `@visual`                |
