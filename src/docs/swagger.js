const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinn API',
      version: '1.0.0',
      description: 'API de agendamento inteligente de consultas (estudo)',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' }
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
    security: [{ bearerAuth: [] }],
  },
  apis: ['src/routes/*.js', 'src/schemas/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;


