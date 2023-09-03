const router = require('express').Router();
const { body } = require('express-validator');

const { saveProfile, getProfile } = require('./controller/userProfile');

router.get('/api/getUserData', [body('address')], getProfile);
router.post('/api/updateUserData', [body('address', 'userName', 'userBio', 'userAvatar', 'userBanner')], saveProfile);

module.exports = router;
