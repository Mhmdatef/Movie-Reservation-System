const mongoose = require('mongoose');
const { Schema } = mongoose;
const seatSchema = new Schema({
    showTimeId: {
        type: Schema.Types.ObjectId,
        ref: 'ShowTime',
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
 isreserved: {
        type: Boolean,
        default: false
    }
    ,
    price: {
        type: Number,
        required: true
    },

}, { timestamps: true });
const Seat = mongoose.model('Seat', seatSchema);
module.exports = Seat;

