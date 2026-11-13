// Lets a screen hand a result back to whoever opened it, without passing functions in navigation params
type Resolver = (value: unknown) => void;

const pending = new Map<string, Resolver>();
let nextId = 0;

export const createMediaRequest = <T>(): { id: string; promise: Promise<T | null> } => {
  nextId += 1;
  const id = `media-request-${nextId}`;
  const promise = new Promise<T | null>(resolve => {
    pending.set(id, resolve as Resolver);
  });
  return { id, promise };
};

// Only the first call for an id counts; later ones (e.g. on unmount) are ignored
export const resolveMediaRequest = <T>(id: string, value: T | null): void => {
  const resolve = pending.get(id);
  if (resolve) {
    pending.delete(id);
    resolve(value);
  }
};
