import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createServer } from "./utils/createServer";
import { debug } from "console";
import * as http from "http";

// Initialize dotenv
dotenv.config();

/**
 * Initialize database
 */
const prisma = new PrismaClient();

/**
 * Create App
 */
const app = createServer(prisma);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
    const ports = parseInt(val, 10);

    if (isNaN(ports)) {
        // named pipe
        return val;
    }

    if (ports >= 0) {
        // port number
        return ports;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr?.port;
    console.log('Listening on ' + bind);
    debug('Listening on ' + bind);
}

/**
 * Graceful shutdown of server
 */
process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        debug('HTTP server closed');
    });
});