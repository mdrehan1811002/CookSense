import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * TimeContext - Manages global meal-time state (Breakfast, Lunch, Dinner).
 * Updates automatically every minute to ensure UI reflects current time.
 */
const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [timeData, setTimeData] = useState(calculateTimeContext());

  function calculateTimeContext() {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return { 
        label: 'Breakfast', 
        category: 'Breakfast', 
        greeting: 'Good Morning',
        theme: 'Morning'
      };
    } else if (hour >= 12 && hour < 17) {
      return { 
        label: 'Lunch', 
        category: 'Chicken', 
        greeting: 'Good Afternoon',
        theme: 'Midday'
      };
    } else {
      return { 
        label: 'Dinner', 
        category: 'Pasta', 
        greeting: 'Good Evening',
        theme: 'Evening'
      };
    }
  }

  useEffect(() => {
    // Check every 60 seconds to update global state if time period changes
    const interval = setInterval(() => {
      const newContext = calculateTimeContext();
      setTimeData(prev => {
        if (prev.label !== newContext.label) {
          console.log(`Meal period changed to: ${newContext.label}`);
          return newContext;
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TimeContext.Provider value={timeData}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};
