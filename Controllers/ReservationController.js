const Reservation = require('../Models/ReservationModel');
const User = require('../Models/UserModel');
const ShowTime = require('../Models/ShowTimeModel');
const Seat= require('../Models/SeatModel');
const ReservationSeat = require('../Models/ReservationSeatModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const userId = req.user._id; // get user ID from the token
    const { showTimeId, seatsIds } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const seats = await Seat.find({ _id: { $in: seatsIds }, showTimeId });
    if (seats.length !== seatsIds.length) {
      return res.status(404).json({ message: 'One or more seats not found for this showtime' });
    }

    for (const seat of seats) {
      if (seat.isreserved) {
        return res.status(400).json({ message: `Seat ${seat.seatNumber} is already reserved` });
      }
    }

    const totalPrice = seats.reduce((acc, seat) => acc + seat.price, 0);

    await Seat.updateMany(
      { _id: { $in: seatsIds } },
      { $set: { isreserved: true } }
    );

    const reservation = await Reservation.create({
      userId,
      showTimeId,
      reservationDate: new Date(),
      totalPrice,
      seatsIds
    });

    const reservationSeats = seats.map(seat => ({
      reservationId: reservation._id,
      seatId: seat._id
    }));
    await ReservationSeat.insertMany(reservationSeats);

    res.status(201).json({
      status: 'success',
      data: reservation
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id; // هنا برضو نجيب اليوزر من التوكن

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reservation = await Reservation.findOne({ userId })
      .populate({
        path: 'showTimeId',
        select: 'hall showDate showTime',
        populate: { path: 'movieId', select: 'title description' }
      });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const reservationSeats = await ReservationSeat.find({ reservationId: reservation._id })
      .populate({
        path: 'seatId',
        select: 'seatNumber price'
      });

    if (reservationSeats.length === 0) {
      return res.status(404).json({ message: 'No seats found for this reservation' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: reservationSeats.map(rs => ({
        price_data: {
          currency: 'usd',
          product_data: {
            movie_description: reservation.showTimeId.movieId.description,
            name: `Seat ${rs.seatId.seatNumber} for ${reservation.showTimeId.movieId.title} in Hall ${reservation.showTimeId.hall} on ${reservation.showTimeId.showDate} at ${reservation.showTimeId.showTime}`,
          },
          unit_amount: rs.seatId.price * 100,
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/api/v1/reservations/payment-success?reservationId=${reservation._id}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
    });

    res.status(200).json({
      status: 'success',
      sessionId: session.id,
      sessionUrl: session.url
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { reservationId } = req.query;

    const reservation = await Reservation.findByIdAndUpdate(reservationId, {
      paymentStatus: 'completed'
    }, { new: true });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment completed successfully',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId).populate('showTimeId');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed reservation' });
    }

    if (new Date(reservation.showTimeId.showDate) < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel a reservation for a past showtime' });
    }

    // Update seats to mark them as available
    await Seat.updateMany(
      { _id: { $in: reservation.seatsIds } },
      { $set: { isReserved: false } }
    );

    // Delete the reservation
    await Reservation.findByIdAndDelete(reservationId);

    res.status(200).json({
      status: 'success',
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.removeSeatFromReservation = async (req,res)=>{
reservation=await Reservation.findById(req.params.reservationId)
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const seatId = req.body.seatId;
  const seatIndex = reservation.seatsIds.indexOf(seatId);
    
  if (seatIndex === -1) {
    return res.status(404).json({ message: 'Seat not found in this reservation' });
  }
  if (reservation.paymentStatus==="completed"){
        return res.status(404).json({ message: 'you can not remove seat from completed payment reservation ' });

  }

  reservation.seatsIds.splice(seatIndex, 1);
  
  await reservation.save();

  // Update the seat to mark it as available
  await Seat.findByIdAndUpdate(seatId, { isreserved: false });

  res.status(200).json({
    status: 'success',
    message: 'Seat removed from reservation successfully',
    data: reservation 
  });
}
