import type { PageLoad } from "./$types";
import {browser} from "$app/environment";
import {getCookie} from "$lib/cookieUtils";
import {getNextClass} from "../../../lib/countdown/countdown";
import {scheduleExists, schoolExists} from "../../../lib/countdown/countdown-utils";
import {redirect} from "@sveltejs/kit";

export let prerender = false;

export const load = (async ({params, url}) => {
    let school;
    let schedule;
    if(browser) {
        school = url.searchParams.get("school") ?? localStorage.school ?? getCookie("school");
        schedule = url.searchParams.get("schedule") ?? localStorage.schedule ?? getCookie("schedule");
    } else {
        // @ts-ignore
        school = url.searchParams.get("school") ?? params.__c_school;
        // @ts-ignore
        schedule = url.searchParams.get("schedule") ?? params.__c_schedule;
    }

    if(!school) {
        console.log("School is falsy! Redirecting", school)
       throw redirect(302, "/schools");
    }
    if(!schedule) {
        throw redirect(302, "/schedules");
    }

    if(!(await schoolExists(school))) {
        throw redirect(302, "/schools?reselect");
    }
    if(!(await scheduleExists(school, schedule))) {
        throw redirect(302, "/schedules?reselect");
    }

    return {
        school,
        schedule,
        next: await getNextClass(school, schedule)
    }
}) satisfies PageLoad;