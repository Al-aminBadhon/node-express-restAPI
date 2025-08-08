const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const userRegister = async(req, res) => {

    try{
        const {name, email, mobile, password } = req.body;

        const isExist = await user.findOne({email});
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