const express = require('express');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./swaggerOptions');
const multer = require('multer');

const cors = require('cors');
const specs = swaggerJsdoc(swaggerOptions);


// Routes imports
const authRoutes = require('./Routes/authRoutes');
const SeatRoutes = require('./Routes/SeatRoutes');
const UserRoutes = require('./Routes/UserRoutes');
const MovieRoutes = require('./Routes/MovieRoutes');
const ShowTimeRoutes = require('./Routes/showTimeRoutes');
const ReservationRoutes = require('./Routes/ReservationٌRoutes');


const app = express();
app.use(cors());



// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/showtimes', ShowTimeRoutes);
app.use('/api/v1/movies', MovieRoutes);
app.use('/api/v1/seats', SeatRoutes);
app.use('/api/v1/reservations', ReservationRoutes);
app.use('/posters', express.static(path.join(__dirname, 'posters')));
module.exports = app;
