export function load({ fetch }) {
    return fetch("https://temp-schedules.redclock.fun/schedule.php?school=list")
        .then((response) => response.json())
        .catch(e => {
            return {
                "error": {
                    "display": "Error: " + e
                }
            }
        })
}