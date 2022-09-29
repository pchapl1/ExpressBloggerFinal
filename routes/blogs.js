
const { uuid } = require('uuidv4');
var express = require('express');
var router = express.Router();

const {db} = require("../mongo")

var { validateBlogData } = require('../validations/blogs.js');
const { application } = require('express');

router.get('/all1', async function(req, res, next){

    const allBlogs = await db().collection("blogs").findOne({
        author: 'bill'
    })
    console.log(`blogs: ${allBlogs}`)
    res.json({
        success:true,
        blogs: allBlogs
    })
})


router.get('/get-one/:blogToGet', async function(req, res, next) {
    try {

        // get the blog id from request parameter
        const blogId = req.params.blogToGet
        
        // const blogId = 'dcc2102d-a20a-4765-8dc4-9079af4fdc9b'

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


router.put('/update-one/:id', async function(req, res, next){
    console.log('put request, update one')

    try {
        
        const id = req.params.id

        if (!id){
            res.json({
                success: false,
                message: "you must provide an ID"
            })
            return
        }
        let foundBlog = await db().collection("blogs").findOne({
            id: id
        })

        if (!foundBlog) {
            res.json({
                success: false,
                message: "Blog not found"
            })
        }

        // create a deep copy of the original blog
        let tempBlogData = JSON.parse(JSON.stringify(foundBlog))

        if (req.body.title){
            tempBlogData.title = req.body.title
        }
        if (req.body.text){
            tempBlogData.text = req.body.text
        }
        if (req.body.author){
            tempBlogData.author = req.body.author
        }
        if (req.body.email){
            tempBlogData.email = req.body.email
        }
        if (req.body.categories){
            tempBlogData.categories = req.body.categories
        }
        if (req.body.starRating){
            tempBlogData.starRating = req.body.starRating
        }

        tempBlogData.lastModified = new Date()

        // set updateBlog to true to send to validation
        const updatingBlog = true

        const blogDataCheck = validateBlogData(tempBlogData, updatingBlog)
 
        console.log('blog validated')

        if (blogDataCheck.isValid === false) {
            res.json({
                success: false,
                message: blogDataCheck.message
            })
            return
        }

        await db().collection("blogs").updateOne({
            id: id,

        },{$set:{
            id : tempBlogData.id,
            createdAt: tempBlogData.createdAt,
            title: tempBlogData.title,
            text: tempBlogData.text,
            email: tempBlogData.email,
            author: tempBlogData.author,
            categories: tempBlogData.categories,
            starRating: tempBlogData.starRating,
            lastModified: new Date()
        }}, function(err, res){
            if (err) {
                throw(err)
            }
        })



        res.json({
            success: true,
            message: "Blog updated successfully!",
            oldBlog: foundBlog,
            newBlog: tempBlogData
        })

    } catch (e) {
        console.log(e)
    }

})

router.delete('/delete-one/:id', async function(req, res, next){
    try {
        const id = req.params.id

        if (!id) {
            res.json({
                success: false,
                message: "You must provide an ID"
            })
            return
        }
    
        const foundBlog = db().collection("blogs").findOne({
            id: id
        })

        if (!foundBlog) {
            res.json({
                success: false,
                message: 'Blog not found'
            })
            return
        }

        await db().collection("blogs").deleteOne({
            id: id
        })

        res.json({
            success: true,
            message: "Blog successfully deleted"
        })

    } catch (e) {
       res.json({
        success: false,
        message: "something went wrong"
       }) 
    }


})

module.exports = router;