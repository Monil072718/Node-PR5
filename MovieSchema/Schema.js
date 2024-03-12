const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    title: String,
    description: String,
    release_year: Number,
    genre:String,
    rating: Number,
    image:String

}, { timestamps: true })

const MovieSchema = mongoose.model('movie', Schema)
module.exports = MovieSchema