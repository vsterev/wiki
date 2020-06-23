const { Router } = require('express')
const courseController = require('../controllers/course')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/', auth(false), courseController.get.index)
router.get('/home', auth(false), courseController.get.index)
router.all('/home/*', auth(false), courseController.get.notFound)
// router.all('*', auth(false), courseController.get.notFound)

module.exports = router