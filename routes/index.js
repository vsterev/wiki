const { Router } = require('express')
const articleController = require('../controllers/article')
const authController = require('../controllers/authentication')
const auth = require('../utils/auth')
const router = Router()

router.get('/', auth(false), articleController.get.index)
router.get('/article/create', auth(), articleController.get.create)
router.post('/article/create', auth(), articleController.post.create)
router.get('/article/all', auth(false), articleController.get.all)
router.get('/article/search', auth(), articleController.get.search)
router.get('/article/:id', auth(), articleController.get.details)

router.get('/user/login', authController.get.login)
router.post('/user/login', authController.post.login)
router.get('/user/register', authController.get.register)
router.post('/user/register', authController.post.register)
router.get('/user/logout', auth(), authController.get.logout)
router.get('/article/edit/:id', auth(), articleController.get.edit)
router.post('/article/edit/:id', auth(), articleController.post.edit)

router.get('/article/delete/:id', auth(), articleController.get.delete)
router.all('*', auth(false), articleController.get.notFound)

module.exports = router