const { Router } = require('express')
const courseController = require('../controllers/course')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/login', authController.get.login)
router.post('/login', authController.post.login)
router.get('/register', authController.get.register)
router.post('/register', authController.post.register)
router.get('/logout', auth(), authController.get.logout)
router.all('*', auth(false), courseController.get.notFound)
module.exports = router