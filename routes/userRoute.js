const express =require('express');
const router = express();
router.use(express.json());
const path = require('path');
const {registerValidator, forgotPasswordValidator, sendMailVerificationValidator} = require('../helper/validation')
const userController = require('../controllers/userController');


const rateLimit = require('express-rate-limit');

const resendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 3 requests per window
  message: 'Too many verification requests, please try again later'
});
// file uploading functions
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: (req, file, cb) => {
        const name = Date.now() +'-'+file.originalname;
        cb(null, name)
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false)
    }
}
const upload = multer({
    storage:storage,
    fileFilter: fileFilter
});

router.post('/register', upload.single('image'), registerValidator, userController.userRegister);
router.post('/forgot-password', forgotPasswordValidator, userController.forgotPassword);
router.post('/send-mail-verification', resendLimiter, sendMailVerificationValidator, userController.sendMailVerification);
module. exports = router;