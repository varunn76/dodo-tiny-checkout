export type CheckoutMessageType =
  | "checkout:ready"
  | "checkout:processing"
  | "checkout:close"
  | "checkout:success"
  | "checkout:error";

export interface DodoCheckoutMessage {
  source: "dodo-checkout";
  type: CheckoutMessageType;
  payload?: unknown;
}

export function sendToParent(
  type: CheckoutMessageType,
  payload?: unknown,
): void {
  if (typeof window === "undefined" || window.parent === window) {
    return;
  }

  const message: DodoCheckoutMessage = {
    source: "dodo-checkout",
    type,
    payload,
  };

  window.parent.postMessage(message, "*");
}
