<script>
    import {browser} from "$app/environment";
    import {_GET} from "$lib/utils";

    let status = "..";
    if(browser) {
        if(!_GET("id")) {
            status = "This page should be opened from the desktop app!";
        } else {
            status = "Sending your selected school and schedule to the desktop app..";
            fetch("https://api.redclock.fun/pass/" + _GET("id"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    school: localStorage.getItem("school"),
                    schedule: localStorage.getItem("schedule")
                })
            })
                .then(r => {
                    if(r.ok) {
                        status = "Your selected school and schedule has been sent to the desktop app.<br>" +
                            "You can close this tab now.";
                    } else {
                        status = "Something went wrong. Try reloading this page.";
                    }
                })
        }
    }
</script>
<div class="flex text-center h-screen items-center">
    <div class="text-center w-screen inner">
        {@html status}
    </div>
</div>