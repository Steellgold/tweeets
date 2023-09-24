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
  await readStream(stream, (chunkValue) => {
    value += chunkValue;
  });

  return value
    .replace(/[\r\n]+/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();
};