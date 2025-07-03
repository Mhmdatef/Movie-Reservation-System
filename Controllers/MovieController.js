const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');
const Movie = require('../Models/MovieModel');
const handlerFactory = require('../Controllers/handlerFactoryController');
const appError = require('../utils/appError');

exports.getAllMovies = handlerFactory.getAll(Movie);
exports.deleteMovie = handlerFactory.deleteOne(Movie);
exports.getMovie = handlerFactory.getOne(Movie);
exports.createMovie = async (req, res) => {
    try {
        const newMovie = await Movie.create({
            title: req.body.title,
            description: req.body.description,
            genre: req.body.genre,
            duration: req.body.duration,
            rating: req.body.rating,
            director: req.body.director,
            cast: req.body.cast,
            posterImage: req.posterImagePath || '' // لو تم رفع صورة
        });

        res.status(201).json({
            status: 'success',
            data: newMovie
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const multerStorage = multer.memoryStorage(); 

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new appError('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPoster = upload.single('posterImage');
exports.resizePoster = (req, res, next) => {
    if (!req.file) return next();
        req.file.filename = `movie-${req.params.id}.jpeg`;
sharp(req.file.buffer)
        .resize(500, 750) // Resize to 500x750 pixels
        .toFormat('jpeg')
        .jpeg({ quality: 90 }) // Set JPEG quality to 90%
        .toFile(`./posters/movie-${req.params.id}.jpeg`, (err) => {
            if (err) {
                return next(new appError('Error processing image', 500));
            }
            next();
        });
}

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        movie.title = req.body.title || movie.title;
        movie.description = req.body.description || movie.description;
        movie.genre = req.body.genre || movie.genre;
        movie.duration = req.body.duration || movie.duration;
        movie.rating = req.body.rating || movie.rating;
        movie.director = req.body.director || movie.director;
        movie.cast = req.body.cast || movie.cast;

        if (req.file) {
            if (movie.posterImage) {
                const oldImagePath = path.join(__dirname, `../${movie.posterImage.replace(/\\/g, '/')}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

movie.posterImage = `${req.protocol}://${req.get('host')}/posters/${req.file.filename}`;
        }

        await movie.save();

        res.status(200).json({
            status: 'success',
            data: movie
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
