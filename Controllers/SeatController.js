const Seat= require('../Models/SeatModel');
const ShowTime = require('../Models/ShowTimeModel');

const handlerFactory = require('../Controllers/handlerFactoryController');
exports.getAvailableSeats = async (req, res) => {
  try {
    const { showTimeId } = req.params;

    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      return res.status(404).json({ status: 'fail', message: 'Showtime not found' });
    }

    const availableSeats = await Seat.find({ showTimeId, isreserved: false });

    res.status(200).json({
      status: 'success',
      results: availableSeats.length,
      data: availableSeats
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.createSeat = async (req, res) => {
  try {
    const { showTimeId, seatNumber, price } = req.body;

    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const newSeat = await Seat.create({
      showTimeId,
      seatNumber,
      price,
      isReserved: false
    });

    res.status(201).json({
      status: 'success',
      data: newSeat
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
exports.getAllSeats = handlerFactory.getAll(Seat);
exports.getSeat = handlerFactory.getOne(Seat);
exports.updateSeat = handlerFactory.updateOne(Seat);
exports.deleteSeat = handlerFactory.deleteOne(Seat);









// exports.reserveSeats = async (req, res) => {
//   try {
//     const { showTimeId, seatIds } = req.body;

//     const showTime = await ShowTime.findById(showTimeId);
//     if (!showTime) {
//       return res.status(404).json({ message: 'Showtime not found' });
//     }

//     const seats = await Seat.find({ _id: { $in: seatIds }, showTimeId });
//     if (seats.length !== seatIds.length) {
//       return res.status(404).json({ message: 'One or more seats not found for this showtime' });
//     }

//     for (const seat of seats) {
//       if (seat.isReserved) {
//         return res.status(400).json({ message: `Seat ${seat.seatNumber} is already reserved` });
//       }
//     }

//     await Seat.updateMany(
//       { _id: { $in: seatIds } },
//       { $set: { isReserved: true } }
//     );

//     res.status(200).json({
//       status: 'success',
//       message: 'Seats reserved successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };