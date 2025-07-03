const showTime= require('../Models/ShowTimeModel');
const handlerFactory = require('../Controllers/handlerFactoryController');
// const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
exports.getAllShowTimes = handlerFactory.getAll(showTime,{
    path: 'movieId',
    select: ' -_id -__v'
});
exports.getShowTime = handlerFactory.getOne(showTime,{
    path: 'movieId',
    select: ' -_id -__v'
});
exports.createShowTime = handlerFactory.createOne(showTime);
exports.updateShowTime = handlerFactory.updateOne(showTime);
exports.deleteShowTime = handlerFactory.deleteOne(showTime);

