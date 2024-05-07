var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

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

// Get Home Page
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// Retrieve all books from db and render
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: "Books" });
}));

// Get New Book page
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book" });
}));

// Post | Add new book to db
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title:"New Book" });
    } else {
      throw error;
    }
  }
}));

// Get Update Book page
router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book, title: "Update Book" });
}));

// Post | Update book info in db
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; 
      res.render("update-book", { book, errors: error.errors, title: "Edit Book" });
    } else {
      throw error;
    }
  }
}));

// Post | Delete book
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect('/');
  } else {
    res.status(404);
    res.render('page-not-found');
  }
}));

module.exports = router;
