// import libraries
var express = require('express');
var router = express.Router();

//import book model
const Book = require('../models').Book;

// helper function to wrap route handlers
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Get | Home Page
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Retrieve all books from db and render
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Books" });
}));

// Get | New book
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book" });
}));

// Post | New book
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      // render form back with errors if validation fails
      res.render('new-book', { book, errors: error.errors, title:"New Book" });
    } else {
      throw error;
    }
  }
}));

// Get | Update book
router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  // Check if the book exists 
  // send 404 and render page-not-found if not
  if (!book) {
    res.status(404);
    res.render('page-not-found');
  } else {
    // render upadte book form if the book exists
    res.render('update-book', { book, title: "Update Book" });
  }
}));

// Post | Update book
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);

  // Check if the book exists 
  // send 404 and render page-not-found if not
  if (!book) {
    res.status(404);
    res.render('page-not-found');
  }

  // If the book exists, attempt to update it
  try {
    await book.update(req.body);
    res.redirect('/books');
  } catch (error) {
    // render form back with errors if validation fails
    if (error.name === "SequelizeValidationError") {
      res.render("update-book", { book, errors: error.errors, title: "Edit Book" });
    } else {
      next(error);
    }
  }
}));


// Post | Delete book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);

  // check if the book exists
  // send 404 and render page-not-found if not
  if (!book) {
    res.status(404);
    res.render('page-not-found');

    // delete the book if it exists
  } else {
    await book.destroy();
    res.redirect('/');
  }
}));

module.exports = router;
