import { CardIcon } from "./icons";
import { Input } from "./Input";

interface CardInputProps {
  value: string;
  error?: string;
  isProcessing?: boolean;
  onChange: (value: string) => void;
  onSelectTestCard: (testNumber: string) => void;
}

export const CardInput = ({
  value,
  error,
  isProcessing = false,
  onChange,
  onSelectTestCard,
}: CardInputProps) => {
  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const groups = raw.match(/.{1,4}/g);
    return groups ? groups.join(" ") : raw;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatCardNumber(e.target.value));
  };

  const getBrandBadge = () => {
    const clean = value.replace(/\D/g, "");
    if (clean.startsWith("4")) {
      return (
        <span className="text-[10px] font-extrabold tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          VISA
        </span>
      );
    }
    if (clean.startsWith("5")) {
      return (
        <span className="text-[10px] font-extrabold tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          MC
        </span>
      );
    }
    return <CardIcon className="w-5 h-5 text-slate-400" />;
  };

  const headerTestButtons = (
    <div className="flex items-center space-x-1.5">
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onSelectTestCard("4242424242424242")}
        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono transition-colors disabled:opacity-50 cursor-pointer"
        title="Test Card: Always Succeeds"
      >
        4242 (✓)
      </button>
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onSelectTestCard("4000000000000002")}
        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono transition-colors disabled:opacity-50 cursor-pointer"
        title="Test Card: Always Declined"
      >
        0002 (✕)
      </button>
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onSelectTestCard("4000000000000341")}
        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono transition-colors disabled:opacity-50 cursor-pointer"
        title="Test Card: Fails once then succeeds on retry"
      >
        0341 (↻)
      </button>
    </div>
  );

  return (
    <Input
      id="cardNumber"
      label="Card Number"
      value={value}
      error={error}
      disabled={isProcessing}
      onChange={handleChange}
      placeholder="4242 •••• •••• 4242"
      maxLength={19}
      autoComplete="cc-number"
      inputClassName="font-mono"
      headerRight={headerTestButtons}
      rightElement={getBrandBadge()}
    />
  );
};
