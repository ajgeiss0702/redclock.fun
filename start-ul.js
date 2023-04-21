import {exec} from 'child_process';
import express from 'express';
import bcrypt from 'bcrypt';

let server;

let hashedToken = "$2b$15$/wfCzPaons.QED6QVROqe.idCnHwN6GylRHfZzsAFXf1IW8KaiAqW";

console.log("Building server");
exec("npm run build", async (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr)

    const app = express();

    // note to self: custom endpoints go HERE, not below

    app.post("/update", (req, res) => {
        let token = req.get("X-Gitlab-Token");
        res.set("Content-Type", "application/json");
        if(typeof token === "string" && bcrypt.compareSync(token, hashedToken)) {
            update(res);
        } else {
            res.status(401).json({error: true, message: "Invalid Token"});
            res.end();
        }
    })

    app.get('/healthcheck', (req, res) => {
        res.end('ok');
    });

    app.use((req, res, next) => {
        if(req.path.indexOf("api") !== -1) {
            res.set("Access-Control-Allow-Origin", "*");
        }
        next();
    })

    const handler = (await import('./build-node/handler.js')).handler;
    app.use(handler);


    server = app.listen(3000, () => {
        console.log('Listening on port 3000');
    });

    process.on('SIGTERM', () => {
        console.debug('SIGTERM signal received: closing HTTP server')
        server.close(() => {
            console.debug('HTTP server closed')
        })
    })
});

function update(res) {
    console.log("\nUpdating from repository..\n");
    exec("git pull", (out, err) => {
        res.json({error: false, response: "Success"});
        res.end();
        console.log(out);
        if(err) {
            console.log(err);
        }
        console.log("Updated from repository, finishing requests..");
        setTimeout(() => {
            process.exit();
        }, 10e3)
        server.close(() => {
            console.log("Finished all requests, shutting down.");
            process.exit();
        })
    })
}