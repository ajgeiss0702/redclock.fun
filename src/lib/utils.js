export function copy(v) {
    switch (typeof v) {
        case 'object':
            return JSON.parse(JSON.stringify(v));
        case 'string':
            return new String(v).toString();
        case 'number':
            return Number(new Number(v));
        default:
            var tmp = [v];
            return JSON.parse(JSON.stringify(tmp))[0];
    }
}

export function httpGet(url, callback = false) {
    if(!callback) {
        return new Promise((resolve, reject) => {
            let xmlhttp = new XMLHttpRequest();
            try {
                xmlhttp.onreadystatechange = function() {
                    if(xmlhttp.readyState === 4 && xmlhttp.responseText !== 24) {
                        console.debug("[httpGet] xmlhttp: %o", xmlhttp)
                        if(xmlhttp.status === 0) {
                            reject(new Error("Network error occured"))
                        }
                        resolve(xmlhttp.responseText);
                    }
                };
                xmlhttp.onerror = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Unknown error occured"));
                    }
                };
                xmlhttp.onabort = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Request aborted"));
                    }
                };
                xmlhttp.ontimeout = () => {
                    if(xmlhttp.readyState === 4) {
                        reject(new Error("Request timed out"));
                    }
                }
                xmlhttp.open("get", url, true);
                xmlhttp.send();
            } catch(e) {
                reject(e);
            }
        })
    } else {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(xmlhttp.readyState === 4 && xmlhttp.responseText !== 24) {
                callback(xmlhttp.responseText);
            } else if(xmlhttp.readyState === 4) {
                console.error("Failed to get '" + url + "'! ("+xmlhttp.readyState+")");
            }
        };
        xmlhttp.open("get", url, true);
        xmlhttp.send();
    }
}
