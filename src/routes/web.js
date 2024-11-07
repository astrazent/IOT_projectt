const express = require('express');
const router = express.Router(); // dùng để định nghĩa route
const {getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, unlockByFinger, unlockByPassword, getListFinger, addNewFinger, deleteFinger, updatePassword} = require('../controllers/homeController');

//test
// router.get('/', getHomepage);
router.post('/createuser', getInfo);
router.post('/postCreateUser', getCreateUser);
router.get('/abc', getABC);
router.get('/update/:id', getUpdatePage);
router.get('/', getIotHomePage);

//mock api
router.post('/api/unlockByFinger', unlockByFinger);
router.post('/api/unlockByPassword', unlockByPassword);
router.post('/api/getListFinger', getListFinger);
router.post('/api/addNewFinger', addNewFinger);
router.post('/api/deleteFinger/:id', deleteFinger);
router.post('/api/updatePassword', updatePassword);

module.exports = router; // export default