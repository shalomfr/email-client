// Utility functions placeholder
// Add your utility functions here

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('he-IL');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};