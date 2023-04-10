import { dev } from "$app/environment";
import type {ScheduleTimes} from "../countdown/countdown-utils";
import { devSchedule, devSchedules } from "./devData";

export async function getScheduleNames(school: string): Promise<{ [key: string]: string }> {
    if(dev) {
        return devSchedules;
    }
    throw new Error("Not implemented");
}

export async function getNormalSchedule(school: string): Promise<ScheduleTimes> {
    if(dev) {
        return devSchedule;
    }
    throw new Error("Not implemented");
}