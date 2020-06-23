const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title !'],
        unique: [true, 'Title should be unique !'],
        minlength: [5, 'Title should contain minimum 5 characters !']
        // match: [/^(\w\s?){4,}$/, 'Name should contains not less than 4 english letter, numbers and whitespase!']
    },
    description: {
        type: String,
        required: [true, 'Please enter description !'],
        minlength: [20, 'It is allow minimum 20 characters!']
    } || 'No description',
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date
    }
})

module.exports = mongoose.model('Article', articleSchema);