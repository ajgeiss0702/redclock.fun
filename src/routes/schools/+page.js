export async function load({ fetch }) {
    return await fetch("https://ajg0702.us/api/rmf/schedule.php?school=list").then((response) => response.json())
}