export function GET() {
    let start = Date.now();
    let dateString = new Date().toString();
    return new Response(String(dateString) + "\noog",
        {
            headers: {
                "Server-Timing": "hello;desc=\"hello there, general kenobi\";dur=0, dateString;dur=" + (Date.now() - start)
            }
        });
}