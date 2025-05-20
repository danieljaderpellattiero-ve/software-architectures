export const addMinimumDelay = async (promise, minDelay = 4000) => {
  const startTime = Date.now();
  const result = await promise;
  const elapsedTime = Date.now() - startTime;
  const remainingDelay = Math.max(0, minDelay - elapsedTime);
  
  if (remainingDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingDelay));
  }
  
  return result;
};  