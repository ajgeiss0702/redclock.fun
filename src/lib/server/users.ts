import {dev} from "$app/environment";

export async function getUser(env: App.Platform["env"], id: number): Promise<User | null> {
    if(!env?.D1DB) {
        console.warn("Unable to get user because D1DB is unavailable");
        return null;
    }
    const {name, username} = await (
        env.D1DB.prepare("select name,username from users where id=?")
            .bind(id)
            .first()
    ) ?? {};

    if(!name && !username) return null;

    return { id, username, name }
}

export async function getSessionInfo(env: App.Platform["env"], sessionId: string): Promise<Session | null> {
    if(!env?.D1DB) {
        console.warn("Unable to check session because D1DB is unavailable");
        return null;
    }

    const sessionUser = await env.SESSION_STORE.get(sessionId);
    if(sessionUser == null) return null;

    return {
        id: sessionId,
        user: sessionUser
    }
}

export async function getUserFromSession(env: App.Platform["env"], sessionId: string | undefined | null): Promise<User | null> {
    if(!sessionId) return null;

    if(dev) return {
        id: 0,
        name: "Dev User",
        username: "DevUser"
    }
    const session = await getSessionInfo(env, sessionId);
    if(session == null) return null;

    return await getUser(env, session.user);
}