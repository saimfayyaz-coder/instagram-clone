import { createMediaRequest, resolveMediaRequest } from '@/shared/lib/media/mediaRequest';

describe('mediaRequest', () => {
  it('resolves the waiting caller with the value', async () => {
    const { id, promise } = createMediaRequest<string>();
    resolveMediaRequest(id, 'photo.jpg');
    await expect(promise).resolves.toBe('photo.jpg');
  });

  it('resolves with null when the screen is closed', async () => {
    const { id, promise } = createMediaRequest<string>();
    resolveMediaRequest(id, null);
    await expect(promise).resolves.toBeNull();
  });

  it('ignores a second resolve for the same request', async () => {
    const { id, promise } = createMediaRequest<string>();
    resolveMediaRequest(id, 'first.jpg');
    resolveMediaRequest(id, null);
    await expect(promise).resolves.toBe('first.jpg');
  });

  it('gives every request its own id', () => {
    expect(createMediaRequest().id).not.toBe(createMediaRequest().id);
  });

  it('does nothing for an unknown id', () => {
    expect(() => resolveMediaRequest('missing', 'x')).not.toThrow();
  });
});
