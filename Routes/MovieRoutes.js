// routes/movieRoutes.js
const express = require('express');
const MovieController = require('../Controllers/MovieController');
const middleware = require('../middleware/protect');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management with APIFeatures (Filtering, Sorting, Pagination)
 */

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Get all movies with filtering, sorting, and pagination
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by movie genre (e.g., genre=Drama)
 *       - in: query
 *         name: director
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by movie director
 *       - in: query
 *         name: cast
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by movie cast member (e.g., cast=Tom Hanks)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         required: false
 *         description: Sort by fields (e.g., sort=duration,-rating)
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         required: false
 *         description: Select specific fields (e.g., fields=title,genre)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of movies per page
 *     responses:
 *       200:
 *         description: List of all movies with APIFeatures
 */
router
  .route('/')
  .get(middleware.userProtect, MovieController.getAllMovies)
  .post(
    middleware.userProtect,
    middleware.restrictTo('admin'),
    MovieController.uploadPoster,
    MovieController.resizePoster,
    MovieController.createMovie
  );

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie data
 *       404:
 *         description: Movie not found
 *   patch:
 *     summary: Update movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               rating:
 *                 type: number
 *               director:
 *                 type: string
 *               cast:
 *                 type: array
 *                 items:
 *                   type: string
 *               posterImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *   delete:
 *     summary: Delete movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       204:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 */
router
  .route('/:id')
  .get(middleware.userProtect, MovieController.getMovie)
  .patch(
    middleware.userProtect,
    middleware.restrictTo('admin'),
    MovieController.uploadPoster,
    MovieController.resizePoster,
    MovieController.updateMovie
  )
  .delete(
    middleware.userProtect,
    middleware.restrictTo('admin'),
    MovieController.deleteMovie
  );

module.exports = router;
