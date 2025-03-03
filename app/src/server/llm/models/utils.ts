import { RETRIES, DELAY_MS } from '../../../shared/constants';
export async function retry<T>(fn: () => Promise<T>, retries: number = RETRIES, delayMs: number = DELAY_MS): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return retry(fn, retries - 1, delayMs * 2);
    } else {
      throw error;
    }
  }
}
