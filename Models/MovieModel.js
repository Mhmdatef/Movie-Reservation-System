const mongoose = require('mongoose');
const { Schema } = mongoose;
const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
  
    genre: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number, 
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    }
    ,
    director: {
        type: String,
        required: true,
        trim: true
    }
    ,
    cast:{
        type: [String],
        required: true
    }
    ,
    posterImage: {
        type: String,
        
    }
});
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;