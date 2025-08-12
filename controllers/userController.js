const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('express-validator');
const mailer = require('../helper/mailer');

const userRegister = async(req, res) => {

    try{

        const isError = validator.validationResult(req);
        if(!isError.isEmpty()){
             return res.status(400).json({
            success: false,
            msg: 'Errors',
            errors: isError.array()
        });
        }
        const {name, email, mobile, password } = req.body;

        const isExist = await User.findOne({email});
        if(isExist){
            return res.status(400).json({
            success: false,
            msg: 'Email already exist'
        });
        }
        const hashdPass = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            mobile,
            password : hashdPass,
            image:'images/'+req.file.filename
        })
        const userData = await user.save();

        const msg = `<p>This is a confirmation email for user - ${userData.name} </p>. Please <a href= ${process.env.VERFICATION_LINK}${userData._id}>Verify</a> your account.`
        
        mailer.sendMail(email, 'Test Mail Verification', msg);

         return res.status(200).json({
            success: true,
            msg: 'Registration completed successfully',
            user: userData
        });
    }
    catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
        });

    }
}


module.exports = {
    userRegister
};