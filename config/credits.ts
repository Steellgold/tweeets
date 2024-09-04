export const calculateCredits = (threadLength: number): number => {
  if (threadLength <= 5) {
    return threadLength;
  } else {
    return threadLength - 1;
  }
}

export const getTokensCount = (charCount: number, isThread: boolean, threadCount?: number): number => {
  const tokensForSingleTweet = Math.ceil(charCount * 2);

  if (isThread) {
    return Math.min(tokensForSingleTweet * (threadCount || 2), 10181);
  } else {
    return Math.min(tokensForSingleTweet, 10181);
  }
}