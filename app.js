const express = require('express')

const logger = require('./utils/logger')

const app = express()

const dotenv = require('dotenv')

const errorMiddleware = require('./middlewares/errorMiddleware')

const faviconMiddleware = require('./middlewares/faviconMiddleware')

// Set up config.env file variables
dotenv.config({
    path: './config/config.env',
})

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// use the ejs template engine
app.set('view engine', 'ejs')

// Setup body parser
app.use(express.json())

// No store for Cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next();
});

// Setup faviconMiddleware
faviconMiddleware(app)

app.get('/', ( req, res) => {
    res.render('index');
})

// Setup middlewares errorMiddleware
app.use(errorMiddleware)

// Starts the Server
const API_PORT = process.env.API_PORT
const server = app.listen(API_PORT, () => {
    console.log(`Time: ${new Date().toString()} => Server started at port ${API_PORT} in ${process.env.NODE_ENV} mode.`)  
    logger.info(`Time: ${new Date().toString()} => Server started at port ${API_PORT} in ${process.env.NODE_ENV} mode.`) 
})