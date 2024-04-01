import {writable} from "svelte/store";
import {dev} from "$app/environment";
import {create, get, onChange} from "$lib/settings";


let settingCreated = false;

export const isAprilFools = writable(fool());

const startMonthDistance = 3 - new Date().getMonth() // only check if we're close to april fools
if(startMonthDistance >= 0 && startMonthDistance <= 1) {
    setInterval(checkFool, 30e3)
}

function checkFool() {
    isAprilFools.update(() => {
        return fool();
    })
}

onChange("aprilFoolsFlip", checkFool)

function fool() {
    const d = new Date();
    const result = (d.getMonth() === 3 && d.getDate() === 1) /*|| dev*/;
    if(result && !settingCreated) {
        settingCreated = true;
        create('aprilFoolsFlip', true, 'April Fools Flip', 'Don\'t be boring and un-flip the site on April Fools :/');
    }
    return result && (get("aprilFoolsFlip") ?? true);
}