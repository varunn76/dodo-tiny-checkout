import { SpinnerIcon } from "./icons";

interface PayButtonProps {
  amount?: string;
  isProcessing?: boolean;
  isRetry?: boolean;
}

export const PayButton = ({
  amount = "$29.00",
  isProcessing = false,
  isRetry = false,
}: PayButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isProcessing}
      className="w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isProcessing ? (
        <>
          <SpinnerIcon className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-white" />
          Processing payment...
        </>
      ) : isRetry ? (
        `Retry Payment (${amount})`
      ) : (
        `Pay ${amount}`
      )}
    </button>
  );
};
