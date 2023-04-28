import type {RequestHandler} from "@sveltejs/kit";
import {dev} from "$app/environment";
import {error, json} from "@sveltejs/kit";
import { pbkdf2 } from "$lib/server/crypto-pbkdf2";

export const GET = (async ({platform}) => {
    if(!dev) throw error(503, "Not available in production environment");

    const schools = platform?.env?.SCHOOLS;
    const districts = platform?.env?.DISTRICTS;

    if(!schools || !districts) {
        throw error(500, "Missing school or district KV!")
    }

    schools.put("rmhs", JSON.stringify(
        {
            "normal": {
                "5lunch": {
                    "A hour starts": [0, 7, 15, 0],
                    "A hour ends": [0, 8, 5, 0],
                    "1st hour starts": [0, 8, 15, 0],
                    "1st hour ends": [0, 9, 5, 0],
                    "2nd hour starts": [0, 9, 11, 0],
                    "2nd hour ends": [0, 10, 1, 0],
                    "3rd hour starts": [0, 10, 7, 0],
                    "3rd hour ends": [0, 10, 35, 0],
                    "4th hour starts": [0, 10, 41, 0],
                    "4th hour ends": [0, 11, 31, 0],
                    "lunch starts": [0, 11, 37, 0],
                    "lunch ends": [0, 12, 27, 0],
                    "6th hour starts": [0, 12, 33, 0],
                    "6th hour ends": [0, 13, 23, 0],
                    "7th hour starts": [0, 13, 29, 0],
                    "7th hour ends": [0, 14, 19, 0],
                    "8th hour starts": [0, 14, 25, 0],
                    "8th hour ends": [0, 15, 15, 0]
                },
                "6lunch": {
                    "A hour starts": [0, 7, 15, 0],
                    "A hour ends": [0, 8, 5, 0],
                    "1st hour starts": [0, 8, 15, 0],
                    "1st hour ends": [0, 9, 5, 0],
                    "2nd hour starts": [0, 9, 11, 0],
                    "2nd hour ends": [0, 10, 1, 0],
                    "3rd hour starts": [0, 10, 7, 0],
                    "3rd hour ends": [0, 10, 35, 0],
                    "4th hour starts": [0, 10, 41, 0],
                    "4th hour ends": [0, 11, 31, 0],
                    "5th hour starts": [0, 11, 37, 0],
                    "5th hour ends": [0, 12, 27, 0],
                    "lunch starts": [0, 12, 33, 0],
                    "lunch ends": [0, 13, 23, 0],
                    "7th hour starts": [0, 13, 29, 0],
                    "7th hour ends": [0, 14, 19, 0],
                    "8th hour starts": [0, 14, 25, 0],
                    "8th hour ends": [0, 15, 15, 0]
                },
                "rmtv": {
                    "A hour starts": [0, 7, 15, 0],
                    "A hour ends": [0, 8, 5, 0],
                    "1st hour starts": [0, 8, 15, 0],
                    "1st hour ends": [0, 9, 5, 0],
                    "2nd hour starts": [0, 9, 11, 0],
                    "2nd hour ends": [0, 10, 1, 0],
                    "3rd hour starts": [0, 10, 7, 0],
                    "3rd hour ends": [0, 10, 35, 0],
                    "4th hour starts": [0, 10, 41, 0],
                    "4th hour ends": [0, 11, 31, 0],
                    "5th hour starts": [0, 11, 37, 0],
                    "5th hour ends": [0, 12, 27, 0],
                    "6th hour starts": [0, 12, 33, 0],
                    "6th hour ends": [0, 13, 23, 0],
                    "7th hour starts": [0, 13, 29, 0],
                    "7th hour ends": [0, 14, 19, 0],
                    "8th hour starts": [0, 14, 25, 0],
                    "8th hour ends": [0, 15, 15, 0]
                }
            }
        }
    ), {
        metadata: {
            logo: "https://redclock.fun/img/schools/rmhs.webp",
            display: "Red Mountain High School",
            offset: 1,
            tz: 420,
            schedules: {
                "5lunch": "5th hour lunch",
                "6lunch": "6th hour lunch"
            },
            district: "mpsaz"
        }
    });

    districts.put("mpsaz", JSON.stringify(
        {off: {}}
    ), {
        metadata: {
            logo: "https://redclock.fun/img/districts/mpsaz.webp",
            display: "Mesa Public Schools"
        }
    });

    return json({done: true});
}) satisfies RequestHandler