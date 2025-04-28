// This file provides replacement implementations for the AI package streaming utilities

export interface StreamPart<Item> {
  type: string;
  value: Item;
}

export interface TextDelta {
  type: 'text-delta';
  textDelta: string;
}

/**
 * A replacement for the streamText function from the AI package
 */
export function streamText(options: {
  model: any;
  system: string;
  prompt: string;
  experimental_transform?: any;
  experimental_providerMetadata?: any;
}) {
  const { prompt } = options;

  // Create a simple text response
  const text = `Response to: "${prompt}"\n\nThis is a placeholder response from the stubbed AI provider.`;

  // Return a format that matches what the original code expects
  return {
    fullStream: (async function* () {
      // Simulate streaming with a small delay
      const words = text.split(' ');
      for (const word of words) {
        yield {
          type: 'text-delta',
          textDelta: `${word} `,
        } as TextDelta;
        // Small delay to simulate streaming
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    })(),
  };
}

/**
 * A replacement for the smoothStream function from the AI package
 */
export function smoothStream(options: any) {
  // Just return the options for now, as it's used as a transform
  return options;
}

/**
 * A replacement for the streamObject function from the AI package
 */
export function streamObject<T>(options: {
  model: any;
  system: string;
  prompt: string;
  schema: any;
}) {
  // Extract the schema to determine what type of object we need to return
  const schema = options.schema;
  const schemaFields = Object.keys(schema.shape || {});

  // Create a simple response object based on the schema
  let responseObj: any = {};

  if (schemaFields.includes('csv')) {
    // Sheet artifact
    responseObj = {
      csv: `Column1,Column2,Column3\nValue1,Value2,Value3\nValue4,Value5,Value6`,
    };
  } else {
    // Generic object
    responseObj = { result: `Result for: ${options.prompt}` };
  }

  return {
    fullStream: (async function* () {
      yield {
        type: 'object',
        object: responseObj,
      };
    })(),
  };
}

/**
 * A replacement for the experimental_generateImage function from the AI package
 */
export async function experimental_generateImage(options: {
  model: any;
  prompt: string;
  n?: number;
}) {
  console.log('Image generation requested with prompt:', options.prompt);
  // Return a placeholder image URL or base64 data
  return {
    image:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  };
}
