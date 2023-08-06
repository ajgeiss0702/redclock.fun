import {dev} from "$app/environment";

export async function getUser(env: App.Platform["env"], id: number): Promise<User | null> {
    if(!env?.D1DB) {
        console.warn("Unable to get user because D1DB is unavailable");
        return null;
    }
    const {name, username} = (await (
        env.D1DB.prepare("select name,username from users where id=?")
            .bind(id)
            .first()
    ) ?? {}) as {name?: string, username?: string};

    if(!name && !username) return null;

    return { id, username, name } as User
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
        user: Number(sessionUser)
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

    return await getUser(env, Number(session.user));
}

export async function getPermissions(env: App.Platform["env"], userId: number): Promise<string[]> {
    if(dev) {
        return [
            "*"
        ];
    }

    if(!env?.D1DB) {
        return [];
    }

    const permissions = (
        await env.D1DB.prepare("select permission from user_permissions where user_id=?")
        .bind(userId)
        .all()
    ).results.map(value => value.permission as string);

    return permissions;
}

export async function hasPermission(env: App.Platform["env"], userId: number, permission: string) {
    let permissions = await getPermissions(env, userId);

    let lastFragment: string;
    if (permission.includes(".")) {
        lastFragment = permission.substring(0, permission.lastIndexOf(".")) + ".*";
    } else {
        lastFragment = permission;
    }

    return (
        permissions.includes("*") ||
            permissions.includes(lastFragment) ||
            permissions.includes(permission)
    );
}