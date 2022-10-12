import {exec} from 'child_process';
import express from 'express';

console.log("Building server");
exec("npm run build", async () => {

    const app = express();

    // note to self: custom endpoints go HERE, not below

    app.get('/healthcheck', (req, res) => {
        res.end('ok');
    });

    const handler = (await import('./build-node/handler.js')).handler;
    app.use(handler);


    const server = app.listen(3000, () => {
        console.log('Listening on port 3000');
    });

    process.on('SIGTERM', () => {
        console.debug('SIGTERM signal received: closing HTTP server')
        server.close(() => {
            console.debug('HTTP server closed')
        })
    })
})