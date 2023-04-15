import {browser} from "$app/environment";
import {getScheduleCode, getSchoolCode} from "$lib/utils";
import {e, h} from "./utils.js";


let lastReload = -1;

export function report() {
    fetch('https://api.redclock.fun/checkin/'+getSchoolCode()+'/'+getScheduleCode(), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            key: e(h() + "|" + getSchoolCode() + "|" + getScheduleCode()),
            id: localStorage.id,
            tab: localStorage.tabId,
            desktop: false,
            host: location.host
        })
    })
        .then(r => r.json())
        .then((data) => {
            localStorage.id = data.id;
            console.debug(data);
            if(lastReload >= 0) {
                if(lastReload < data.rel) {
                    console.log("Reload number is higher than before! Reloading..");
                    location.href = "";
                } else if(lastReload > data.rel && data.rel !== 0) {
                    console.log("Reload number was reset and is now higher than 0! Reloading..");
                    location.href = "";
                }
            }
            lastReload = data.rel;


            if(data.message) {
                recieveMessage(data.message)
            }
        })
}

function recieveMessage(message) {
    console.log("Received message: " + message);
    /*$('body').append(`
    <div class="alert alert-info alert-dismissible fade show" role="alert" style='position: absolute;left:1em;bottom:1em;color:black;'>
      <span style="color:black;font-size:1.5em;">Message from website admin</span>
      <hr>
      <span id="adminmessagebox" style="color:black;"></span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true" style="color:black;">&times;</span>
      </button>
    </div>
    `);
    $('#adminmessagebox').text(message);*/
}

if(browser) {
    setInterval(report, 30e3);
    setTimeout(report, 1e3);

    // if this user doesn't already have an id, report twice since registration is ignored
    if(!localStorage.id) {
        setTimeout(report, 2e3);
    }
}
