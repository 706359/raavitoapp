// patches/fixBackHandler.js
import { BackHandler } from "react-native";

// Ensure backward compatibility for old libraries that still call removeEventListener
if (BackHandler && typeof BackHandler.removeEventListener !== "function") {
  const originalAddEventListener = BackHandler.addEventListener;

  const subscriptions = new Map();

  BackHandler.addEventListener = (eventName, handler) => {
    const subscription = originalAddEventListener(eventName, handler);
    subscriptions.set(handler, subscription);
    return subscription;
  };

  BackHandler.removeEventListener = (eventName, handler) => {
    const subscription = subscriptions.get(handler);
    try {
      subscription?.remove?.();
    } catch {}
    subscriptions.delete(handler);
  };
}
