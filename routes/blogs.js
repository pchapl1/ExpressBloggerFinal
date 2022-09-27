
const { uuid } = require('uuidv4');
var express = require('express');
var router = express.Router();

const {db} = require("../mongo")

var { validateBlogData } = require('../validations/blogs.js')


router.get('/get-one/:blogToGet', async function(req, res, next) {
    try {

        // get the blog id from request parameter
        const blogId = req.params.blogToGet

        // if blogID not in paremeter, return error
        if (!blogId) {
            res.json({
                success: false,
                message: 'blogId must be provided in the route parameter'
            })
            return
        }

        // search the db for the blog 
        const blogPost = await db().collection("blogs").findOne({
            id: blogId
        })

        // if blog not found, return error message
        if (!blogPost) {
            console.log('blog not found')
            res.json({
                success: false,
                message: 'Blog not found'
            })
            return
        }

        res.json({
            success: true,
            post: blogPost
        })


    } catch (e) {
        console.log(`error in get one: ${e}`)
        res.json({
            success: false,
            error: e.toString()
        })
    }

});


router.post('/create-one', async function(req, res, next) {
    try {

        // get the blog from request body
        const title = req.body.title
        const text = req.body.text
        const author = req.body.author
        const email = req.body.email
        const categories = req.body.categories
        const starRating = req.body.starRating


        const blogData = {
            createdAt: new Date(),
            title,
            text,
            author,
            lastModified: new Date(),
            email,
            categories,
            starRating,
            id: uuid()
        }

        const blogDataCheck = validateBlogData(blogData)

        console.log(blogData)
        if (blogDataCheck.isValid === false) {
            res.json({
                success: false,
                message: blogDataCheck.message
            })
            return
        }

        await db().collection('blogs').insertOne(blogData)

        res.json({
            success: true,
            message: 'Blog successfully created!'
        })


    } catch (e) {
        console.log(`error in create one: ${e}`)
        res.json({
            success: false,
            error: e.toString()
        })
    }

});

module.exports = router;