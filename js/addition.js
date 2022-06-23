const defaultBooks = [
  {
      title: 'You Can Win',
      author: 'Shiv Kheda',
      pages: 250,
      progress: 100,
      color: 'red'
  },
  {
      title: 'Improve Your Reading',
      author: 'Ron Fry',
      pages: 226,
      progress: 0,
      color: 'green'
  },{
      title: 'The 7 Habits of highly effective people',
      author: 'Stephen R. Cobvet',
      pages: 853,
      progress: 853,
      color: 'blue'
  }
];


const CUSTOM_VALIDITY_MESSAGES = {
  title:{
    required: 'Please enter a title for the book.',
  },
  author:{
    required: 'Please enter the author\'s name.',
  },
  pages:{
    required: 'Please enter the number of pages in the book.',
  }
}
