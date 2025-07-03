const mongoose = require('mongoose');
const { Schema } = mongoose;
const reservationSeatSchema = new Schema({
    reservationId: {
        type: Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true
    },
    seatId: {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    }
}, { timestamps: true },
 {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


const ReservationSeat = mongoose.model('ReservationSeat', reservationSeatSchema);
module.exports = ReservationSeat;