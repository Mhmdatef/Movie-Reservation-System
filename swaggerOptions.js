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
            url: 'http://localhost:2000', 
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { 
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
