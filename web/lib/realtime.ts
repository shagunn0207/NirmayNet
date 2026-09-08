// Realtime WebSocket & Event Subscription Mock Layer

type Listener<T> = (data: T) => void;

class RealtimeHub {
  private listeners: Map<string, Set<Listener<any>>> = new Map();

  subscribe<T>(channel: string, listener: Listener<T>) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    return () => {
      this.listeners.get(channel)?.delete(listener);
    };
  }

  broadcast<T>(channel: string, payload: T) {
    this.listeners.get(channel)?.forEach((fn) => fn(payload));
  }
}

export const realtimeHub = new RealtimeHub();
