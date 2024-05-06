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

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  console.log(books); // Check what is in the books array
  res.render('index', { books, title: "Books" });
}));

router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { book: {}, title: "New Book"});
}));

router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  book = await Book.create(req.body);
  res.redirect('/');
}))

router.get('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book, title: "Update Book"});
}));

module.exports = router;
