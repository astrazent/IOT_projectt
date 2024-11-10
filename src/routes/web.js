const express = require('express');
const router = express.Router(); // dùng để định nghĩa route
const {getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, unlockByFinger, unlockByPassword, unlockHistory, getListFinger, getListOwner, addNewFinger, addNewFingerDB, deleteFinger, deleteFingerDB, updatePassword, updatePasswordDB} = require('../controllers/homeController');

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
router.post('/api/unlockHistory', unlockHistory);
router.get('/api/getListFinger', getListFinger);
router.post('/api/arduino/deleteFinger', deleteFinger);
router.post('/api/deleteFingerDB', deleteFingerDB);
router.get('/api/getListOwner', getListOwner);
router.get('/api/arduino/addNewFinger', addNewFinger);
router.post('/api/addNewFingerDB', addNewFingerDB);
router.post('/api/arduino/updatePassword', updatePassword);
router.post('/api/updatePasswordDB', updatePasswordDB);

module.exports = router; // export default