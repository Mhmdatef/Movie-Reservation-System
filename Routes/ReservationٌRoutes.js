const ReservationController = require('../Controllers/ReservationController');
const express = require('express');
const middleware = require('../middleware/protect');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */

/**
 * @swagger
 * /api/v1/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
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
 *               - seatsIds
 *             properties:
 *               showTimeId:
 *                 type: string
 *               seatsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', middleware.userProtect, ReservationController.createReservation);

/**
 * @swagger
 * /api/v1/reservations/pay:
 *   post:
 *     summary: Create Stripe checkout session for reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout session created
 *       404:
 *         description: Reservation not found
 */
router.post('/pay', middleware.userProtect, ReservationController.createCheckoutSession);

/**
 * @swagger
 * /api/v1/reservations/payment-success:
 *   get:
 *     summary: Update reservation payment status after successful payment
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reservationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       404:
 *         description: Reservation not found
 */
router.get('/payment-success', middleware.userProtect, ReservationController.updatePaymentStatus);

/**
 * @swagger
 * /api/v1/reservations/cancel/{reservationId}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Cannot cancel a completed or expired reservation
 *       404:
 *         description: Reservation not found
 */
router.delete('/cancel/:reservationId', middleware.userProtect, ReservationController.cancelReservation);

module.exports = router;
