const mongoose = require('mongoose');
const { Schema } = mongoose;
const RservationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showTimeId: {
        type: Schema.Types.ObjectId,
        ref: 'ShowTime',
        required: true
    }
    ,
    ReservationDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
    ,
    seatsIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    }]
}, { timestamps: true });


const Reservation = mongoose.model('Reservation', RservationSchema);
module.exports = Reservation;