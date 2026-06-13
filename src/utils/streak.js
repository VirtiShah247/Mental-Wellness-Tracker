/**
 * Helper to calculate daily journaling streaks based on entry dates.
 */
export const calculateStreak = (entriesList) => {
  if (!entriesList || entriesList.length === 0) return 0;
  
  // Sort chronological descending
  const sorted = [...entriesList].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Extrapolate local dates YYYY-MM-DD
  const dates = sorted
    .map(e => new Date(e.date).toLocaleDateString())
    .filter((value, index, self) => self.indexOf(value) === index); // Unique values

  if (dates.length === 0) return 0;

  const todayStr = new Date().toLocaleDateString();
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  // If latest entry isn't today or yesterday, streak is broken
  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let currentStreak = 1;
  let checkDate = new Date(sorted[0].date);

  for (let i = 1; i < sorted.length; i++) {
    const nextDate = new Date(sorted[i].date);
    
    // Diff in days
    const diffTime = Math.abs(checkDate.setHours(0,0,0,0) - nextDate.setHours(0,0,0,0));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      checkDate = nextDate;
    } else if (diffDays > 1) {
      break; // Gap found, stop counting
    }
  }

  return currentStreak;
};
