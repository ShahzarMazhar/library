function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

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

function isValid(input, type){
  if(type === 'title'){
    return input.value.length > 0;
  }
  if(type === 'author'){
    return input.value.length > 0;
  }
  if(type === 'pages'){
    return input.value > 0;
  }
}

function validate(input, type){
  if(!isValid(input, type)){
    input.setCustomValidity(CUSTOM_VALIDITY_MESSAGES[type].required);
    input.reportValidity();
  } else {
    input.setCustomValidity('');
  }
  return isValid(input, type);
}


const defaultBooks = [
  {
      title: 'You Can Win',
      author: 'shiv kheda',
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

