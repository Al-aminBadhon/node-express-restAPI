const express =require('express');
const router = express();
router.use(express.json());


const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

const userConrtroller = require('../controllers/userController');

router.get('/mail-verification', userConrtroller.mailVerification)
module. exports = router;