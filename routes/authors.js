const express = require('express');
const router = express.Router();

// All authers
router.get('/',(req,res) => {
    res.render('authors/index')
})

// New Author
router.get('/new',(req,res) => {
    res.render('authors/new')
})
// Create Author
router.post('/',(req,res) => {
    res.send('create')
})

module.exports = router