const express = require('express');
const router = express.Router(); // dùng để định nghĩa route
const {getHomepage, getABC, getInfo, getCreateUser, getUpdatePage, getIotHomePage, getPersonalPage, unlockByFinger, unlockByPassword, unlockHistory, getListFinger, getListOwner, addNewFinger, addNewFingerDB, deleteFinger, deleteFingerDB, updatePassword, updatePasswordDB, getListUser, getSystemID, getToggleStatus, getListDiary, getListAction} = require('../controllers/homeController');

//test
// router.get('/', getHomepage);
router.post('/createuser', getInfo);
router.post('/postCreateUser', getCreateUser);
router.get('/abc', getABC);
router.get('/update/:id', getUpdatePage);
router.get('/', getIotHomePage);
router.get('/caNhan', getPersonalPage);

//mock api
//Trang điều khiển
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

//Trang cá nhân
router.get('/api/getListUser', getListUser);
router.get('/api/arduino/getSystemID', getSystemID);
router.post('/api/getToggleStatus', getToggleStatus);
router.get('/api/getListDiary', getListDiary);
router.get('/api/getListAction', getListAction);

module.exports = router; // export default