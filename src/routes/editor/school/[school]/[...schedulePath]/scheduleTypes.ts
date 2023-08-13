export const scheduleTypes: {[key: string]: ScheduleType} = {
    normal: {
        description: "The \"normal\" schedule is the schedule that Red Clock will follow if there are no \"special\" schedules to follow."
    },
    "specials/day": {
        description: "The special day schedules are schedules that are followed on specific days of the week (for example, weekends)"
    },
    "specials/date": {
        description: "The special date schedules are schedules that are followed on specific dates"
    }
}

type ScheduleType = {
    description: string
}