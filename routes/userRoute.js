const express =require('express');
const router = express();
router.use(express.json());
const path = require('path');
const {registerValidator} = require('../helper/validation')
const userController = require('../controllers/userController');
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

module. exports = router;