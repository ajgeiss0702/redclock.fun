import {exec} from 'child_process';

console.log("Installing required packages");
exec("npm i && npm run build", () => {
    import("./build-node/index.js");
})