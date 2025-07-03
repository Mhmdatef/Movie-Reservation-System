// swaggerOptions.js
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Movie Reservation System API',
            version: '1.0.0',
            description: 'API documentation for the Movie Reservation System',
    },
    servers: [
        {
            url: 'http://localhost:2000', // تأكد إن ده البورت اللي انت مشغل عليه السيرفر
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { // اسم السيكيورتي اللي هيتحط في التاجات بتاعت الـ routes
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    },
    apis: ['./Routes/*.js'], 
};

module.exports = options;
