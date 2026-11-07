import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay as fnsIsSameDay 
} from 'date-fns';

/**
 * Yeh function dynamic range generate karta hai:
 * Month ke pehle din se lekar, week start (Sunday) tak peeche jata hai,
 * aur month ke aakhri din se lekar, week end (Saturday) tak aage jata hai.
 * Isse automatic 35 ya 42 days ka perfect grid ban jata hai.
 */
export function generateMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return fnsIsSameDay(date1, date2);
}