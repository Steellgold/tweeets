// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const fetcher = async(...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  return res.json();
};