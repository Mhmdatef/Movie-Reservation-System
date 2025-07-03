const SeatController = require('../Controllers/SeatController');
const express = require('express');
const middleware = require('../middleware/protect');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat management
 */

/**
 * @swagger
 * /api/v1/seats:
 *   post:
 *     summary: Create a new seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showTimeId
 *               - seatNumber
 *               - price
 *             properties:
 *               showTimeId:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Seat created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', middleware.userProtect, middleware.restrictTo('admin'), SeatController.createSeat);

/**
 * @swagger
 * /api/v1/seats/Available/{showTimeId}:
 *   get:
 *     summary: Get available seats for a specific showtime
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showTimeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: List of available seats
 *       404:
 *         description: Showtime not found
 */
router.get('/Available/:showTimeId', middleware.userProtect, SeatController.getAvailableSeats);

/**
 * @swagger
 * /api/v1/seats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all seats
 */
router.get('/', middleware.userProtect, middleware.restrictTo('admin'), SeatController.getAllSeats);

/**
 * @swagger
 * /api/v1/seats/{id}:
 *   get:
 *     summary: Get seat by ID
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Seat ID
 *     responses:
 *       200:
 *         description: Seat data
 *       404:
 *         description: Seat not found
 *   patch:
 *     summary: Update seat by ID
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Seat ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: string
 *               price:
 *                 type: number
 *               isreserved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *       404:
 *         description: Seat not found
 *   delete:
 *     summary: Delete seat by ID
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Seat ID
 *     responses:
 *       204:
 *         description: Seat deleted successfully
 *       404:
 *         description: Seat not found
 */
router
  .route('/:id')
  .get(middleware.userProtect, SeatController.getSeat)
  .patch(middleware.userProtect, middleware.restrictTo('admin'), SeatController.updateSeat)
  .delete(middleware.userProtect, middleware.restrictTo('admin'), SeatController.deleteSeat);

module.exports = router;
