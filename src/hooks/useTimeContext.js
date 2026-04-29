import { useTime } from '../context/TimeContext';

/**
 * useTimeContext Hook - A proxy for the global TimeContext.
 * This ensures all components receive the same time data that updates in real-time.
 */
export const useTimeContext = () => {
  return useTime();
};
