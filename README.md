# Tiny Embeddable Checkout

A small embeddable checkout built with **React, TypeScript, Vite, and Tailwind CSS**.

The merchant only needs to add a single `<script>` to their website. The checkout UI runs inside an iframe, so card details stay inside the checkout app and are not exposed to the merchant page.

## Run Locally

```bash
# Install dependencies
npm install

# Build the SDK
npm run build:sdk

# Start checkout app
npm run dev:checkout

# Start demo store in another terminal
npm run dev:demo
```

Open:

- Demo Store: http://localhost:3000
- Checkout App: http://localhost:3001
- SDK: http://localhost:3001/dodo-checkout.js

## How It Works

```text
Demo Store
    |
    | DodoCheckout.open()
    v
SDK Script
    |
    | Creates iframe
    v
Checkout App
    |
    | postMessage
    v
SDK
    |
    | onSuccess / onError / onClose
    v
Demo Store
```

### 1. Load the SDK

The merchant loads the SDK using a normal script:

```html
<script src="http://localhost:3001/dodo-checkout.js"></script>
```

### 2. Open Checkout

The merchant can then call:

```ts
DodoCheckout.open({
  productId: "pro_plan",

  onSuccess: ({ sessionId }) => {
    console.log("Payment successful:", sessionId);
  },

  onClose: ({ reason }) => {
    console.log("Checkout closed:", reason);
  },

  onError: ({ code, message }) => {
    console.log("Payment failed:", code, message);
  },
});
```

### 3. Checkout Runs in an Iframe

The SDK creates an iframe pointing to the hosted checkout application.

```text
Merchant Page
     |
     +-- SDK
          |
          +-- iframe
                |
                +-- Checkout App
```

The checkout app handles the card form and fake payment flow.

### 4. Communication

The SDK and checkout app communicate using `window.postMessage()`.

The checkout can send events such as:

```json
{
  "source": "dodo-checkout",
  "type": "checkout:success",
  "data": {
    "sessionId": "session_123"
  }
}
```

Supported events include:

- `checkout:ready`
- `checkout:processing`
- `checkout:success`
- `checkout:error`
- `checkout:close`

The SDK converts these events into the merchant callbacks:

```text
checkout:success → onSuccess()
checkout:error   → onError()
checkout:close   → onClose()
```

## Security Boundary

The card form lives inside the checkout iframe.

The merchant page only receives checkout lifecycle information such as:

- Session ID
- Success/failure status
- Error information
- Close reason

Raw card details are not sent to the merchant page.

The SDK also validates the message origin before handling messages from the iframe.

## Test Cards

| Card                  | Expiry      | CVV          | Result                    |
| --------------------- | ----------- | ------------ | ------------------------- |
| `4242 4242 4242 4242` | Future date | Any 3 digits | Success                   |
| `4000 0000 0000 0002` | Future date | Any 3 digits | Declined                  |
| `4000 0000 0000 0341` | Future date | Any 3 digits | Fails once, then succeeds |

Example:

```text
Expiry: 12/28
CVV: 123
```

## Project Structure

```text
dodo-checkout-assignment/
│
├── apps/
│   ├── demo/             # Demo merchant website
│   └── checkout/         # Hosted checkout application
│
├── packages/
│   └── sdk/              # Plain TypeScript SDK source
│
├── PHASES.md             # Development progress
├── README.md
└── package.json
```

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- iframe
- `window.postMessage`
- Plain TypeScript SDK

## Design Decisions

### 1. Fullscreen iframe

The SDK uses a fullscreen iframe instead of placing the checkout UI directly inside the merchant DOM.

This keeps the checkout UI isolated and allows the checkout application to control its own responsive layout and interaction states.

## What I'd Explore Next

- Checkout session expiry and recovery
- Merchant theming and dark mode
- Better handling of slow, failed, or interrupted network requests
