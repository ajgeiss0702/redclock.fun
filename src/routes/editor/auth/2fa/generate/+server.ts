import type {RequestHandler} from "@sveltejs/kit";
import {text} from "@sveltejs/kit";

import * as OTPAuth from "otpauth";
import {generateRandomBase32, getTotp} from "$lib/server/2fa";


export const GET = (async () => {
    let totp = getTotp("64IYEBPMOCQYRE5JZURSJGAP")

    const token = totp.generate();

    return text(totp.toString() + "\n\n" + token + "\nvalid: " + totp.validate({token, window: 1}));
}) satisfies RequestHandler;

const encoder = new TextEncoder()

