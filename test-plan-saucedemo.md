# Saucedemo E-Commerce Application - Comprehensive Test Plan

## Application Overview

Saucedemo (https://www.saucedemo.com/) is a demonstration e-commerce web application designed for testing purposes. The application simulates an online store selling Sauce Labs branded merchandise including apparel, accessories, and gear.

### Key Features

- **User Authentication**: Multiple test user accounts with different behavior profiles
- **Product Catalog**: 6 products with images, descriptions, and prices
- **Shopping Cart**: Add/remove items, view cart contents
- **Product Sorting**: Sort by name (A-Z, Z-A) and price (low-high, high-low)
- **Checkout Flow**: Multi-step checkout with customer information and order confirmation
- **Navigation**: Hamburger menu with app state management options

### Test User Accounts

All users share the same password: `secret_sauce`

1. **standard_user**: Normal user with full functionality
2. **locked_out_user**: User account that is locked and cannot login
3. **problem_user**: User experiencing various application bugs (wrong images, broken sorting)
4. **performance_glitch_user**: User experiencing performance issues
5. **error_user**: User that encounters errors during usage
6. **visual_user**: User that may experience visual/UI differences

### Product Inventory

- Sauce Labs Backpack - $29.99
- Sauce Labs Bike Light - $9.99
- Sauce Labs Bolt T-Shirt - $15.99
- Sauce Labs Fleece Jacket - $49.99
- Sauce Labs Onesie - $7.99
- Test.allTheThings() T-Shirt (Red) - $15.99

---

## Test Scenarios

### 1. Authentication & User Management

**Seed:** `tests/seed.spec.ts`

#### 1.1 Successful Login - Standard User

**Test User:** standard_user

**Steps:**

1. Navigate to https://www.saucedemo.com/
2. Verify login page displays with username and password fields
3. Verify accepted usernames are listed on the page
4. Enter "standard_user" in the username field
5. Enter "secret_sauce" in the password field
6. Click the "Login" button

**Expected Results:**

- User is redirected to /inventory.html
- Products page displays with all 6 products visible
- Shopping cart icon is visible in header
- Hamburger menu icon is visible
- No error messages are displayed

#### 1.2 Login Attempt - Locked Out User

**Test User:** locked_out_user

**Steps:**

1. Navigate to https://www.saucedemo.com/
2. Enter "locked_out_user" in the username field
3. Enter "secret_sauce" in the password field
4. Click the "Login" button

**Expected Results:**

- User remains on login page
- Error message displays: "Epic sadface: Sorry, this user has been locked out."
- Red error icon appears on username and password fields
- Close button (X) is visible on error message
- User cannot access the application

#### 1.3 Clear Error Message

**Test User:** Any user that generates an error

**Steps:**

1. Trigger a login error (e.g., use locked_out_user)
2. Verify error message is displayed
3. Click the X button on the error message

**Expected Results:**

- Error message is dismissed
- Error icons disappear from input fields
- Login form remains accessible

#### 1.4 Login with Empty Credentials

**Steps:**

1. Navigate to https://www.saucedemo.com/
2. Leave username field empty
3. Leave password field empty
4. Click the "Login" button

**Expected Results:**

- Error message displays indicating username is required
- User remains on login page

#### 1.5 Login with Invalid Username

**Steps:**

1. Navigate to https://www.saucedemo.com/
2. Enter "invalid_user" in the username field
3. Enter "secret_sauce" in the password field
4. Click the "Login" button

**Expected Results:**

- Error message displays indicating username/password mismatch
- User remains on login page

#### 1.6 Login with Invalid Password

**Steps:**

1. Navigate to https://www.saucedemo.com/
2. Enter "standard_user" in the username field
3. Enter "wrong_password" in the password field
4. Click the "Login" button

**Expected Results:**

- Error message displays indicating username/password mismatch
- User remains on login page

#### 1.7 Successful Logout

**Prerequisites:** User is logged in

**Steps:**

1. Click the hamburger menu icon
2. Verify menu opens with navigation options
3. Click "Logout" link

**Expected Results:**

- User is redirected to login page (/)
- Session is cleared
- User must login again to access inventory

---

### 2. Product Browsing & Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1 View Product Inventory

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Verify products page loads

**Expected Results:**

- Page title shows "Products"
- All 6 products are displayed in grid layout
- Each product shows:
    - Product image
    - Product name (clickable)
    - Product description
    - Price
    - "Add to cart" button
- Products initially sorted by "Name (A to Z)"
- Sort dropdown is visible with 4 options

#### 2.2 View Product Details

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click on any product name or image

**Expected Results:**

- User is redirected to product detail page (/inventory-item.html?id=X)
- Product detail page displays:
    - Larger product image
    - Product name
    - Product description
    - Price
    - "Add to cart" or "Remove" button (based on cart state)
    - "Back to products" button
- Shopping cart badge reflects accurate count
- Hamburger menu remains accessible

#### 2.3 Return to Product List from Detail Page

**Prerequisites:** User is on a product detail page

**Steps:**

1. Click "Back to products" button

**Expected Results:**

- User returns to /inventory.html
- Product list displays in same sorted order as before
- Shopping cart state is maintained

#### 2.4 Product Sorting - Name A to Z

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Verify default sorting is "Name (A to Z)"
3. Observe product order

**Expected Results:**

- Products displayed in alphabetical order:
    1. Sauce Labs Backpack
    2. Sauce Labs Bike Light
    3. Sauce Labs Bolt T-Shirt
    4. Sauce Labs Fleece Jacket
    5. Sauce Labs Onesie
    6. Test.allTheThings() T-Shirt (Red)

#### 2.5 Product Sorting - Name Z to A

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click sort dropdown
3. Select "Name (Z to A)"

**Expected Results:**

- Sort dropdown shows "Name (Z to A)"
- Products reorder in reverse alphabetical order:
    1. Test.allTheThings() T-Shirt (Red)
    2. Sauce Labs Onesie
    3. Sauce Labs Fleece Jacket
    4. Sauce Labs Bolt T-Shirt
    5. Sauce Labs Bike Light
    6. Sauce Labs Backpack

#### 2.6 Product Sorting - Price Low to High

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click sort dropdown
3. Select "Price (low to high)"

**Expected Results:**

- Sort dropdown shows "Price (low to high)"
- Products reorder by ascending price:
    1. Sauce Labs Onesie ($7.99)
    2. Sauce Labs Bike Light ($9.99)
    3. Sauce Labs Bolt T-Shirt ($15.99)
    4. Test.allTheThings() T-Shirt (Red) ($15.99)
    5. Sauce Labs Backpack ($29.99)
    6. Sauce Labs Fleece Jacket ($49.99)

#### 2.7 Product Sorting - Price High to Low

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click sort dropdown
3. Select "Price (high to low)"

**Expected Results:**

- Sort dropdown shows "Price (high to low)"
- Products reorder by descending price:
    1. Sauce Labs Fleece Jacket ($49.99)
    2. Sauce Labs Backpack ($29.99)
    3. Sauce Labs Bolt T-Shirt ($15.99)
    4. Test.allTheThings() T-Shirt (Red) ($15.99)
    5. Sauce Labs Bike Light ($9.99)
    6. Sauce Labs Onesie ($7.99)

#### 2.8 Sorting Persistence

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Change sort to "Price (low to high)"
3. Click on a product to view details
4. Click "Back to products"

**Expected Results:**

- Product list maintains "Price (low to high)" sorting
- Selected sort option remains in dropdown

---

### 3. Shopping Cart Management

**Seed:** `tests/seed.spec.ts`

#### 3.1 Add Single Item to Cart from Inventory

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Note the shopping cart badge (should be empty/not visible)
3. Click "Add to cart" button for "Sauce Labs Backpack"

**Expected Results:**

- Button text changes from "Add to cart" to "Remove"
- Shopping cart badge appears showing "1"
- Cart badge is visible in header
- Other products remain unchanged

#### 3.2 Add Multiple Items to Cart

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click "Add to cart" for "Sauce Labs Backpack"
3. Click "Add to cart" for "Sauce Labs Bike Light"
4. Click "Add to cart" for "Sauce Labs Onesie"

**Expected Results:**

- Each clicked button changes to "Remove"
- Shopping cart badge increments with each addition: 1, 2, 3
- All three items show "Remove" button
- Cart badge accurately shows "3"

#### 3.3 Remove Item from Cart on Inventory Page

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart
3. Verify cart badge shows "1"
4. Click "Remove" button for "Sauce Labs Backpack"

**Expected Results:**

- Button text changes from "Remove" to "Add to cart"
- Shopping cart badge decrements to "0" or becomes hidden
- Item is removed from cart

#### 3.4 Add Item from Product Detail Page

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click on "Sauce Labs Backpack" product name
3. On detail page, click "Add to cart" button

**Expected Results:**

- Button changes to "Remove"
- Shopping cart badge shows "1"
- User can return to inventory and see "Remove" button for that product

#### 3.5 Remove Item from Product Detail Page

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart from inventory
3. Click on "Sauce Labs Backpack" product name
4. On detail page, click "Remove" button

**Expected Results:**

- Button changes to "Add to cart"
- Shopping cart badge decrements or disappears
- User can return to inventory and see "Add to cart" button for that product

#### 3.6 View Shopping Cart

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add 2-3 items to cart
3. Click shopping cart icon in header

**Expected Results:**

- User is redirected to /cart.html
- Page title shows "Your Cart"
- Cart displays:
    - Table headers: QTY, Description
    - Each cart item showing:
        - Quantity (always "1" per unique item)
        - Product name (clickable)
        - Product description
        - Price
        - "Remove" button
- "Continue Shopping" button is visible
- "Checkout" button is visible
- Cart badge remains visible with accurate count

#### 3.7 Empty Cart State

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Navigate to cart without adding any items
3. Click shopping cart icon

**Expected Results:**

- Cart page displays (/cart.html)
- No products shown in cart
- "Continue Shopping" button is visible
- "Checkout" button is visible
- Cart badge is not visible or shows "0"

#### 3.8 Remove Item from Cart Page

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add "Sauce Labs Backpack" and "Sauce Labs Bike Light" to cart
3. Navigate to cart page
4. Click "Remove" button for "Sauce Labs Backpack"

**Expected Results:**

- "Sauce Labs Backpack" is removed from cart
- "Sauce Labs Bike Light" remains in cart
- Cart badge updates from "2" to "1"
- Cart page updates immediately without page refresh

#### 3.9 Continue Shopping from Cart

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add items to cart
3. Navigate to cart page
4. Click "Continue Shopping" button

**Expected Results:**

- User returns to /inventory.html
- Cart state is preserved
- Products that were added show "Remove" button
- Cart badge shows accurate count

#### 3.10 Navigate to Cart via Product Link

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart
3. Navigate to cart
4. Click on "Sauce Labs Backpack" product name link

**Expected Results:**

- User is redirected to product detail page
- Product details display correctly
- Cart state is maintained
- "Remove" button is shown (since item is in cart)

---

### 4. Checkout Process

**Seed:** `tests/seed.spec.ts`

#### 4.1 Complete Checkout Flow - Single Item

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add "Sauce Labs Backpack" to cart
3. Click shopping cart icon
4. Click "Checkout" button
5. On checkout information page (/checkout-step-one.html):
    - Enter "John" in First Name field
    - Enter "Doe" in Last Name field
    - Enter "12345" in Zip/Postal Code field
6. Click "Continue" button
7. On checkout overview page (/checkout-step-two.html):
    - Review order details
8. Click "Finish" button

**Expected Results:**

- Checkout information page displays with three required fields
- After clicking Continue, overview page displays showing:
    - Order items with quantity and pricing
    - Payment Information: "SauceCard #31337"
    - Shipping Information: "Free Pony Express Delivery!"
    - Item total: $29.99
    - Tax: $2.40
    - Total: $32.39
- After clicking Finish, success page displays (/checkout-complete.html):
    - Success message: "Thank you for your order!"
    - Pony Express image
    - "Back Home" button
- Shopping cart badge is cleared/hidden
- Cart is now empty

#### 4.2 Complete Checkout Flow - Multiple Items

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add multiple items to cart:
    - Sauce Labs Backpack ($29.99)
    - Sauce Labs Bike Light ($9.99)
    - Sauce Labs Onesie ($7.99)
3. Click shopping cart icon
4. Verify all 3 items are in cart
5. Click "Checkout" button
6. Enter checkout information:
    - First Name: "Jane"
    - Last Name: "Smith"
    - Zip: "90210"
7. Click "Continue"
8. Review order totals on overview page
9. Click "Finish"

**Expected Results:**

- Checkout overview shows all 3 items
- Item total: $47.97
- Tax calculated correctly
- Total displayed correctly
- Order completes successfully
- Cart is cleared after completion

#### 4.3 Checkout Validation - Empty First Name

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed to checkout
3. Leave First Name field empty
4. Enter "Doe" in Last Name
5. Enter "12345" in Zip Code
6. Click "Continue"

**Expected Results:**

- Error message displays: "Error: First Name is required"
- User remains on checkout-step-one.html
- Form data is preserved (Last Name and Zip still populated)

#### 4.4 Checkout Validation - Empty Last Name

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed to checkout
3. Enter "John" in First Name
4. Leave Last Name field empty
5. Enter "12345" in Zip Code
6. Click "Continue"

**Expected Results:**

- Error message displays: "Error: Last Name is required"
- User remains on checkout-step-one.html
- Form data is preserved

#### 4.5 Checkout Validation - Empty Postal Code

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed to checkout
3. Enter "John" in First Name
4. Enter "Doe" in Last Name
5. Leave Zip/Postal Code field empty
6. Click "Continue"

**Expected Results:**

- Error message displays: "Error: Postal Code is required"
- User remains on checkout-step-one.html
- Form data is preserved

#### 4.6 Checkout Validation - All Fields Empty

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed to checkout
3. Leave all fields empty
4. Click "Continue"

**Expected Results:**

- Error message displays indicating first required field missing
- User cannot proceed to overview page
- User remains on checkout-step-one.html

#### 4.7 Cancel Checkout - Step One

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed to checkout
3. On checkout information page, click "Cancel" button

**Expected Results:**

- User returns to /cart.html
- Cart items are preserved
- Cart badge shows accurate count
- User can resume checkout

#### 4.8 Cancel Checkout - Step Two

**Test User:** standard_user

**Steps:**

1. Login and add item to cart
2. Proceed through checkout information
3. On checkout overview page, click "Cancel" button

**Expected Results:**

- User returns to /inventory.html
- Cart items are preserved
- Cart badge shows accurate count
- User can access cart and resume checkout

#### 4.9 Return Home After Successful Order

**Test User:** standard_user

**Steps:**

1. Complete full checkout flow
2. On order confirmation page, click "Back Home" button

**Expected Results:**

- User returns to /inventory.html
- Cart is empty
- Cart badge is not visible
- All products show "Add to cart" buttons
- User can start new shopping session

#### 4.10 Checkout with Empty Cart

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Navigate directly to /checkout-step-one.html (via URL)

**Expected Results:**

- Application should either:
    - Redirect to cart or inventory page, OR
    - Display error message, OR
    - Allow proceeding but show $0.00 totals on overview
- Document actual behavior for validation

---

### 5. Navigation & Menu

**Seed:** `tests/seed.spec.ts`

#### 5.1 Open Hamburger Menu

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Click hamburger menu icon (three horizontal lines)

**Expected Results:**

- Side menu slides open from left
- Menu displays navigation links:
    - All Items
    - About
    - Logout
    - Reset App State
- Close button (X) is visible
- Background is dimmed/overlayed
- Menu "All Items" is highlighted as active

#### 5.2 Close Hamburger Menu

**Prerequisites:** Menu is open

**Steps:**

1. Click the X (close) button in menu

**Expected Results:**

- Menu slides closed
- User returns to previous page state
- Background overlay is removed
- Content remains as before menu was opened

#### 5.3 Navigate via All Items Link

**Prerequisites:** User is on any page (cart, product detail, etc.)

**Steps:**

1. Open hamburger menu
2. Click "All Items" link

**Expected Results:**

- User is redirected to /inventory.html
- Menu closes automatically
- Product list displays
- Cart state is maintained

#### 5.4 Navigate via About Link

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Open hamburger menu
3. Click "About" link

**Expected Results:**

- User is redirected to https://saucelabs.com/ (external site)
- Session state should be maintained
- User can navigate back to return to Saucedemo
- Cart state may or may not be preserved (document behavior)

#### 5.5 Reset App State

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add multiple items to cart
3. Change product sorting
4. Open hamburger menu
5. Click "Reset App State"
6. Close menu

**Expected Results:**

- Cart is cleared (badge disappears)
- All "Remove" buttons revert to "Add to cart"
- Sorting may reset to default
- User remains logged in
- User remains on current page

#### 5.6 Social Media Links - Twitter

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Scroll to footer
3. Click Twitter icon link

**Expected Results:**

- New tab/window opens to https://twitter.com/saucelabs
- Original tab remains on Saucedemo
- Session is maintained

#### 5.7 Social Media Links - Facebook

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Scroll to footer
3. Click Facebook icon link

**Expected Results:**

- New tab/window opens to https://www.facebook.com/saucelabs
- Original tab remains on Saucedemo
- Session is maintained

#### 5.8 Social Media Links - LinkedIn

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Scroll to footer
3. Click LinkedIn icon link

**Expected Results:**

- New tab/window opens to https://www.linkedin.com/company/sauce-labs/
- Original tab remains on Saucedemo
- Session is maintained

---

### 6. Problem User Scenarios

**Seed:** `tests/seed.spec.ts`

#### 6.1 Problem User - Wrong Product Images

**Test User:** problem_user

**Steps:**

1. Login as problem_user
2. Observe product images on inventory page

**Expected Results (Defects):**

- All product images display the same incorrect image (dog image)
- Product names and descriptions are correct
- This is a known visual defect for this test user
- Document that images do not match their respective products

#### 6.2 Problem User - Broken Sorting

**Test User:** problem_user

**Steps:**

1. Login as problem_user
2. Change sort dropdown to "Name (Z to A)"
3. Observe product order
4. Change sort to "Price (low to high)"
5. Observe product order

**Expected Results (Defects):**

- Sort dropdown selection may not change display text
- Products may not reorder despite selecting different sort options
- Product order may remain in default "Name (A to Z)" despite selection
- This is a known defect for this test user
- Document that sorting functionality is broken

#### 6.3 Problem User - Add to Cart Functionality

**Test User:** problem_user

**Steps:**

1. Login as problem_user
2. Add "Sauce Labs Backpack" to cart
3. Verify cart badge updates
4. Navigate to cart
5. Verify item appears in cart

**Expected Results:**

- Despite image and sorting issues, cart functionality should work
- Items can be added to cart
- Cart badge updates correctly
- Cart page displays items correctly
- Document any cart-related defects if encountered

#### 6.4 Problem User - Checkout Flow

**Test User:** problem_user

**Steps:**

1. Login as problem_user
2. Add item to cart
3. Complete full checkout process
4. Observe any issues during checkout

**Expected Results:**

- Checkout may proceed normally despite inventory page issues
- Watch for any errors in checkout steps
- Form validation should work
- Document any checkout-specific defects
- Order completion may succeed or fail (document actual behavior)

---

### 7. Performance Glitch User Scenarios

**Seed:** `tests/seed.spec.ts`

#### 7.1 Performance User - Login Delay

**Test User:** performance_glitch_user

**Steps:**

1. Navigate to login page
2. Enter "performance_glitch_user" as username
3. Enter "secret_sauce" as password
4. Click "Login" button
5. Measure time to load inventory page

**Expected Results (Performance Issues):**

- Login process takes noticeably longer than standard_user
- Page may appear to hang or freeze temporarily
- Eventually redirects to inventory page
- Document actual load time
- Verify functionality once loaded

#### 7.2 Performance User - Page Load Times

**Test User:** performance_glitch_user

**Steps:**

1. Login as performance_glitch_user
2. Navigate to various pages:
    - Product detail page
    - Cart page
    - Checkout pages
3. Measure load times for each navigation

**Expected Results (Performance Issues):**

- All page transitions take longer than normal
- Pages may appear unresponsive temporarily
- Document specific delays encountered
- Verify functionality is correct once pages load

#### 7.3 Performance User - Add to Cart Delay

**Test User:** performance_glitch_user

**Steps:**

1. Login as performance_glitch_user
2. Click "Add to cart" for any product
3. Observe response time

**Expected Results (Performance Issues):**

- Button state change may be delayed
- Cart badge update may lag
- Document delay duration
- Verify cart is eventually updated correctly

---

### 8. Error User Scenarios

**Seed:** `tests/seed.spec.ts`

#### 8.1 Error User - Login and Initial Load

**Test User:** error_user

**Steps:**

1. Navigate to login page
2. Enter "error_user" as username
3. Enter "secret_sauce" as password
4. Click "Login" button

**Expected Results (Errors):**

- May encounter login errors or delays
- Check browser console for JavaScript errors
- Document any error messages displayed
- If login succeeds, proceed to inventory
- Document actual behavior

#### 8.2 Error User - Product Interactions

**Test User:** error_user

**Steps:**

1. Login as error_user (if possible)
2. Attempt to add products to cart
3. Try sorting products
4. Navigate to product details
5. Monitor for errors at each step

**Expected Results (Errors):**

- Various functionality may fail
- JavaScript errors may appear in console
- UI elements may not respond
- Document specific failures encountered
- Note which features work vs which fail

#### 8.3 Error User - Checkout Process

**Test User:** error_user

**Steps:**

1. Login as error_user (if possible)
2. Attempt to add items to cart
3. Try to proceed through checkout
4. Document all errors encountered

**Expected Results (Errors):**

- Checkout process may fail at various stages
- Error messages may appear
- Form submissions may fail
- Document specific checkout errors
- Note if order can be completed or not

---

### 9. Visual User Scenarios

**Seed:** `tests/seed.spec.ts`

#### 9.1 Visual User - UI Differences on Inventory

**Test User:** visual_user

**Steps:**

1. Login as visual_user
2. Compare inventory page to standard_user view
3. Check for:
    - Layout differences
    - Color variations
    - Font changes
    - Image display issues
    - Spacing/alignment problems

**Expected Results (Visual Differences):**

- Document any visual discrepancies
- Compare screenshots between standard_user and visual_user
- Note CSS rendering differences
- Functionality should still work despite visual changes

#### 9.2 Visual User - Complete User Journey

**Test User:** visual_user

**Steps:**

1. Login as visual_user
2. Browse products
3. Add items to cart
4. Complete checkout
5. Compare visual presentation at each step to standard_user

**Expected Results (Visual Differences):**

- Document visual issues throughout entire flow
- Verify functionality remains intact
- Take screenshots for comparison
- Note any pages with significant visual bugs

---

### 10. Direct URL Access & Security

**Seed:** `tests/seed.spec.ts`

#### 10.1 Direct Access to Inventory Without Login

**Steps:**

1. Open new browser/incognito window
2. Navigate directly to https://www.saucedemo.com/inventory.html

**Expected Results:**

- User should be redirected to login page, OR
- Page should display login prompt, OR
- Access should be denied
- Document actual behavior

#### 10.2 Direct Access to Cart Without Login

**Steps:**

1. Open new browser/incognito window
2. Navigate directly to https://www.saucedemo.com/cart.html

**Expected Results:**

- User should be redirected to login page
- Document actual behavior

#### 10.3 Direct Access to Checkout Without Login

**Steps:**

1. Open new browser/incognito window
2. Navigate directly to https://www.saucedemo.com/checkout-step-one.html

**Expected Results:**

- User should be redirected to login page
- Document actual behavior

#### 10.4 Session Persistence After Logout

**Test User:** standard_user

**Steps:**

1. Login as standard_user
2. Add items to cart
3. Logout
4. Use browser back button

**Expected Results:**

- User should not be able to access protected pages
- Session should be invalidated
- User should be required to login again
- Cart should be cleared

#### 10.5 Multiple Browser Sessions

**Test User:** standard_user

**Steps:**

1. Login as standard_user in Browser 1
2. Add items to cart in Browser 1
3. Login as standard_user in Browser 2
4. Check if cart state is shared or independent

**Expected Results:**

- Document whether cart state is shared across sessions
- Verify if sessions conflict or operate independently
- Test if logout in one browser affects the other

---

### 11. Cross-Browser Compatibility

**Seed:** `tests/seed.spec.ts`

#### 11.1 Chrome - Full User Flow

**Test User:** standard_user
**Browser:** Google Chrome (latest version)

**Steps:**

1. Complete full user journey from login to checkout
2. Test all major features
3. Verify UI rendering
4. Check console for errors

**Expected Results:**

- All functionality works as expected
- UI renders correctly
- No console errors
- Performance is acceptable

#### 11.2 Firefox - Full User Flow

**Test User:** standard_user
**Browser:** Mozilla Firefox (latest version)

**Steps:**

1. Repeat full test suite in Firefox
2. Compare behavior to Chrome
3. Note any browser-specific issues

**Expected Results:**

- Consistent behavior across browsers
- UI renders similarly
- Document any Firefox-specific issues

#### 11.3 Safari - Full User Flow

**Test User:** standard_user
**Browser:** Safari (latest version)

**Steps:**

1. Repeat full test suite in Safari
2. Compare behavior to Chrome
3. Note any browser-specific issues

**Expected Results:**

- Consistent behavior across browsers
- Note any Safari-specific rendering or functionality issues

#### 11.4 Edge - Full User Flow

**Test User:** standard_user
**Browser:** Microsoft Edge (latest version)

**Steps:**

1. Repeat full test suite in Edge
2. Compare behavior to Chrome
3. Note any browser-specific issues

**Expected Results:**

- Consistent behavior across browsers
- Document any Edge-specific issues

---

### 12. Mobile Responsiveness

**Seed:** `tests/seed.spec.ts`

#### 12.1 Mobile View - Portrait Mode

**Test User:** standard_user
**Device:** Mobile viewport (375x667 - iPhone SE)

**Steps:**

1. Resize browser to mobile dimensions or use device emulator
2. Login as standard_user
3. Navigate through app
4. Test all major features

**Expected Results:**

- Layout adapts to mobile screen size
- All buttons and links are clickable
- Text is readable without horizontal scrolling
- Images scale appropriately
- Shopping cart remains accessible
- Menu functions correctly

#### 12.2 Mobile View - Landscape Mode

**Test User:** standard_user
**Device:** Mobile viewport (667x375 - iPhone SE landscape)

**Steps:**

1. Rotate device to landscape or change viewport
2. Test navigation and functionality

**Expected Results:**

- Layout adapts to landscape orientation
- Functionality remains intact
- UI elements remain accessible

#### 12.3 Tablet View

**Test User:** standard_user
**Device:** Tablet viewport (768x1024 - iPad)

**Steps:**

1. Resize to tablet dimensions
2. Complete full user journey
3. Verify responsive behavior

**Expected Results:**

- Layout optimizes for tablet screen size
- All features work correctly
- UI is appropriately sized for touch interaction

---

## Test Execution Notes

### Prerequisites

- Test environment: https://www.saucedemo.com/
- Valid user credentials available
- Browser with JavaScript enabled
- Network connectivity

### Test Data

- Password for all users: `secret_sauce`
- Sample checkout information:
    - First Name: John, Jane, Test
    - Last Name: Doe, Smith, User
    - Zip Code: 12345, 90210, 10001

### Known Issues by User Type

1. **locked_out_user**: Cannot login - expected behavior
2. **problem_user**: Wrong images, broken sorting - expected defects
3. **performance_glitch_user**: Slow page loads - expected performance issues
4. **error_user**: Various errors - expected failures
5. **visual_user**: Visual inconsistencies - expected UI differences

### Test Environment Requirements

- Supported browsers: Chrome, Firefox, Safari, Edge (latest versions)
- Screen resolutions: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Test execution can be automated using Playwright, Selenium, or similar frameworks

### Reporting

- Document actual vs expected behavior for each scenario
- Capture screenshots for visual defects
- Record video for complex user flows
- Log console errors and network failures
- Report severity: Critical, High, Medium, Low
- Include browser and environment details in bug reports

---

## Test Coverage Summary

This test plan provides comprehensive coverage across:

- ✅ Authentication (7 scenarios)
- ✅ Product browsing and navigation (8 scenarios)
- ✅ Shopping cart management (10 scenarios)
- ✅ Checkout process (10 scenarios)
- ✅ Navigation and menu (8 scenarios)
- ✅ Problem user edge cases (4 scenarios)
- ✅ Performance testing (3 scenarios)
- ✅ Error handling (3 scenarios)
- ✅ Visual testing (2 scenarios)
- ✅ Security and access control (5 scenarios)
- ✅ Cross-browser compatibility (4 scenarios)
- ✅ Mobile responsiveness (3 scenarios)

**Total Scenarios: 67+**

### Priority Recommendations

**P0 (Critical):**

- Authentication and login
- Add to cart functionality
- Complete checkout flow
- Session management

**P1 (High):**

- Product browsing and sorting
- Cart management
- Form validation
- Navigation

**P2 (Medium):**

- Social media links
- Reset app state
- Direct URL access
- Browser compatibility

**P3 (Low):**

- Visual testing
- Performance benchmarks
- Mobile landscape orientation
