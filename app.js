var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config()
const routes = require('./src/routes/index')
const errorHandler = require('./src/middleware/error.middleware')

// Swagger config
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./api.yaml')


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Register routes
app.use('/api/v1', routes)

app.use(errorHandler)

module.exports = app;
