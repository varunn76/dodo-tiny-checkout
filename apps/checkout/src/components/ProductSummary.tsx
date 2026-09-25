interface ProductSummaryProps {
  title?: string;
  description?: string;
  amount?: string;
  interval?: string;
}

export const ProductSummary = ({
  title = "Pro Plan",
  description = "Billed monthly. Cancel anytime.",
  amount = "$29.00",
  interval = "month",
}: ProductSummaryProps) => {
  return (
    <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-3">
        <div className="text-base font-bold text-slate-900">{amount}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
          per {interval}
        </div>
      </div>
    </div>
  );
};
