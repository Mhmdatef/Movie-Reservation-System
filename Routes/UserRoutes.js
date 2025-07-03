const UserController = require('../Controllers/UserController');
const express = require('express');
const middleware = require('../middleware/protect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router
  .route('/')
  .get(middleware.userProtect, middleware.restrictTo('admin'), UserController.getAllUsers);

/**
 * @swagger
 * /api/v1/users/myReservations:
 *   get:
 *     summary: Get my reservations
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reservations
 */
router
  .route('/myReservations')
  .get(middleware.userProtect, UserController.getUserReservations);

/**
 * @swagger
 * /api/v1/users/makeAdmin/{id}:
 *   patch:
 *     summary: Make a user an admin
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User promoted to admin
 *       404:
 *         description: User not found
 */
router
  .route('/makeAdmin/:id')
  .patch(middleware.userProtect, middleware.restrictTo('admin'), UserController.MakeUserAdmin);

/**
 * @swagger
 * /api/v1/users/getuserdata:
 *   get:
 *     summary: Get my user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router
  .route('/getuserdata')
  .get(middleware.userProtect, UserController.getUser);

/**
 * @swagger
 * /api/v1/users/updatePassword:
 *   patch:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmNewPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router
  .route('/updatePassword')
  .patch(middleware.userProtect, UserController.updatePassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router
  .route('/:id')
  .patch(middleware.userProtect, UserController.updateUser)
  .delete(middleware.userProtect, middleware.restrictTo('admin'), UserController.deleteUser);

module.exports = router;
