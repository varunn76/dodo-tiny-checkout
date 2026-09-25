import { AlertCircleIcon } from "./icons";

interface PaymentErrorBannerProps {
  message: string;
}

export const PaymentErrorBanner = ({ message }: PaymentErrorBannerProps) => {
  return (
    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-start text-xs text-rose-800">
      <AlertCircleIcon className="w-4 h-4 text-rose-500 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold">Payment failed: </span>
        {message}
      </div>
    </div>
  );
};
