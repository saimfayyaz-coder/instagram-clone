jest.mock('@react-native-community/image-editor', () => ({
  __esModule: true,
  default: { cropImage: jest.fn() },
}));

const ImageEditor = require('@react-native-community/image-editor').default;
const { prepareForUpload } = require('@/shared/lib/media/resize');

const PRESET = { maxEdge: 500, quality: 0.85 };

describe('prepareForUpload', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sends an image that already fits as it is', async () => {
    const asset = { uri: 'file:///avatar.jpg', width: 500, height: 500 };
    await expect(prepareForUpload(asset, PRESET)).resolves.toBe(asset);
    expect(ImageEditor.cropImage).not.toHaveBeenCalled();
  });

  it('scales a large image down to the preset, keeping the whole frame', async () => {
    ImageEditor.cropImage.mockResolvedValue({ uri: 'file:///small.jpg', name: 'small.jpg', size: 61440 });
    const asset = { uri: 'file:///big.jpg', width: 4000, height: 3000 };

    const result = await prepareForUpload(asset, PRESET);

    expect(ImageEditor.cropImage).toHaveBeenCalledWith('file:///big.jpg', {
      offset: { x: 0, y: 0 },
      size: { width: 4000, height: 3000 },
      displaySize: { width: 500, height: 375 },
      format: 'jpeg',
      quality: 0.85,
    });
    expect(result).toEqual({
      uri: 'file:///small.jpg',
      width: 500,
      height: 375,
      mime: 'image/jpeg',
      fileName: 'small.jpg',
      fileSize: 61440,
    });
  });

  it('falls back to the original when resizing fails', async () => {
    ImageEditor.cropImage.mockRejectedValue(new Error('decode failed'));
    const asset = { uri: 'file:///big.jpg', width: 4000, height: 3000 };
    await expect(prepareForUpload(asset, PRESET)).resolves.toBe(asset);
  });
});
