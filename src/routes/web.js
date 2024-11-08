const express = require('express');
const router = express.Router(); // dùng để định nghĩa route
const {getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, unlockByFinger, unlockByPassword, getListFinger, addNewFinger, addNewFingerDB, deleteFinger, deleteFingerDB, updatePassword, updatePasswordDB} = require('../controllers/homeController');

//test
// router.get('/', getHomepage);
router.post('/createuser', getInfo);
router.post('/postCreateUser', getCreateUser);
router.get('/abc', getABC);
router.get('/update/:id', getUpdatePage);
router.get('/', getIotHomePage);

//mock api
router.post('/api/arduino/unlockByFinger', unlockByFinger);
router.post('/api/arduino/unlockByPassword', unlockByPassword);
router.get('/api/getListFinger', getListFinger);
router.post('/api/arduino/deleteFinger/:id', deleteFinger);
router.get('/api/arduino/addNewFinger', addNewFinger);
router.post('/api/addNewFingerDB', addNewFingerDB);
router.post('/api/deleteFingerDB/:id', deleteFingerDB);
router.post('/api/arduino/updatePassword', updatePassword);
router.post('/api/updatePasswordDB', updatePasswordDB);

module.exports = router; // export default