const SERVER_CART_CHANNEL_NAME = "technoshop:server-cart";
const SERVER_CART_STORAGE_EVENT_KEY = "technoshop:server-cart:changed";

type ServerCartChangedEvent = {
  type: "server-cart-changed";
  id: string;
  timestamp: number;
};

let serverCartChannel: BroadcastChannel | null | undefined;

const createEventId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const isServerCartChangedEvent = (
  value: unknown,
): value is ServerCartChangedEvent => {
  if (!value || typeof value !== "object") return false;

  const event = value as Partial<ServerCartChangedEvent>;
  return (
    event.type === "server-cart-changed" &&
    typeof event.id === "string" &&
    typeof event.timestamp === "number"
  );
};

const getServerCartChannel = () => {
  if (typeof window === "undefined") return null;
  if (serverCartChannel !== undefined) return serverCartChannel;

  serverCartChannel =
    "BroadcastChannel" in window
      ? new BroadcastChannel(SERVER_CART_CHANNEL_NAME)
      : null;

  return serverCartChannel;
};

export const publishServerCartChanged = () => {
  if (typeof window === "undefined") return;

  const event: ServerCartChangedEvent = {
    type: "server-cart-changed",
    id: createEventId(),
    timestamp: Date.now(),
  };
  const channel = getServerCartChannel();

  if (channel) {
    channel.postMessage(event);
    return;
  }

  try {
    localStorage.setItem(SERVER_CART_STORAGE_EVENT_KEY, JSON.stringify(event));
  } catch {
    // Cart updates must still succeed when browser storage is unavailable.
  }
};

export const subscribeToServerCartChanges = (listener: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  const channel = getServerCartChannel();
  const handleChannelMessage = (message: MessageEvent<unknown>) => {
    if (isServerCartChangedEvent(message.data)) listener();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== SERVER_CART_STORAGE_EVENT_KEY || !event.newValue) return;

    try {
      if (isServerCartChangedEvent(JSON.parse(event.newValue))) listener();
    } catch {
      // Ignore malformed events from stale or manually edited storage.
    }
  };

  channel?.addEventListener("message", handleChannelMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleChannelMessage);
    window.removeEventListener("storage", handleStorage);
  };
};
