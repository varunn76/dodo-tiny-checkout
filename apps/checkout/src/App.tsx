import { useEffect, useState, useRef } from "react";
import { Checkout } from "./components/Checkout";
import { sendToParent } from "./utils/messaging";
import { processFakePayment, resetPaymentState } from "./utils/fakePayment";

export type CheckoutStatus =
  | "idle"
  | "processing"
  | "retrying"
  | "error"
  | "success";

export function App() {
  const [productId, setProductId] = useState("pro_plan");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("productId");
    if (id) {
      setProductId(id);
    }
    resetPaymentState();
    sendToParent("checkout:ready");
  }, []);

  const handleClose = () => {
    if (
      status === "processing" ||
      status === "retrying" ||
      status === "success"
    ) {
      return;
    }
    sendToParent("checkout:close", { reason: "user_closed" });
  };

  const handleClearError = () => {
    if (status === "error") {
      setErrorMessage(null);
      setStatus("idle");
    }
  };

  const handlePaymentSubmit = async (formData: {
    email: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) => {
    if (
      isSubmittingRef.current ||
      status === "processing" ||
      status === "retrying" ||
      status === "success"
    ) {
      console.warn(
        "[Checkout] Submission blocked: payment is currently in-flight or completed.",
      );
      return;
    }

    isSubmittingRef.current = true;
    const isRetry = status === "error";
    setStatus(isRetry ? "retrying" : "processing");
    setErrorMessage(null);

    sendToParent("checkout:processing");

    try {
      const result = await processFakePayment(formData);

      if (result.success && result.sessionId) {
        setStatus("success");
        setTimeout(() => {
          sendToParent("checkout:success", { sessionId: result.sessionId });
        }, 1100);
      } else {
        setStatus("error");
        const errorMsg =
          result.error?.message ?? "An error occurred during payment.";
        const errorCode = result.error?.code ?? "PAYMENT_FAILED";

        setErrorMessage(errorMsg);
        sendToParent("checkout:error", {
          code: errorCode,
          message: errorMsg,
        });
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const isProcessing = status === "processing" || status === "retrying";
  const isRetry = status === "error";
  const isSuccess = status === "success";

  return (
    <div
      onClick={handleClose}
      className={`min-h-screen flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn ${
        isProcessing ? "cursor-wait" : "cursor-pointer"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cursor-default w-full sm:max-w-md"
      >
        <Checkout
          productId={productId}
          isProcessing={isProcessing}
          isRetry={isRetry}
          errorMessage={errorMessage}
          isSuccess={isSuccess}
          onClearError={handleClearError}
          onClose={handleClose}
          onSubmit={handlePaymentSubmit}
        />
      </div>
    </div>
  );
}
