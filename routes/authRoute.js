const express =require('express');
const router = express();
router.use(express.json());

const userConrtroller = require('../controllers/userController');

router.get('/mail-verification', userConrtroller.mailVerification)
module. exports = router;