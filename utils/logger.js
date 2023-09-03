const winston = require('winston')
const { format } = winston
const { combine, timestamp, printf, colorize } = format
const path = require('path')
const moment = require('moment-timezone'); // to format date

require('dotenv').config({ path: './config/config.env' })

//console.log(`TIMEZONE: ${process.env.TIMEZONE}`)
const now = new Date();
//console.log(now.toString());

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`
})

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    verbose: 'cyan',
    debug: 'magenta',
    silly: 'gray'
}

winston.addColors(colors)

// create a directory name based on today's date
const dateDirectory = moment().tz(process.env.TIMEZONE).format('YYYY-MM-DD')

const transports = [
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'warn.log'), level: 'warn' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'info.log'), level: 'info' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'http.log'), level: 'http' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'verbose.log'), level: 'verbose' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'debug.log'), level: 'debug' }),
    new winston.transports.File({ filename: path.join('logs', dateDirectory, 'silly.log'), level: 'silly' }),
]

if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({
        format: combine(
          colorize({ all: true, colors }), // colorize the log-level names
          timestamp({
            format: () => moment().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          }),
          myFormat
        )
    }))
}

const logger = winston.createLogger({
    levels,
    format: combine(
        timestamp({
            format: () => moment().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        }),
        myFormat
    ),
    transports
})

module.exports = logger

