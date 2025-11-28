# Stability & Flakiness Notes

This project is not only a Playwright test suite but also a sandbox for exploring
**test stability**, **flakiness reduction**, and **resilience strategies** for modern UI automation.

The notes below explain the techniques already used in the framework, as well as
planned improvements for long-term reliability.

---

## ✔️ What is already implemented

### 1. CI-aware retry strategy

Playwright is configured to use:

- **retries = 0** locally,
- **retries = 1–2** on CI.

This prevents unstable CI runners or occasional network spikes from breaking entire pipelines,
while keeping debugging fast locally.

---

### 2. Full debugging artifacts on failure

Tests automatically collect:

- **trace** (`on-first-retry`)
- **video** (`retain-on-failure`)
- **screenshots**

This makes root-cause analysis faster, especially for timing issues or UI transitions.

---

### 3. Deterministic selectors

To avoid flaky tests caused by UI changes:

- `getByRole()` is used where possible,
- `data-test` attributes are preferred for important elements,
- fragile selectors (`nth-child`, random CSS chains, XPath) are avoided.

---

### 4. Reusable POM and helpers

The framework follows a clean Page Object Model with strongly typed Locators.

Reusable helpers exist for:

- login flows,
- adding items to the cart,
- waiting for network idle,
- generating visual snapshots.

This reduces duplication and increases stability across the suite.

---

### 5. Network mocking for resilience scenarios

The suite includes tests that simulate backend failures using:

```ts
page.route('**/inventory.html', route => route.fulfill(...))
```
