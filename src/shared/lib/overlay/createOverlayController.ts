// Lets any code open an overlay that keeps its own state (toast, alert)
export const createOverlayController = <T>() => {
  let handler: ((payload: T) => void) | null = null;
  // Asked for before the overlay mounted, shown once it does
  let pending: T | null = null;

  return {
    register: (next: ((payload: T) => void) | null) => {
      handler = next;
      if (handler && pending) {
        handler(pending);
        pending = null;
      }
    },
    show: (payload: T) => {
      if (handler) {
        handler(payload);
      } else {
        pending = payload;
      }
    },
  };
};
