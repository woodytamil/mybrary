const express = require('express');
const router = express.Router();
const Author = require('../modals/author');
// All authers
router.get('/',async (req,res) => {
    let searchOption = {}
    if(req.query.name !=null && req.query !==""){
        searchOption.name = new RegExp(req.query.name,"i")
    }
    try{
        const authors = await Author.find(searchOption)
        res.render('authors/index',{
            authors: authors,
            searchOptions : req.query
        })
    }catch{
        res.redirect('/')
    }
    
})

// New Author
router.get('/new',(req,res) => {
    res.render('authors/new',{author: new Author()})
})
// Create Author
router.post('/', async (req,res) => {
    const author = new Author({
        name: req.body.name.trim()
    })
    try{
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    }catch{
        res.render('authors/new',{
            author: author,
            errorMessage:"Error creating Author"
        })
    }
})

module.exports = router