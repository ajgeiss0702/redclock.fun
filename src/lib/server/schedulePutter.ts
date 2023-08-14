import type {ScheduleTimes, SchoolData} from "$lib/countdown/countdown-utils";


export async function putSchedule(user: User, schools: KVNamespace, school: string, newSchedule: ScheduleTimes | undefined, type: string, extra?: string) {
    const existing = await schools.getWithMetadata<SchoolData, SchoolData>(school, {type: 'json'});

    if(!existing.value) throw new Error("School does not exist!");

    let schedule = existing.value;
    if(type == "normal") {
        if(!newSchedule) throw new Error("Cannot remove normal schedule!");
        schedule.normal = newSchedule;
    } else if(type == "date" && extra) {
        if(!newSchedule) {
            delete schedule.specials.date[extra];
        } else {
            schedule.specials.date[extra] = newSchedule;
        }
    } else if(type == "day" && extra) {
        if(!newSchedule) {
            delete schedule.specials.day[extra];
        } else {
            schedule.specials.day[extra] = newSchedule;
        }
    } else {
        throw new Error("Invalid type! " + type);
    }

    await Promise.all([
        schools.put("zzz:backup:" + school + ":" + Date.now(), JSON.stringify(schedule), {
            metadata: {
                ...existing.metadata,
                changedBy: user,
                dateChanged: Date.now()
            },
            expirationTtl: 3 * 365 * 24 * 60 * 60
        }),
        schools.put(school, JSON.stringify(schedule), {metadata: existing.metadata})
    ])
}