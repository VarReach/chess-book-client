export default {
  compareArrays(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  },
  parseDate(date) {
    const day = date.slice(8, 10);
    const year = date.slice(0, 4);
    let month = date.slice(5,7);
    const months = { 
      '01': 'Jan.', 
      '02': 'Feb.', 
      '03': 'Mar.', 
      '04': 'Apr.', 
      '05': 'May.', 
      '06': 'Jun.', 
      '07': 'Jul.', 
      '08': 'Aug.', 
      '09': 'Sep.', 
      '10': 'Oct.', 
      '11': 'Nov.',
      '12': 'Dec.'
    }
    month = months[month];
    return month+' '+day+', '+year;
  },
  verifyChapterTitle(title) {
    if (title.length < 6) {
      return { message: 'Book title must be atleast 6 characters'};
    } else if (title.length > 72) {
      return { message: 'Book title must be less than 72 characters'};
    }
    return;
  }
}