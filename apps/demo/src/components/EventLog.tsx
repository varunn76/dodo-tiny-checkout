interface EventLogProps {
  events?: Array<{ id: string; timestamp: string; message: string }>;
}

export const EventLog = ({ events = [] }: EventLogProps) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-5 mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Event Log
        </h3>
        <span className="text-xs text-slate-400">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>

      <div className="mt-4">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 italic py-2">
            No checkout events yet.
          </p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {events.map((event) => (
              <li
                key={event.id}
                className="text-xs font-mono bg-slate-50 border border-slate-100 rounded px-2.5 py-1.5 flex justify-between items-center text-slate-700"
              >
                <span>{event.message}</span>
                <span className="text-slate-400 text-[10px] ml-2">
                  {event.timestamp}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
