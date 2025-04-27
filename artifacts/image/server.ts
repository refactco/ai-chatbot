import { provider } from '@/lib/ai/providers';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { experimental_generateImage } from '@/lib/ai/stream-utils';

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    const { image } = await experimental_generateImage({
      model: provider.imageModel('small-model'),
      prompt: title,
      n: 1,
    });

    draftContent = image;

    dataStream.writeData({
      type: 'image-delta',
      content: image,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = '';

    const { image } = await experimental_generateImage({
      model: provider.imageModel('small-model'),
      prompt: description,
      n: 1,
    });

    draftContent = image;

    dataStream.writeData({
      type: 'image-delta',
      content: image,
    });

    return draftContent;
  },
});
