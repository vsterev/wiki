const userModel = require('./user')
const articleModel = require('./article');
const tokenBlacklistModel = require('./token-blacklist')
module.exports = { articleModel, userModel, tokenBlacklistModel }