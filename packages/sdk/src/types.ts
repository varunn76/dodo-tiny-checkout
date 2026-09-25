export interface DodoCheckoutOptions {
  productId: string;
  checkoutUrl?: string;
  onSuccess?: (data: { sessionId: string }) => void;
  onClose?: (data: { reason: string }) => void;
  onError?: (data: { code: string; message: string }) => void;
}

export interface DodoCheckoutAPI {
  open(options: DodoCheckoutOptions): void;
  close(reason?: string): void;
  isOpen(): boolean;
}

export type CheckoutMessageType =
  | "checkout:ready"
  | "checkout:processing"
  | "checkout:close"
  | "checkout:success"
  | "checkout:error";

export interface CheckoutSuccessPayload {
  sessionId: string;
}

export interface CheckoutErrorPayload {
  code: string;
  message: string;
}

export interface CheckoutClosePayload {
  reason: string;
}

export interface DodoCheckoutMessage {
  source: "dodo-checkout";
  type: CheckoutMessageType;
  payload?:
    | CheckoutSuccessPayload
    | CheckoutErrorPayload
    | CheckoutClosePayload;
}

declare global {
  interface Window {
    DodoCheckout: DodoCheckoutAPI;
  }
}
