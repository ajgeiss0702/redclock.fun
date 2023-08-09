import {encode} from "hi-base32";
import * as OTPAuth from "otpauth";

export function generateRandomBase32() {
    const buffer = crypto.getRandomValues(new Uint8Array(15));
    return encode(buffer).replace(/=/g, "").substring(0, 24);
}

export function getTotp(secret: string) {
    return new OTPAuth.TOTP({
        issuer: "RedClock",
        label: "Red Clock Editor",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret
    });
}

export function getUrl(secret: string) {
    return getTotp(secret).toString()
}

export function validate(secret: string, token: string, window = 1) {
    const totp = getTotp(secret);
    return totp.validate({token, window})
}