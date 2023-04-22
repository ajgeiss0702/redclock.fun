import { _GET } from "./utils";

type Setting = {
    content: boolean,
    description: string,
    display: string
}


let rmtvSpecials: {[key: string]: boolean} = {
    enableWeather: false
}

let settings: {[key: string]: Setting} = {};

export function getSettings() {
    return settings;
}

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

    let before = settings[name].content

    console.debug("[Settings] "+name+": "+settings[name].content+"  -->  "+content)
    settings[name].content = content;
    save();

    emit(name, {to: content, before: before});

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

        if(setting.desc) {
            setting.description = setting.desc;
        }

        settings[rawKey] = setting;
    }

}

if(typeof window !== "undefined") {
    // @ts-ignore
    window.setFromCheckbox = (element: HTMLInputElement) => {
        // @ts-ignore
        set(element.dataset.setting, element.checked);
    }
}

let _subscriptions: {[key: string]: any[]} = {}

export function onChange(name: string, func: any) {
    _subscriptions[name] = _subscriptions[name] || [];
    _subscriptions[name].push(func)
}
export function off(name: string, func: any){
    if(!_subscriptions[name]) return;
    _subscriptions[name] = _subscriptions[name].filter(f=>f!==func)
}
function emit(name: string, ...args: any){
    if(!_subscriptions[name]){return; }
    _subscriptions[name].forEach(f=>f(...args))
}

load()