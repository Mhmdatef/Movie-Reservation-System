const showTimeController = require('../Controllers/ShowTimeController');
const express = require('express');
const router = express.Router();
const middleware = require('../middleware/protect');

/**
 * @swagger
 * tags:
 *   name: ShowTimes
 *   description: ShowTime management
 */

/**
 * @swagger
 * /api/v1/showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all showtimes
 *   post:
 *     summary: Create a new showtime
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - showDate
 *               - showTime
 *             properties:
 *               movieId:
 *                 type: string
 *               showDate:
 *                 type: string
 *                 format: date
 *               showTime:
 *                 type: string
 *                 example: "20:00"
 *     responses:
 *       201:
 *         description: Showtime created successfully
 */
router
  .route('/')
  .get(middleware.userProtect, showTimeController.getAllShowTimes)
  .post(middleware.userProtect, showTimeController.createShowTime);

/**
 * @swagger
 * /api/v1/showtimes/{id}:
 *   get:
 *     summary: Get showtime by ID
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime data
 *       404:
 *         description: Showtime not found
 *   patch:
 *     summary: Update showtime by ID
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               showDate:
 *                 type: string
 *                 format: date
 *               showTime:
 *                 type: string
 *                 example: "20:00"
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       404:
 *         description: Showtime not found
 *   delete:
 *     summary: Delete showtime by ID
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Showtime ID
 *     responses:
 *       204:
 *         description: Showtime deleted successfully
 *       404:
 *         description: Showtime not found
 */
router
  .route('/:id')
  .get(middleware.userProtect, showTimeController.getShowTime)
  .patch(middleware.userProtect, showTimeController.updateShowTime)
  .delete(middleware.userProtect, showTimeController.deleteShowTime);

module.exports = router;
