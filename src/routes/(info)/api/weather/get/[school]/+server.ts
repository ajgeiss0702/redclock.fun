import {error, type RequestEvent} from "@sveltejs/kit";
import {dev} from "$app/environment";

const cacheTime = 20 * 60 * 1000;


const accounts = [
    "e500ac4707e2524efaf07a2a96ce92f9", // bill
    "bf26c7abb25893e59cc5a0afeb62b36c", // ajgeiss72
    "f2cfe4c7ea4ff8ab12b151b45c9723a0" // aiden
];

let lastAccount = Math.floor(Math.random() * accounts.length);

let lastFetch: {[index: string]: number} = {};
let lastFetchData: {[index: string]: any} = {};

export async function GET({params, url, platform}: RequestEvent) {
    let kv = platform?.env?.CACHE;

    let schoolCode: string = params.school || "";

    if(!schoolCode) {
        throw error(400, "No school provided");
    }

    if(kv) {
        lastAccount = Number(await kv.get("rc-weather:lastAccount")) || lastAccount
    }

    let response;

    if(kv) {
        lastFetch[schoolCode] = Number(await kv.get("rc-weather:lastFetch:" + schoolCode)) || 0;
    } else {
        lastFetch[schoolCode] = lastFetch[schoolCode] || 0;
    }

    // each school's weather will be cached (but not when we have ?nocache in dev)
    if(Date.now() - lastFetch[schoolCode] < ((dev && url.searchParams.get("nocache") != null) ? 0 : cacheTime)) {
        response = {
            cached: true,
            lastFetch: lastFetch[schoolCode],
            ...(
                kv ? await kv.get("rc-weather:lastFetchData:" + schoolCode, {type: "json"}) :
                    lastFetchData[schoolCode]
            )
        };
    } else {
        lastFetch[schoolCode] = Date.now();


        lastAccount++;
        if(lastAccount >= accounts.length) {
            lastAccount = 0
        }
        if(kv) {
            await kv.put("rc-weather:lastAccount", lastAccount+"")
        }

        let weatherData = await fetch("https://api.openweathermap.org/data/2.5/onecall?appid=" + accounts[lastAccount] + "&lat=33.435016&lon=-111.673358&units=imperial")
            .then(r => r.json())

        if(weatherData.message) {
            console.warn({account: accounts[lastAccount].substring(0, 5), weatherData});
            lastFetch[schoolCode] = (Date.now() - cacheTime) + 5000;
            response = {
                cached: "error",
                weatherAPIError: weatherData.message,
                lastFetch: lastFetch[schoolCode],
                ...(
                    kv ? await kv.get("rc-weather:lastFetchData:" + schoolCode, {type: "json"}) :
                        lastFetchData[schoolCode]
                )
            };
        } else {
            response = {
                account: accounts[lastAccount].substring(0, 2),
                weatherData
            }

            lastFetchData[schoolCode] = response;
            await kv.put("rc-weather:lastFetchData:" + schoolCode, JSON.stringify(response));
        }

        if(kv) {
            await kv.put("rc-weather:lastFetch:" + schoolCode, lastFetch[schoolCode]+"");
        }
    }

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}