import type {PageLoad} from "./$types"

export const load = (async ({fetch}) => {
    return {
        value: await fetch("https://schedules.redclock.fun/test")
            .then(r => r.text())
    }
}) satisfies PageLoad