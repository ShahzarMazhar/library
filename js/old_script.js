// make life easy //
function $_(selector, context) {
    return (context || document).querySelectorAll(selector);
}
function $(selector, context) {
    return (context || document).querySelector(selector);
}

function newElement(elementName){
    return document.createElement(elementName);
}

function random(max=Number, min=0){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
// life is easy //


function addBookToLibrary(e) {
    // do stuff here
      e.preventDefault();
      const title     = e.target.title.value;
      const author    = e.target.author.value;
      const pages     = e.target.pages.value;
      const progress  = e.target.completed.value;
      
      // book = new Book("The Child who never grew", 'pearl s. buck', 143, 15, ['red']);
      const book = new Book(title, author, pages, progress);
      myLibrary.push(book);
      refreshLibraryUI([myLibrary[myLibrary.length - 1]]);
      setTimeout(() => {modelAddBook.classList.remove('open')}, 1000);
      e.target.reset()
}

function Book(title, author, pages, progress, color) {
  // Requirement 2: the constructor...
    bookCount++;
    this.id = bookCount;
    this.title = title.toUpperCase();
    this.author = author.toLowerCase();
    this.pages = pages;
    this.progress = progress;
    this.color = color || `rgb(${random(255)}, ${random(255)}, ${random(255)})`
}

Book.prototype.readStatus = function(){
    if(this.progress == 0){
        return "New";
    }else if(this.pages == this.progress){
        return "Finished";
    }else{
        return `${(this.progress * 100 / this.pages).toFixed(2)} %`;
    }
};


function removeBookFromLibrary(){
    
}

/*
---- card for individual book ----
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


function refreshLibraryUI(myLibrary){
    //Requirement 3: creating required elements and appending to the library
    for(let i=0; i < myLibrary.length; i++){
        const card      = newElement('div');
        const book      = newElement('div');
        const title     = newElement('h3');
        const author    = newElement('p');
        const info      = newElement('div');
        const p         = newElement('p');
        const pIcon     = newElement('p');
        const mdi       = newElement('span');

        card.className = 'card';
        card.setAttribute('data-id', myLibrary[i].id)
        book.className = 'book';
        book.style.backgroundColor = myLibrary[i].color;
        title.className = 'title';
        title.textContent = myLibrary[i].title;
        author.className = 'author';
        author.textContent = myLibrary[i].author;
        info.className = 'info';
        p.textContent = myLibrary[i].readStatus();
        mdi.className = 'mdi mdi-dots-vertical mdi-rotate-90';
        pIcon.appendChild(mdi);
        info.append(p,pIcon);
        book.append(title, author);
        card.append(book, info);

        library.appendChild(card);
        addEvent(card);
    }

}

function sortBooks(e){
    switch(sortMode){
        case "Author"   : sortMode = "Title";   break;
        case "Title"    : sortMode = "Recent";  break;
        case "Recent"   : sortMode = "Author";  break;
    }

    mode = (sortMode == "Recent") ? 'id' : sortMode.toLowerCase() ;
    myLibrary.sort((a,b) => {
      const A = (a[mode]);
      const B = (b[mode]);
      return (A < B) ? -1 : (A > B) ? 1 : 0;
          });

    library.innerHTML = "";
    e.target.textContent = sortMode;
    refreshLibraryUI(myLibrary);
}

function showOption(e){
    const list  = newElement('ul');
    const add   = newElement('li');
    const edit  = newElement('li');
    const read  = newElement('li');
    id = e.target.getAttribute('data-id');
    add.textContent = 'Add Progress';
    add.addEventListener('click', openAddProgress);
    
    edit.textContent = 'Edit';
    edit.addEventListener('click', openEditBook)

    read.textContent = 'Mark as Finished';
    read.addEventListener('click', markAsRead);

    list.append(add, edit, read);
    $('.book', e.target).appendChild(list);
}

function addEvent(items){
    items.addEventListener('mouseenter', showOption);
    items.addEventListener('mouseleave', (e) => $('ul', e.target).remove());
    $('span', items).addEventListener('click', openEditBook);
}
       
function getIndex(id){
    let index
    myLibrary.forEach(e => {if(e.id == id)index = myLibrary.indexOf(e)});
    return index;
}

function openAddProgress(e){
    let index = getIndex(id);
    $('label', modelAddProgress).textContent = myLibrary[index].title;
    progressDisplay.value = `Completed: ${myLibrary[index].progress}/${myLibrary[id - 1].pages} Pages`;
    addProgressInput.max = myLibrary[index].pages;
    addProgressInput.value = myLibrary[index].progress;
    modelAddProgress.classList.add('open');
}

function openEditBook(e){
    let index = getIndex(id);
    editBookPreview.style.backgroundColor = myLibrary[index].color;
    editTitlePreview.textContent = myLibrary[index].title;
    editAuthorPreview.textContent = myLibrary[index].author;
    editTitle.value = myLibrary[index].title;
    editAuthor.value = myLibrary[index].author;
    editPages.value = myLibrary[index].pages;
    editCompleted.value = myLibrary[index].progress;
    editCompleted.max = myLibrary[index].pages;
    editFinished.checked = myLibrary[index].pages == myLibrary[index].progress;
    modelEditBook.classList.add('open');
}

function saveEditBook(e){
    e.preventDefault();
    let index = getIndex(id);
    const title     = e.target.title.value;
    const author    = e.target.author.value;
    const pages     = e.target.pages.value;
    const progress  = e.target.completed.value;

    myLibrary[index].title = title;
    myLibrary[index].author = author;
    myLibrary[index].pages = pages;
    myLibrary[index].progress  = progress;

    setTimeout(() => {
        library.innerHTML = "";
        refreshLibraryUI(myLibrary)
        modelEditBook.classList.remove('open');
    }, 1000);
}


function updateDisplay(e){
    let index = getIndex(id);
    progressDisplay.value = `Completed: ${e.target.value}/${myLibrary[index].pages} Pages`;
}

function updateProgress(e){
    let index = getIndex(id);
    const progress  = e.target.progress.value;
    e.preventDefault();

    myLibrary[index].progress = +progress;

    setTimeout(() => {
        library.innerHTML = "";
        refreshLibraryUI(myLibrary)
        modelAddProgress.classList.remove('open')
    }, 500);
}

function deleteBook(){
    let index = getIndex(id);

    if(confirm(`Are you sure, you want to delete "${myLibrary[index].title}" by "${myLibrary[index].author}"`)){
        setTimeout(() => {
            myLibrary.splice(index, 1);
            library.innerHTML = "";
            refreshLibraryUI(myLibrary)
            modelEditBook.classList.remove('open')
        }, 500);
    }

}

function markAsRead(e){
    let index = getIndex(id);
    const status = $('.info p', e.target.parentElement.parentElement.parentElement);

    setTimeout(() => {
        myLibrary[index].progress = myLibrary[index].pages;

        status.textContent =  `Finished`;
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
btnCancelAddBook.addEventListener('click', () => modelAddBook.classList.remove('open'));
btnCancelAddProgress.addEventListener('click', () => modelAddProgress.classList.remove('open'));
btnCancelEditBook.addEventListener('click', () => modelEditBook.classList.remove('open'));
formAddBook.addEventListener('submit', addBookToLibrary)
formAddProgress.addEventListener('submit', updateProgress)
formEditBook.addEventListener('submit', saveEditBook)
btnSort.addEventListener('click', sortBooks)
btnDeleteBook.addEventListener('click', deleteBook)
pages.addEventListener('input', e => read.max = e.target.value);
addProgressInput.addEventListener('input', updateDisplay);
editTitle.addEventListener('input', e => editTitlePreview.textContent = e.target.value);
editAuthor.addEventListener('input', e => editAuthorPreview.textContent = e.target.value);
editFinished.addEventListener('change', e => editCompleted.value = e.target.checked ? editPages.value : 0);
editCompleted.addEventListener('input', e => editFinished.checked = e.target.value == editPages.value);
finished.addEventListener('change', e => completed.value = e.target.checked ? pages.value : 0);
completed.addEventListener('input', e => finished.checked = e.target.value == pages.value);


//Default Values
let sortMode = 'Recent';
let bookCount = 0;
let activeOption = 0;
let myLibrary = [
    new Book("You Can Win","Shiv Kheda",250,100,'red'),
    new Book("Improve Your Reading","Ron Fry",226,0,'green'),
    new Book("The 7 Habits of highly effective people","Stephen R. Cobvet",853,853,'blue')
];

refreshLibraryUI(myLibrary);
