# Sauce Demo - Security Test Plan (Soft OWASP)

## Application Overview

The Sauce Demo (https://www.saucedemo.com) is a demo e-commerce application designed for testing purposes. It features user authentication, product browsing, shopping cart, and checkout functionality. This security test plan focuses on soft OWASP checks applicable to the application's functionality and architecture.

**Security Context:**

- Application uses HTTPS (secure context)
- Simple cookie-based session management (`session-username`)
- No authentication tokens observed
- Client-side routing with direct URL access
- Limited form inputs (login, checkout)

**Applicable OWASP Checks:**
Based on the application's architecture, the following soft OWASP checks are applicable:

- A03:2021 - Injection (SQL Injection, XSS)
- A01:2021 - Broken Access Control
- A05:2021 - Security Misconfiguration
- A07:2021 - Identification and Authentication Failures

## Test Scenarios

### 1. SQL Injection Testing

**Seed:** `tests/seed.spec.ts`

#### 1.1 SQL Injection in Login Form - Username Field

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. In the username field, enter: `' OR '1'='1`
3. In the password field, enter: `' OR '1'='1`
4. Click the "Login" button

**Expected Results:**

- Login should fail with error message
- Application should not process SQL injection payload
- Error message should be: "Epic sadface: Username and password do not match any user in this service"
- No database errors exposed to the user

#### 1.2 SQL Injection with UNION Attack

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. In the username field, enter: `admin' UNION SELECT NULL--`
3. In the password field, enter: `test`
4. Click the "Login" button

**Expected Results:**

- Login should fail gracefully
- No SQL error messages displayed
- Application should treat input as literal string

#### 1.3 SQL Injection with Comment Sequences

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. In the username field, enter: `admin'--`
3. In the password field, enter: `anything`
4. Click the "Login" button

**Expected Results:**

- Login should fail
- No bypass of authentication
- Standard error message displayed

### 2. Cross-Site Scripting (XSS) Testing

**Seed:** `tests/seed.spec.ts`

#### 2.1 Reflected XSS in Login Form

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. In the username field, enter: `<script>alert('XSS')</script>`
3. In the password field, enter: `test`
4. Click the "Login" button

**Expected Results:**

- No JavaScript alert should appear
- Error message should display without executing script
- Input should be properly encoded/escaped in the DOM
- Browser console should not show script execution

#### 2.2 XSS with Image Tag in Login

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. In the username field, enter: `<img src=x onerror=alert('XSS')>`
3. In the password field, enter: `test`
4. Click the "Login" button

**Expected Results:**

- No JavaScript alert should appear
- HTML should be escaped or sanitized
- No broken image icons displayed

#### 2.3 XSS in Checkout Form - First Name

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Login with valid credentials (standard_user / secret_sauce)
3. Navigate to cart: `https://www.saucedemo.com/cart.html`
4. Click "Checkout" button
5. In "First Name" field, enter: `<script>alert('XSS')</script>`
6. In "Last Name" field, enter: `Test`
7. In "Zip/Postal Code" field, enter: `12345`
8. Click "Continue" button
9. Inspect the checkout overview page for script execution

**Expected Results:**

- No JavaScript alert should appear
- Script tags should be escaped/sanitized
- Checkout process should complete normally
- Data should be stored safely without executing

#### 2.4 XSS with Event Handlers in Checkout

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Login with valid credentials (standard_user / secret_sauce)
3. Navigate to cart and proceed to checkout
4. In "First Name" field, enter: `<img src=x onerror=alert('XSS')>`
5. In "Last Name" field, enter: `" onload="alert('XSS')`
6. In "Zip/Postal Code" field, enter: `<svg/onload=alert('XSS')>`
7. Click "Continue" button

**Expected Results:**

- No JavaScript alerts should appear
- All malicious payloads should be neutralized
- Form should process normally

### 3. Broken Access Control

**Seed:** `tests/seed.spec.ts`

#### 3.1 Direct URL Access Without Authentication

**Steps:**

1. Open a new incognito/private browser window
2. Navigate directly to: `https://www.saucedemo.com/inventory.html`
3. Observe the page behavior

**Expected Results:**

- Should redirect to login page OR
- Should display inventory page (verify if this is intentional - demo site may allow this)
- Document actual behavior for security assessment

#### 3.2 Cart Access Without Authentication

**Steps:**

1. Open a new incognito/private browser window
2. Navigate directly to: `https://www.saucedemo.com/cart.html`
3. Verify page access and functionality

**Expected Results:**

- Verify if authentication is enforced
- Document if cart is accessible without login
- Check if any session data is required

#### 3.3 Checkout Access Without Authentication

**Steps:**

1. Open a new incognito/private browser window
2. Navigate directly to: `https://www.saucedemo.com/checkout-step-one.html`
3. Try to complete checkout process

**Expected Results:**

- Evaluate if checkout requires prior authentication
- Document any security gaps in access control

#### 3.4 Session Cookie Manipulation

**Steps:**

1. Login with valid credentials (standard_user / secret_sauce)
2. Open browser developer tools
3. Navigate to Application/Storage > Cookies
4. Identify the session cookie: `session-username=standard_user`
5. Modify cookie value to: `session-username=locked_out_user`
6. Refresh the page
7. Observe application behavior

**Expected Results:**

- Application should validate session properly
- Cookie manipulation should not grant unauthorized access
- Session should be tied to backend validation, not just client-side cookie

#### 3.5 Horizontal Privilege Escalation

**Steps:**

1. Login as `standard_user`
2. Note the cookie: `session-username=standard_user`
3. Manually change cookie to: `session-username=problem_user`
4. Navigate through the application
5. Verify if user context changes

**Expected Results:**

- Users should not be able to impersonate other users via cookie manipulation
- Backend should validate session integrity
- Document any privilege escalation vulnerabilities

### 4. Authentication Security

**Seed:** `tests/seed.spec.ts`

#### 4.1 Autocomplete Attribute Check

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Inspect the password field HTML
3. Check for `autocomplete` attribute

**Expected Results:**

- Password field should have `autocomplete="current-password"` or `autocomplete="off"`
- Username field should have appropriate autocomplete value
- Note: Console warnings observed suggest missing autocomplete attributes

#### 4.2 Password Field Type Check

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Inspect the password field
3. Verify `type="password"` attribute

**Expected Results:**

- Password field should have `type="password"`
- Password should be masked (not visible)
- Browser should not reveal password by default

#### 4.3 Form Method Security

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Inspect the login form element
3. Check form `method` and `action` attributes

**Expected Results:**

- Form method should be POST (not GET)
- Note: Observed form method is GET, which exposes credentials in URL
- This is a security misconfiguration for a production application
- Credentials should not appear in browser history or server logs

#### 4.4 Brute Force Protection

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Attempt 10 consecutive failed login attempts with:
    - Username: `test_user`
    - Password: `wrong_password`
3. Observe application response time and behavior

**Expected Results:**

- Application should implement rate limiting or account lockout
- CAPTCHA or similar mechanism should appear after multiple failures
- Document if no protection exists (acceptable for demo environment)

#### 4.5 Session Timeout

**Steps:**

1. Login with valid credentials
2. Leave the browser idle for 30 minutes
3. Attempt to navigate to different pages
4. Try to complete a checkout

**Expected Results:**

- Session should expire after reasonable inactivity period
- User should be redirected to login page
- Document actual timeout behavior

### 5. Security Misconfiguration

**Seed:** `tests/seed.spec.ts`

#### 5.1 HTTPS Enforcement

**Steps:**

1. Attempt to navigate to: `http://www.saucedemo.com/` (HTTP, not HTTPS)
2. Observe if redirect to HTTPS occurs
3. Check browser security indicators

**Expected Results:**

- HTTP should redirect to HTTPS
- Application should enforce secure connections
- Browser should show secure padlock icon

#### 5.2 Security Headers Check

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Open browser developer tools > Network tab
3. Select the main document request
4. Inspect Response Headers for:
    - `Content-Security-Policy`
    - `X-Frame-Options`
    - `X-Content-Type-Options`
    - `Strict-Transport-Security`
    - `X-XSS-Protection`

**Expected Results:**

- Document which security headers are present
- Note missing security headers
- CSP should restrict inline scripts and unsafe sources
- X-Frame-Options should prevent clickjacking

#### 5.3 Cookie Security Attributes

**Steps:**

1. Login with valid credentials
2. Open Developer Tools > Application > Cookies
3. Inspect the `session-username` cookie attributes
4. Check for:
    - `Secure` flag
    - `HttpOnly` flag
    - `SameSite` attribute

**Expected Results:**

- Cookies should have `Secure` flag (HTTPS only)
- Session cookies should have `HttpOnly` flag (prevent XSS access)
- `SameSite=Strict` or `SameSite=Lax` should be set
- Document actual cookie configuration

#### 5.4 Error Message Information Disclosure

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Login with invalid credentials
3. Examine error messages for information leakage

**Expected Results:**

- Error messages should be generic
- Should not indicate whether username or password is incorrect
- Should not reveal system information
- Actual message: "Epic sadface: Username and password do not match any user in this service" (acceptable)

#### 5.5 Client-Side Credential Exposure

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. View page source
3. Search for any hardcoded credentials or sensitive information

**Expected Results:**

- No credentials should be in page source
- Note: Demo site displays accepted usernames and password on login page (intentional for demo purposes)
- API keys or tokens should not be exposed

### 6. Input Validation

**Seed:** `tests/seed.spec.ts`

#### 6.1 Maximum Length Validation - Login Fields

**Steps:**

1. Navigate to `https://www.saucedemo.com/`
2. Enter 1000 character string in username field
3. Enter 1000 character string in password field
4. Click "Login" button

**Expected Results:**

- Fields should have maximum length restrictions
- Application should handle long inputs gracefully
- No buffer overflow or system errors

#### 6.2 Special Characters in Checkout Fields

**Steps:**

1. Login with valid credentials
2. Navigate to checkout
3. In "First Name" field, enter: `!@#$%^&*()_+-=[]{}|;:'",.<>?/\`
4. In "Last Name" field, enter: `æøåäöüßñ`
5. In "Zip/Postal Code" field, enter: `ABC-123!@#`
6. Click "Continue"

**Expected Results:**

- Application should handle special characters safely
- Unicode characters should be processed correctly
- Postal code validation should accept or reject based on requirements

#### 6.3 Empty String and Whitespace Validation

**Steps:**

1. Navigate to checkout form
2. Enter only spaces in required fields
3. Attempt to submit form

**Expected Results:**

- Empty or whitespace-only fields should be rejected
- Proper validation messages should appear
- Form should not accept whitespace as valid input

#### 6.4 Null Byte Injection

**Steps:**

1. Navigate to login page
2. In username field, enter: `admin%00`
3. In password field, enter: `password%00`
4. Click "Login"

**Expected Results:**

- Null bytes should be properly handled
- No unexpected behavior or errors
- Login should fail normally

### 7. Session Management

**Seed:** `tests/seed.spec.ts`

#### 7.1 Concurrent Session Handling

**Steps:**

1. Login with `standard_user` in Browser A
2. Login with same credentials in Browser B (different browser/incognito)
3. Perform actions in both browsers
4. Verify session integrity

**Expected Results:**

- Document if multiple sessions are allowed
- Sessions should remain independent
- Actions in one browser should not affect the other

#### 7.2 Session Fixation

**Steps:**

1. Open browser and navigate to site (not logged in)
2. Note any session cookies set
3. Login with valid credentials
4. Verify if session ID/cookie changed after login

**Expected Results:**

- Session identifier should regenerate after successful login
- Pre-login session should be invalidated
- New session should be established post-authentication

#### 7.3 Logout Session Termination

**Steps:**

1. Login with valid credentials
2. Note the session cookie value
3. Click on menu and select "Logout"
4. Copy the logout redirect URL
5. Press browser "Back" button
6. Verify if protected pages are accessible

**Expected Results:**

- Session cookie should be cleared/invalidated
- Back button should not restore authenticated session
- Attempting to access protected pages should redirect to login

### 8. URL Parameter Tampering

**Seed:** `tests/seed.spec.ts`

#### 8.1 Product ID Manipulation

**Steps:**

1. Login with valid credentials
2. Click on any product to view details
3. Note URL structure (e.g., `inventory-item.html?id=X`)
4. Modify URL parameter to negative number: `?id=-1`
5. Modify to very large number: `?id=999999`
6. Modify to string: `?id=test`

**Expected Results:**

- Invalid IDs should be handled gracefully
- No system errors or stack traces exposed
- Application should show appropriate error or default page

#### 8.2 Cart Item Manipulation

**Steps:**

1. Login and add items to cart
2. Inspect URL structure when in cart
3. Attempt to manipulate any URL parameters
4. Verify backend validates cart contents

**Expected Results:**

- Cart contents should be validated server-side
- URL manipulation should not corrupt cart state
- Prices should be recalculated on server, not client

## Testing Notes

### Tools for Extended Testing

For comprehensive security testing, consider using:

- **OWASP ZAP** - Automated vulnerability scanner
- **Burp Suite Community** - Manual security testing and request interception
- **Browser DevTools** - Cookie and header inspection
- **curl/Postman** - API endpoint testing

### Out of Scope for Soft Testing

The following OWASP categories are less applicable to this demo application:

- **A08:2021 - Software and Data Integrity Failures** - No complex updates/CI/CD
- **A09:2021 - Security Logging and Monitoring** - Demo app with limited logging
- **A10:2021 - Server-Side Request Forgery (SSRF)** - No URL fetching functionality
- **A04:2021 - Insecure Design** - Architectural review beyond scope
- **A06:2021 - Vulnerable and Outdated Components** - Requires dependency scanning tools

### Key Findings from Exploration

1. **HTTPS**: Application uses HTTPS (secure context)
2. **Session Management**: Simple cookie-based (`session-username`)
3. **Form Method**: Login form uses GET method (security concern)
4. **Autocomplete**: Missing autocomplete attributes on password fields
5. **Access Control**: Pages accessible via direct URL without authentication
6. **XSS Protection**: Appears to sanitize inputs (no script execution observed)
7. **SQL Injection**: Failed login attempts suggest proper input handling

### Recommendations for Test Implementation

- Create separate spec files for each category (injection, access-control, session-management)
- Use test fixtures for common setup (logged-in state, cart with items)
- Implement custom Playwright assertions for security checks
- Document all findings in test report, including acceptable risks for demo environment
- Consider network request interception for deeper API testing
- Validate response headers programmatically

---

**Document Version:** 1.0  
**Last Updated:** December 2, 2025  
**Application Under Test:** Sauce Demo (https://www.saucedemo.com)  
**Test Environment:** Demo/Training Application  
**Risk Level:** Low (Demo application - not production)
