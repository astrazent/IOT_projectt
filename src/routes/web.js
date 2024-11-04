const express = require('express');
const router = express.Router(); // dùng để định nghĩa route
const {getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage} = require('../controllers/homeController');

// router.get('/', getHomepage);
router.post('/createuser', getInfo);
router.post('/postCreateUser', getCreateUser);
router.get('/abc', getABC);
router.get('/update/:id', getUpdatePage);
router.get('/', getIotHomePage);

module.exports = router; // export default