import { useState, type FormEvent } from "react";
import { PaymentErrorBanner } from "./PaymentErrorBanner";
import { CardInput } from "./CardInput";
import { PayButton } from "./PayButton";
import { Input } from "./Input";
import { formatExpiry, validateExpiry } from "../utils";

interface PaymentFormProps {
  amount?: string;
  isProcessing?: boolean;
  isRetry?: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
  onSubmit: (data: {
    email: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) => void;
}

export const PaymentForm = ({
  amount = "$29.00",
  isProcessing = false,
  isRetry = false,
  errorMessage = null,
  onClearError,
  onSubmit,
}: PaymentFormProps) => {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  const handleSelectTestCard = (testNumber: string) => {
    setCardNumber(testNumber.replace(/(.{4})/g, "$1 ").trim());
    clearFieldError("cardNumber");
    if (!email) {
      setEmail("alex@example.com");
      clearFieldError("email");
    }
    if (!expiry) {
      setExpiry("12/28");
      clearFieldError("expiry");
    }
    if (!cvv) {
      setCvv("123");
      clearFieldError("cvv");
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    const cleanCard = cardNumber.replace(/\s/g, "");
    if (!cleanCard) {
      errors.cardNumber = "Card number is required";
    } else if (cleanCard.length < 16) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    const expiryError = validateExpiry(expiry);
    if (expiryError) {
      errors.expiry = expiryError;
    }

    if (!cvv.trim()) {
      errors.cvv = "CVV is required";
    } else if (cvv.trim().length < 3) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const isValid = validateForm();
    if (!isValid) return;

    onSubmit({ email: email.trim(), cardNumber, expiry, cvv });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {errorMessage && <PaymentErrorBanner message={errorMessage} />}

      <Input
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        disabled={isProcessing}
        value={email}
        error={fieldErrors.email}
        onChange={(e) => {
          clearFieldError("email");
          setEmail(e.target.value);
        }}
        placeholder="alex@example.com"
      />

      <CardInput
        value={cardNumber}
        error={fieldErrors.cardNumber}
        isProcessing={isProcessing}
        onChange={(val) => {
          clearFieldError("cardNumber");
          setCardNumber(val);
        }}
        onSelectTestCard={handleSelectTestCard}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="expiry"
          label="Expiry (MM/YY)"
          type="text"
          autoComplete="cc-exp"
          disabled={isProcessing}
          value={expiry}
          error={fieldErrors.expiry}
          onChange={(e) => {
            const formatted = formatExpiry(e.target.value);
            setExpiry(formatted);
            if (formatted.length === 5) {
              const err = validateExpiry(formatted);
              if (err) {
                setFieldErrors((prev) => ({ ...prev, expiry: err }));
              } else {
                clearFieldError("expiry");
              }
            } else {
              clearFieldError("expiry");
            }
          }}
          onBlur={() => {
            if (expiry.trim()) {
              const err = validateExpiry(expiry);
              if (err) {
                setFieldErrors((prev) => ({ ...prev, expiry: err }));
              }
            }
          }}
          placeholder="MM / YY"
          maxLength={5}
          inputClassName="font-mono"
        />

        <Input
          id="cvv"
          label="CVV / CVC"
          type="text"
          autoComplete="cc-csc"
          disabled={isProcessing}
          value={cvv}
          error={fieldErrors.cvv}
          onChange={(e) => {
            clearFieldError("cvv");
            setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
          placeholder="123"
          maxLength={4}
          inputClassName="font-mono"
        />
      </div>

      <div className="pt-2">
        <PayButton
          amount={amount}
          isProcessing={isProcessing}
          isRetry={isRetry}
        />
      </div>
    </form>
  );
};
