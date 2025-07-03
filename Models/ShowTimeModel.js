const mongoose = require('mongoose');
const { Schema } = mongoose;
const ShowTimeSchema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    hall: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
        required: true
    },
    showDate: {
        type: Date,
        
        required: true}
    ,
    showTime: {
        type: String,
        required: true
    }
}
, { timestamps: true });
const ShowTime = mongoose.model('ShowTime', ShowTimeSchema);
module.exports = ShowTime;