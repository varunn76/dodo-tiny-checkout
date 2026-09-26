import { useEffect, useRef } from "react";
import { ProductSummary } from "./ProductSummary";
import { PaymentForm } from "./PaymentForm";
import { CloseIcon, CheckIcon, LockIcon } from "./icons";

interface CheckoutProps {
  productId?: string;
  isProcessing?: boolean;
  isRetry?: boolean;
  errorMessage?: string | null;
  isSuccess?: boolean;
  onClearError?: () => void;
  onClose?: () => void;
  onSubmit: (data: {
    email: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) => void;
}

export const Checkout = ({
  productId = "pro_plan",
  isProcessing = false,
  isRetry = false,
  errorMessage = null,
  isSuccess = false,
  onClearError,
  onClose,
  onSubmit,
}: CheckoutProps) => {
  const isProPlan = productId === "pro_plan";
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'input:not([disabled]), button:not([disabled]), [tabindex="0"]',
    );
    if (focusableElements.length > 0 && !isSuccess) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const elements = modal.querySelectorAll<HTMLElement>(
          'input:not([disabled]), button:not([disabled]), [tabindex="0"]',
        );
        if (elements.length === 0) return;

        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    modal.addEventListener("keydown", handleKeyDown);
    return () => modal.removeEventListener("keydown", handleKeyDown);
  }, [isSuccess]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      aria-describedby="checkout-desc"
      className="w-full sm:max-w-md max-h-[95vh] flex flex-col bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-scaleUp transition-all"
    >
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h2
            id="checkout-title"
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900"
          >
            {isSuccess ? "Payment Successful" : "Checkout"}
          </h2>
          <p id="checkout-desc" className="text-xs text-slate-500 mt-0.5">
            {isSuccess
              ? "Your subscription is now active"
              : "Complete your subscription securely"}
          </p>
        </div>

        {onClose && !isSuccess && (
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            aria-label="Close checkout"
            className="text-slate-400 hover:text-slate-700 rounded-lg p-1.5 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-successBounce shadow-sm">
              <CheckIcon className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Payment Confirmed!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for your purchase. Your order was processed securely.
                Returning to store...
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center space-x-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Redirecting...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <ProductSummary
              title={isProPlan ? "Pro Plan" : "Selected Plan"}
              description="Billed monthly. Cancel anytime."
              amount="$29.00"
              interval="month"
            />

            <PaymentForm
              amount="$29.00"
              isProcessing={isProcessing}
              isRetry={isRetry}
              errorMessage={errorMessage}
              onClearError={onClearError}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500 flex-shrink-0">
        <LockIcon className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
        <span className="truncate">
          Guaranteed safe & secure 256-bit SSL checkout
        </span>
      </div>
    </div>
  );
};
