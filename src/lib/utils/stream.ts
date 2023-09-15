/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const readStream = async(stream: ReadableStream, onChunkValue?: (chunkValue: string) => void): Promise<void> => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);

    onChunkValue?.(chunkValue);
  }
};

export const readStreamValue = async(stream: ReadableStream): Promise<string> => {
  let value = "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value: chunkValue, done: doneReading } = await reader.read();
    done = doneReading;
    value += decoder.decode(chunkValue);
  }

  return value;
};