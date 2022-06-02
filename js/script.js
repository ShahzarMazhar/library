// make life easy //
function $_(selector, context) {
  return (context || document).querySelectorAll(selector);
}
function $(selector, context) {
  return (context || document).querySelector(selector);
}

//make easy document.create (including bulk create)
function createElements(...elementName) {
  const result = [];
  elementName.forEach((e) => result.push(document.createElement(e)));
  if (result.length == 1) return result[0];
  return result;
}

//make easy add Attribute (including bulk)

function addAttribute(qualifiedName, ...pairsOfNodeAttribute) {
  pairsOfNodeAttribute.forEach((e) => {
    e[0].setAttribute(qualifiedName, e[1]);
  });
}

function random(max = Number, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// life is easy //

function addBookToLibrary(e) {
  // do stuff here
  e.preventDefault();
  const book = {
    title: e.target.title.value,
    author: e.target.author.value,
    pages: parseInt(e.target.pages.value),
    progress: parseInt(e.target.completed.value) || 0,
  }

  if(validate(e.target.title, 'title') && validate(e.target.author, 'author') && validate(e.target.pages, 'pages')){
      // book = new Book("The Child who never grew", 'pearl s. buck', 143, 15, ['red']);
      
      myLibrary.push(new Book(book));
      refreshLibraryUI([myLibrary[myLibrary.length - 1]]);
      setTimeout(() => {
        modelAddBook.classList.remove('open');
      }, 1000);
      e.target.reset();
  }

}

class Book {
  constructor(book) {
    // Requirement 2: the constructor...
    bookCount++;
    this.id = bookCount;
    this.title = book.title.toUpperCase();
    this.author = toTitleCase(book.author);
    this.pages = book.pages;
    this.progress = book.progress;
    this.color = book.color || `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  }

  get readStatus() {
    if (this.progress == 0) {
      return 'New';
    } else if (this.pages == this.progress) {
      return 'Finished';
    } else {
      return `${((this.progress * 100) / this.pages).toFixed(2)} %`;
    }
  }

  /**
   * @param {number} number
   */
  set setProgress(number) {
    this.progress = number;
  }
}

/*
---- card template for individual book ----
<div class="card">
    <div class="book">
        <h3 class="title">TITLE</h3>
        <p class="author">Author</p>
    </div>
    <div class="info">
        <p>Progress</p>
        <p><span class="mdi mdi-dots-vertical mdi-rotate-90"></span></p>
    </div>
</div>
*/

function refreshLibraryUI(myLibrary) {
  //Requirement 3: creating required elements and appending to the library
  for (let i = 0; i < myLibrary.length; i++) {
    const [card, book, title, author, info, p, pIcon, mdi] = createElements(
      'div',
      'div',
      'h3',
      'p',
      'div',
      'p',
      'p',
      'span'
    );

    addAttribute(
      'class',
      [card, 'card'],
      [book, 'book'],
      [title, 'title'],
      [author, 'author'],
      [info, 'info'],
      [mdi, 'mdi mdi-dots-vertical mdi-rotate-90']
    );

    addAttribute('data-id', [card, myLibrary[i].id]);

    book.style.backgroundColor = myLibrary[i].color;
    title.textContent = myLibrary[i].title;
    author.textContent = myLibrary[i].author;
    p.textContent = myLibrary[i].readStatus;

    pIcon.appendChild(mdi);
    info.append(p, pIcon);
    book.append(title, author);
    card.append(book, info);

    library.appendChild(card);
    addEvent(card);
  }
}

function sortBooks(e) {
  switch (sortMode) {
    case 'Author':
      sortMode = 'Title';
      break;
    case 'Title':
      sortMode = 'Recent';
      break;
    case 'Recent':
      sortMode = 'Author';
      break;
  }

  mode = sortMode == 'Recent' ? 'id' : sortMode.toLowerCase();
  myLibrary.sort((a, b) => {
    const A = a[mode];
    const B = b[mode];
    return A < B ? -1 : A > B ? 1 : 0;
  });

  library.innerHTML = '';
  e.target.textContent = sortMode;
  refreshLibraryUI(myLibrary);
}

function showOption(e) {
  const [list, add, edit, read] = createElements('ul', 'li', 'li', 'li');

  id = e.target.getAttribute('data-id');
  add.textContent = 'Add Progress';
  add.addEventListener('click', openAddProgress);

  edit.textContent = 'Edit';
  edit.addEventListener('click', openEditBook);

  read.textContent = 'Mark as Finished';
  read.addEventListener('click', markAsRead);

  list.append(add, edit, read);
  $('.book', e.target).appendChild(list);
}

function addEvent(items) {
  items.addEventListener('mouseenter', showOption);
  items.addEventListener('mouseleave', (e) => $('ul', e.target).remove());
  $('span', items).addEventListener('click', openEditBook);
}

function getIndex(id) {
  let index;
  myLibrary.forEach((e) => {
    if (e.id == id) index = myLibrary.indexOf(e);
  });
  return index;
}

function getId(event) {
  const id = event.target.closest('.card').getAttribute('data-id');
  let index;
  myLibrary.forEach((e) => {
    if (e.id == id) index = myLibrary.indexOf(e);
  });
  return index;
}

function openAddProgress(e) {
  const book = myLibrary[getId(e)];
  $('label', modelAddProgress).textContent = book.title;
  progressDisplay.value = `Completed: ${book.progress}/${book.pages} Pages`;
  addProgressInput.max = book.pages;
  addProgressInput.value = book.progress;
  modelAddProgress.classList.add('open');
}

function openEditBook(e) {
  const book = myLibrary[getId(e)];
  editBookPreview.style.backgroundColor = book.color;
  editTitlePreview.textContent = book.title;
  editAuthorPreview.textContent = book.author;
  editTitle.value = book.title;
  editAuthor.value = book.author;
  editPages.value = book.pages;
  editCompleted.value = book.progress;
  editCompleted.max = book.pages;
  editFinished.checked = book.pages == book.progress;
  modelEditBook.classList.add('open');
}

function saveEditBook(e) {
  e.preventDefault();
  const book = myLibrary[getIndex(id)];
  const title = e.target.title.value;
  const author = e.target.author.value;
  const pages = e.target.pages.value;
  const progress = e.target.completed.value;

  book.title = title;
  book.author = author;
  book.pages = pages;
  book.progress = progress;

  setTimeout(() => {
    library.innerHTML = '';
    refreshLibraryUI(myLibrary);
    modelEditBook.classList.remove('open');
  }, 1000);
}

function updateDisplay(e) {
  let index = getIndex(id);
  progressDisplay.value = `Completed: ${e.target.value}/${myLibrary[index].pages} Pages`;
}

function updateProgress(e) {
  let index = getIndex(id);
  const progress = e.target.progress.value;
  e.preventDefault();

  myLibrary[index].setProgress = progress;

  setTimeout(() => {
    library.innerHTML = '';
    refreshLibraryUI(myLibrary);
    modelAddProgress.classList.remove('open');
  }, 500);
}

function deleteBook() {
  let index = getIndex(id);

  if (
    confirm(
      `Are you sure, you want to delete "${myLibrary[index].title}" by "${myLibrary[index].author}"`
    )
  ) {
    setTimeout(() => {
      myLibrary.splice(index, 1);
      library.innerHTML = '';
      refreshLibraryUI(myLibrary);
      modelEditBook.classList.remove('open');
    }, 500);
  }
}

function markAsRead(e) {
  let index = getIndex(id);
  const status = $(
    '.info p',
    e.target.parentElement.parentElement.parentElement
  );

  setTimeout(() => {
    myLibrary[index].progress = myLibrary[index].pages;

    status.textContent = `Finished`;
  }, 500);
}

const library = $('.library');
const btnAddBook = $('#add-book');
const modelAddBook = $('.add-book-form');
const modelAddProgress = $('.add-progress');
const modelEditBook = $('.edit-book-form');
const btnCancelAddBook = $('span', modelAddBook);
const btnCancelEditBook = $('span', modelEditBook);
const btnCancelAddProgress = $('span', modelAddProgress);
const progressDisplay = $('input[type=text]', modelAddProgress);
const addProgressInput = $('input[type=range]', modelAddProgress);
const formAddBook = $('.add-book-form form');
const formAddProgress = $('.add-progress form');
const formEditBook = $('.edit-book-form form');
const btnSort = $('#sort-by');
const pages = $('#pages');
const read = $('#completed');
const completed = $('#completed');
const finished = $('#finished');

const editBookPreview = $('.book', modelEditBook);
const editTitlePreview = $('.title', modelEditBook);
const editAuthorPreview = $('.author', modelEditBook);
const editTitle = $('#edit-title', modelEditBook);
const editAuthor = $('#edit-author', modelEditBook);
const editPages = $('#edit-pages', modelEditBook);
const editCompleted = $('#edit-completed', modelEditBook);
const editFinished = $('#edit-finished', modelEditBook);
const btnDeleteBook = $('#delete-book', modelEditBook);

btnAddBook.addEventListener('click', () => modelAddBook.classList.add('open'));
btnCancelAddBook.addEventListener('click', () =>
  modelAddBook.classList.remove('open')
);
btnCancelAddProgress.addEventListener('click', () =>
  modelAddProgress.classList.remove('open')
);
btnCancelEditBook.addEventListener('click', () =>
  modelEditBook.classList.remove('open')
);
formAddBook.addEventListener('submit', addBookToLibrary);
formAddProgress.addEventListener('submit', updateProgress);
formEditBook.addEventListener('submit', saveEditBook);

// Quick patch to validate the form, it's not the best way but it works
$('#title').addEventListener('input', e => {
    validate(e.target, 'title');
})
$('#author').addEventListener('input', e => {
    validate(e.target, 'author');
})
$('#pages').addEventListener('input', e => {
    validate(e.target, 'pages');
})

btnSort.addEventListener('click', sortBooks);
btnDeleteBook.addEventListener('click', deleteBook);
pages.addEventListener('input', (e) => (read.max = e.target.value));
addProgressInput.addEventListener('input', updateDisplay);
editTitle.addEventListener('input', (e) => {
    validate(e.target, 'title');
    editTitlePreview.textContent = e.target.value;
});
editAuthor.addEventListener('input', (e) => {
    editAuthorPreview.textContent = e.target.value;
    validate(e.target, 'author');
});
editPages.addEventListener('input', (e) => {
    validate(e.target, 'pages');
});
editFinished.addEventListener('change', (e) => {
    editCompleted.value = e.target.checked ? editPages.value : 0;
});
editCompleted.addEventListener('input', (e) => {
    editFinished.checked = e.target.value == editPages.value;
});
finished.addEventListener('change', (e) => {
    completed.value = e.target.checked ? pages.value : 0;

});
completed.addEventListener('input', (e) => {
  finished.checked = e.target.value == pages.value;
});

//Default Values
let sortMode = 'Recent';
let bookCount = 0;
let activeOption = 0;

let myLibrary = [new Book(defaultBooks[0]),new Book(defaultBooks[1]),new Book(defaultBooks[2])];



refreshLibraryUI(myLibrary);
