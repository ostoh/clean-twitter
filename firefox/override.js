(function () {
  const isGlobalOn = localStorage.getItem("ct-global") !== "false";
  const isZenOn = localStorage.getItem("ct-zen") === "true";
  const isMediaOn = localStorage.getItem("ct-media") === "true";

  if (isZenOn) document.documentElement.classList.add("ct-zen");
  if (isMediaOn) document.documentElement.classList.add("ct-media");

  if (isGlobalOn) {
    const TARGET_WIDTH = 1065;
    const TARGET_DPR = 1.899999976158142;

    const windowProto = Object.getPrototypeOf(window);
    if (Object.getOwnPropertyDescriptor(windowProto, "innerWidth")) {
      Object.defineProperty(window, "innerWidth", {
        get: () => TARGET_WIDTH,
        configurable: true,
      });
    }

    const originalClientWidth = Object.getOwnPropertyDescriptor(
      Element.prototype,
      "clientWidth",
    ).get;
    Object.defineProperty(Element.prototype, "clientWidth", {
      get: function () {
        if (this === document.body || this === document.documentElement)
          return TARGET_WIDTH;
        return originalClientWidth.call(this);
      },
      configurable: true,
    });

    Object.defineProperty(window, "devicePixelRatio", {
      get: () => TARGET_DPR,
      configurable: true,
    });

    window.addEventListener("DOMContentLoaded", () => {
      window.dispatchEvent(new Event("resize"));
    });
  } else {
    document.documentElement.classList.add("ct-global-off");
  }
})();
