const express = require('express');
const router = express.Router();
const Author = require('../modals/author');
const Book = require('../modals/book');
const path = require("path")
const imageMimeTypes = ['image/jpeg','images/gif','image/png']
// All Books
router.get('/',async (req,res) => {
    let query = Book.find()
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title',new RegExp(req.query.title,'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
        query = query.gte('publishDate',req.query.publishedAfter)
    }
   try{
       const book = await query.exec()
       res.render('books/index',{books:book,searchOptions:req.query})
   }catch{
       res.redirect("/")
   }
})

// New Books
router.get('/new',async (req,res) => {
    renderNewPage(res,new Book())
})
// Create Books
router.post('/', async (req,res) => {
    const book = new Book({
        title : req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        description: req.body.description,
    })
    saveCover(book,req.body.cover)
    try{
        const newBook = await book.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('books')
    }catch{
        renderNewPage(res,book,true)
    }
})
async function renderNewPage(res,book,hasError=false){
    try{
        const authors = await Author.find({})
        const params = {
            authors,
            book
        }
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render("books/new",params)
    }catch{
        res.redirect('/books')
    }
}

function saveCover(book,coverEncoded){
    if(coverEncoded == null ) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type) ){
        book.coverImage = new Buffer.from(cover.data,"base64")
        book.coverImageType = cover.type
    }
}
module.exports = router