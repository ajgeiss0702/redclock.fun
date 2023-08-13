import type {ScheduleTimes, SchoolData} from "$lib/countdown/countdown-utils";


export async function putSchedule(schools: KVNamespace, school: string, newSchedule: ScheduleTimes, type: string, extra?: string) {
    const existing = await schools.getWithMetadata<SchoolData, SchoolData>(school, {type: 'json'});

    if(!existing.value) throw Error("School does not exist!");

    let schedule = existing.value;
    if(type == "normal") {
        schedule.normal = newSchedule
    } else if(type == "date" && extra) {
        schedule.specials.date[extra] = newSchedule;
    } else if(type == "day" && extra) {
        schedule.specials.day[extra] = newSchedule;
    } else {
        throw new Error("Invalid type! " + type);
    }

    await Promise.all([
        schools.put("zzz:backup:" + school + ":" + Date.now(), JSON.stringify(schedule), {metadata: existing.metadata}),
        schools.put(school, JSON.stringify(schedule), {metadata: existing.metadata})
    ])
}