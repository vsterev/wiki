const { Router } = require('express')
const courseController = require('../controllers/course')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/create', auth(), courseController.get.create)
router.post('/create', auth(), courseController.post.create)

router.get('/details/:id', auth(), courseController.get.details)

router.get('/search/', auth(), courseController.get.search)
router.get('/edit/:id', auth(), courseController.get.edit)
router.post('/edit/:id', auth(), courseController.post.edit)

router.get('/delete/:id', auth(), courseController.get.delete)
router.get('/enroll/:id', auth(), courseController.get.enroll)
router.all('*', auth(false), courseController.get.notFound)

module.exports = router