const validator = require('express-validator');


exports.registerValidator = [
    validator.check('name', 'Name is required').not().isEmpty(),
    validator.check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: false,
    }),
    validator.check('mobile', 'Mobile num should contain 10 digits').isLength({
        min:10,
        max:10
    }),
    validator.check('password', 'password must be grater then 6 character and atleast one uppercase, lowercase, number and special character').isStrongPassword({
        minLength:6,
        minLowercase:1,
        minNumbers:1,
        minUppercase:1,
    }),
    validator.check('image').custom((value, {req}) => {
        if(!req.file) {
            return true;
        }
        if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg'){
            return true;
        }
        return false;
        
    }).withMessage('please upload image with jpg/jpeg/png format')
]
exports.forgotPasswordValidator = [
    validator.check('email', 'Valid email is required').isEmail().normalizeEmail({
        gmail_remove_dots: false,
    })
];
exports.loginValidator = [

]