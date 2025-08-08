const express =require('express');
const router = express();

router.use(express.json());

const path = require('path');
// file uploading functions
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() +'-'+file.originalname;
        cb(null, name)
    }
})

const upload = multer({storage:storage});

module. exports = router;