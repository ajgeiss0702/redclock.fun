import {error, type RequestEvent} from "@sveltejs/kit";
import {dev} from "$app/environment";

const cacheTime = 20 * 60 * 1000;


const accounts = [
    "698923a1672a28fdabe4c0d6a23a7fa3", // bill
    "bf26c7abb25893e59cc5a0afeb62b36c", // ajgeiss72
    "f2cfe4c7ea4ff8ab12b151b45c9723a0" // aiden
];

let lastAccount = 0;

let lastFetch: {[index: string]: number} = {};
let lastFetchData: {[index: string]: any} = {};

export async function GET({params, url}: RequestEvent) {
    let schoolCode: string = params.school || "";

    if(!schoolCode) {
        throw error(400, "No school provided");
    }

    let response;

    lastFetch[schoolCode] = lastFetch[schoolCode] || 0;

    // each school's weather will be cached (but not when we have ?nocache in dev)
    if(Date.now() - lastFetch[schoolCode] < ((dev && url.searchParams.get("nocache") != null) ? 0 : cacheTime)) {
        response = {
            cached: true,
            lastFetch: lastFetch[schoolCode],
            ...lastFetchData[schoolCode]
        };
    } else {
        lastFetch[schoolCode] = Date.now();


        lastAccount++;
        if(lastAccount >= accounts.length) {
            lastAccount = 0
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
                ...lastFetchData[schoolCode]
            };
        } else {
            response = {
                account: accounts[lastAccount].substring(0, 2),
                weatherData
            }

            lastFetchData[schoolCode] = response;
        }
    }

    return new Response(JSON.stringify(response), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}