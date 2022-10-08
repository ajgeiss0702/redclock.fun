import {_GET} from './utils.js';
import {recalcCdd} from '$lib/countdown/countdown.js';

type Setting = {
    content: boolean,
    description: string,
    display: string
}


let rmtvSpecials: {[key: string]: boolean} = {
    enableWeather: false
}

export let settings: {[key: string]: Setting} = {};

export function get(name: string): boolean|undefined {
    if(typeof settings[name] == 'undefined') {
        return undefined;
    }
    if(name == 'animatedWeatherIcon' && _GET('layout') != null) {
        return false;
    }
    if(Object.keys(rmtvSpecials).indexOf(name) != -1 && _GET('rmtv') == "undefined") {
        return rmtvSpecials[name];
    }
    if(name == "enableWeather" && _GET("school") != null) {
        return false;
    }
    return settings[name].content;
}

export function getSetting(name: string): Setting|undefined {
    return settings[name];
}

export function set(name: string, content: boolean): void {
    if(typeof settings[name] == 'undefined') {
        throw new Error("Setting " + name + " does not exist!");
    }

    console.log("[Settings] "+name+": "+settings[name].content+"  -->  "+content)
    settings[name].content = content;
    save();

    if(name == "skipAHour") {
        recalcCdd();
    }
    if(name == "festive") {
        //TODO: festiveness
    }

    settings = settings;
}

export function create(name: string, defaultContent: boolean, display: string, description: string): void {
    if(typeof settings[name] == 'undefined') {
        settings[name] = {
            content: defaultContent,
            display: display,
            description: description
        }
        save();
    } else {
        settings[name].display = display;
        settings[name].description = description;
        save();
    }
}

export function save(): void {
    if(typeof localStorage == "undefined") return;
    localStorage.settings = JSON.stringify(settings);
}

export function load(): void {
    if(typeof localStorage == "undefined" || typeof localStorage.settings == 'undefined') return;

    let raw: {[key: string]: Setting & {desc?: string}} = JSON.parse(localStorage.settings);

    for (let rawKey in raw) {
        let setting = raw[rawKey];

        if(typeof settings[rawKey] != "undefined") {
            settings[rawKey].content = setting.content;
            continue;
        }
        console.log(rawKey + ":" + typeof settings[rawKey])

        if(setting.desc) {
            setting.description = setting.desc;
        }

        settings[rawKey] = setting;
    }

}

if(typeof window !== "undefined") {
    // @ts-ignore
    window.setFromCheckbox = (element: HTMLInputElement) => {
        console.log(element)
        // @ts-ignore
        set(element.dataset.setting, element.checked);
    }
}

load()