const { articleModel, userModel } = require('../models')

module.exports = {
    get: {
        index: (req, res, next) => {
            const user = req.user;
            articleModel.find()
                .then(articles => {
                    // if (!user) {
                    //     let sorted = [...courses].sort((a, b) => { return b.users.length - a.users.length })
                    //     const topCourses = sorted.slice(0, 3);
                    //     res.render('indexNotAuth.hbs', { title: 'Course | Home page', courses: topCourses, user });
                    //     return;
                    // }

                    // let date = courses.createdAt.toString().slice(0,21) //da se naprawvi datata
                    // const sorted = [...courses].sort((a, b) => {
                    //     if (b.createdAt === a.createdAt) {
                    //         return a.title.localeCompare(b.title)
                    //     }
                    //     return b.createdAt - a.createdAt
                    // })
                    let sorted = [...articles].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3).map(r => { r.description = r.description.substring(0, 100); return r })
                    res.render('index.hbs', { title: 'Articles | Home page', articles: sorted, user });
                    return;
                })
                .catch(err => console.log(err))
        },
        all: (req, res, next) => {
            const user = req.user;
            articleModel.find()
                .then(articles => res.render('all', { user, title: 'All articles | Wiki', articles }))
                .catch(err => console.log(err))
        },
        create: (req, res, next) => {
            const user = req.user;
            res.render('create.hbs', { title: 'Create course | Wiki article', user })
        },
        details: (req, res, next) => {
            const id = req.params.id;
            const user = req.user || 'undefined';
            articleModel.findById(id)
                .then(article => {
                    article.isCreator = false;
                    if (article.author.toString() === user.id) {
                        article.isCreator = true;
                    }
                    // if (course.users.includes(user.id.toString())) {
                    //     course.isEnrolled = true;
                    // }
                    res.render('article.hbs', { title: 'Article details', article, user })
                })
                .catch(err => {
                    res.render('404.hbs', { msg: err })
                    console.log(err)
                }
                )
        },
        delete: (req, res, next) => {
            const user = req.user;
            Promise.all(
                [
                    articleModel.findByIdAndDelete(req.params.id),
                    userModel.findOneAndUpdate(user.id, { $pull: { articles: req.params.id } })
                ])
                .then(([artDel, usrDel]) => {
                    res.redirect('/')
                })
                .catch(err => next(err))
        },
        notFound: (req, res, next) => {
            const user = req.user;
            res.render('404.hbs', { title: 'course | Not found page', user })
        },
        edit: (req, res, next) => {
            const articleId = req.params.id;
            const user = req.user;
            articleModel.findById(articleId)
                .then((article) => res.render('edit', { title: 'Edit article', user, article }))
                .catch(err => console.log(err))
        },
        search: (req, res, next) => {
            const user = req.user;
            const { searchStr } = req.query;
            articleModel.find({ title: { $regex: searchStr, $options: 'i' } })
                .then((articles) => {
                    res.render('search', { user, articles, searchStr })
                })
                .catch(err => console.log(err))
        }
    },
    post: {
        create: (req, res, next) => {
            const { title = null, description = null } = req.body;
            const creatorId = req.user.id;
            const user = req.user;

            articleModel
                .create(
                    { title, description, author: user.id, createdAt: Date.now() }
                )
                .then(article => {
                    const pushed = Promise.all([
                        article,
                        userModel.findByIdAndUpdate((user.id), { $push: { articles: article.id } })
                    ])

                }
                )
                .then(() => {
                    res.redirect('/');
                    return
                    // console.log('Article', article)
                    // console.log('Pushed', pushed)
                })
                .catch(err => {
                    if (err.name == 'ValidationError') {
                        res.render('create.hbs', { title: 'Create course', user, errors: err.errors })
                        return;
                    }
                    next(err);
                    console.log(err)
                })
        },
        edit: (req, res, next) => {
            const articleId = req.params.id;
            const user = req.user;
            const { description } = req.body;

            articleModel.findByIdAndUpdate(articleId, { description }, { runValidators: true })
                .then(article => res.redirect(`/article/${article.id}`))
                .catch(err => {
                    if (err.name == 'ValidationError') {
                        articleModel.findById(articleId)
                            .then(article => res.render('edit.hbs', { title: 'Article course', user, article, errors: err.errors }))
                            .catch(err => console.log(err))
                        return;
                    }
                    next(err);
                    console.log(err)
                })
        },
        search: (req, res, next) => {
            const user = req.user;
            // const title = req.query.title;
            const { searchStr } = req.body
            articleModel.find({ title: { $regex: searchStr, $options: 'i' } })
                .then((articles) => {
                    res.render('search', { user, articles, searchStr })
                })
                .catch(err => console.log(err))
        }
    }
}

