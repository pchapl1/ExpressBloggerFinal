

const validateBlogData = (blogData) => {

    console.log('in blog validations')

    // check title is valid
    if (!blogData.title || typeof(blogData.title) != 'string' || blogData.title.length >= 30) {
        return {
            isValid : false,
            message : 'title is required, must be a string and must be less than 30 characters'
        }
    }


    // check text is valid
    if (!blogData.text || typeof(blogData.text) !== 'string') {
        return {
            isValid : false,
            message : 'text is required and must be a string.'
        }
    }

        // check author is valid
    if (!blogData.author || typeof(blogData.author) !== 'string') {
        return {
            isValid : false,
            message : 'author is required and must be a string'
        }
    }

    // check email is valid
    if (blogData.email) {
        // check email is a string
        if (typeof(blogData.email) !== 'string') {
            return {
                isValid: false,
                message: 'email must be a string'
            }
        }

        // check email only contains 1 "@" symbol
        const count = blogData.email.match(/@/g).length

        if (count > 1) {
            return {
                isValid: false,
                message: 'email must contain only 1 "@" symbol'
            }
        }
    }

    // check category is valid
    if (blogData.category && Array.isArray(blogData.category)) {

        let isArrayValid = true

        // filter out any non string entries
        blogData.category = blogData.category.filter(blog => typeof(blog) === 'string')

        if (!blogData.category.length > 0 ) {
            isArrayValid = false
        }

        if (isArrayValid === false) {
            return {
                isValid: false,
                message: 'category is invalid. '
            }
        }

    }

    // check starRating is valid
    if (blogData.starRating) {
        if (typeof(blogData.starRating) !== 'number' || blogData.starRating < 1 || blogData.starRating > 10) {
            return {
                isValid: false,
                message: "Star Rating must be a number between 1 and 10"
            }
        }
    }

    return {
        isValid : true, 
        message : "Successfully created blog!"
    }

}

module.exports = {validateBlogData}