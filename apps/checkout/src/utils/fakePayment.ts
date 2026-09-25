export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  error?: {
    code: string;
    message: string;
  };
}

let failOnceAttempts = 0;

export function resetPaymentState(): void {
  failOnceAttempts = 0;
}

export async function processFakePayment(card: {
  cardNumber: string;
  expiry: string;
  cvv: string;
  email: string;
}): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const cleanNumber = card.cardNumber.replace(/[\s-]/g, "");

  if (cleanNumber.endsWith("0002") || cleanNumber === "4000000000000002") {
    return {
      success: false,
      error: {
        code: "CARD_DECLINED",
        message: "Your card was declined. Please try another card.",
      },
    };
  }

  if (
    cleanNumber.endsWith("0341") ||
    cleanNumber.endsWith("0003") ||
    cleanNumber === "4000000000000341" ||
    cleanNumber === "4000000000000003"
  ) {
    if (failOnceAttempts === 0) {
      failOnceAttempts += 1;
      return {
        success: false,
        error: {
          code: "CARD_AUTH_FAILED",
          message:
            "Temporary authorization failure. Please retry your payment.",
        },
      };
    } else {
      const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        success: true,
        sessionId,
      };
    }
  }

  const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    success: true,
    sessionId,
  };
}
