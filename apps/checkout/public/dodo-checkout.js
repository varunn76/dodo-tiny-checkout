"use strict";
(() => {
  var activeIframe = null;
  var activeOptions = null;
  var expectedOrigin = null;
  var isBusy = false;
  function handleKeyDown(event) {
    if (event.key === "Escape" && !isBusy) {
      close("user_closed");
    }
  }
  function handleMessage(event) {
    if (expectedOrigin && event.origin !== expectedOrigin) {
      return;
    }
    const data = event.data;
    if (!data || data.source !== "dodo-checkout") {
      return;
    }
    switch (data.type) {
      case "checkout:ready":
        isBusy = false;
        break;
      case "checkout:processing":
        isBusy = true;
        break;
      case "checkout:close": {
        if (isBusy) {
          return;
        }
        const payload = data.payload;
        close(payload?.reason ?? "user_closed");
        break;
      }
      case "checkout:success": {
        isBusy = false;
        const payload = data.payload;
        if (payload && activeOptions?.onSuccess) {
          activeOptions.onSuccess(payload);
        }
        close("payment_success");
        break;
      }
      case "checkout:error": {
        isBusy = false;
        const payload = data.payload;
        if (payload && activeOptions?.onError) {
          activeOptions.onError(payload);
        }
        break;
      }
    }
  }
  function open(options) {
    if (activeIframe) {
      console.warn("[DodoCheckout] Checkout is already open.");
      return;
    }
    activeOptions = options;
    isBusy = false;
    const rawBaseUrl =
      options.checkoutUrl ?? "https://dodo-tiny-checkout-checkout.vercel.app";
    const baseUrl = rawBaseUrl.replace(/\/+$/, "");
    try {
      expectedOrigin = new URL(baseUrl).origin;
    } catch {
      expectedOrigin = null;
    }
    const iframe = document.createElement("iframe");
    const url = options.productId
      ? `${baseUrl}?productId=${encodeURIComponent(options.productId)}`
      : baseUrl;
    iframe.src = url;
    iframe.title = "Dodo Checkout";
    iframe.allow = "payment";
    iframe.style.position = "fixed";
    iframe.style.inset = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.background = "transparent";
    document.body.appendChild(iframe);
    activeIframe = iframe;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("message", handleMessage);
  }
  function close(reason = "user_closed") {
    if (!activeIframe) {
      return;
    }
    if (isBusy && reason === "user_closed") {
      console.warn("[DodoCheckout] Cannot close while payment is processing.");
      return;
    }
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("message", handleMessage);
    activeIframe.remove();
    activeIframe = null;
    activeOptions?.onClose?.({
      reason,
    });
    activeOptions = null;
    expectedOrigin = null;
    isBusy = false;
  }
  function isOpen() {
    return activeIframe !== null;
  }
  var DodoCheckout = {
    open,
    close,
    isOpen,
  };
  if (typeof window !== "undefined") {
    window.DodoCheckout = DodoCheckout;
  }

  var src_default = DodoCheckout;
})();
