export const calculateCredits = (threadLength: number): number => {
  if (threadLength <= 5) {
    return threadLength;
  } else {
    return threadLength - 1;
  }
}