import { useState } from "react";
import { EventLog } from "./components/EventLog";

interface EventItem {
  id: string;
  timestamp: string;
  message: string;
}

export function App() {
  const [events, setEvents] = useState<EventItem[]>([]);

  const addEvent = (message: string) => {
    const newEvent: EventItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleBuyNow = () => {
    addEvent("Calling DodoCheckout.open()...");

    if (!window.DodoCheckout) {
      addEvent("Error: DodoCheckout script not loaded.");
      return;
    }

    window.DodoCheckout.open({
      productId: "pro_plan",

      onSuccess: ({ sessionId }) => {
        addEvent(`Payment success: ${sessionId}`);
      },

      onClose: ({ reason }) => {
        addEvent(`Checkout closed: ${reason}`);
      },

      onError: ({ code, message }) => {
        addEvent(`Payment error: ${code} - ${message}`);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          My Demo Store
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Example merchant website demonstrating Dodo Payments checkout
          integration
        </p>
      </header>

      <main className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Popular
            </span>
            <span className="text-xs font-medium text-slate-400">
              Monthly billing
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold text-slate-900">Pro Plan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Full access to all advanced features and priority support.
          </p>

          <div className="mt-6 flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              $29.00
            </span>
            <span className="ml-1 text-sm font-semibold text-slate-500">
              / month
            </span>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-slate-600 border-t border-slate-100 pt-5">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Unlimited checkout sessions
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Embeddable checkout modal
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Instant success, error & close events
            </li>
          </ul>

          <div className="mt-8 space-y-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:scale-[0.99] transition-all cursor-pointer"
            >
              Buy Now
            </button>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Press Escape or click above to dismiss checkout iframe
            </p>
          </div>
        </div>
        <EventLog events={events} />
      </main>
    </div>
  );
}
