interface DodoCheckoutOptions {
  productId: string;
  checkoutUrl?: string;

  onSuccess?: (data: {
    sessionId: string;
  }) => void;

  onClose?: (data: {
    reason: string;
  }) => void;

  onError?: (data: {
    code: string;
    message: string;
  }) => void;
}

interface DodoCheckoutAPI {
  open(options: DodoCheckoutOptions): void;
  close(): void;
  isOpen(): boolean;
}

interface Window {
  DodoCheckout: DodoCheckoutAPI;
}
