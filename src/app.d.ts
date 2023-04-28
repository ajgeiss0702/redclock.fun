// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
        user: User | null
    }
	// interface PageData {}
	// interface PageError {}
    interface Platform {
        env?: {
            FUNC_ANAL: {
                writeDataPoint: (data: {
                    'blobs': string[],
                    'doubles': number[],
                    'indexes': string[]
                }) => void
            };

            D1DB: D1Database;
            SESSION_STORE: KVNamespace;
            CACHE: KVNamespace;
            SCHEDULE_BUCKET: R2Bucket;
            QUOTE_SUGGESTIONS: KVNamespace;
            SCHOOLS: KVNamespace;
            DISTRICTS: KVNamespace;
        };
    }
}

declare interface Window {
    updateTheme: () => void;
    shouldSyncThemeWithSystem: () => boolean;
    getThemeName: () => string;
    updateLayout: () => void;
    setLayout: (layoutName: string) => void;
    getCookie: (cname: string) => string;
    setCookie: (cname: string, cvalue: string, exdays: number) => void;
    _GET: (parameterName: string) => string;
}

type User = {
    id: number,
    username: string,
    name: string
}

type Session = {
    id: string,
    user: number
}

type EditorSchool = {
    code: string,
    timezone: number,
    logo: string,
    display: string,
    offset: number,
    district?: string
}

type EditorDistrict = {
    code: string,
    logo: string,
    display: string
}

type KVListResponse = {
    keys: {
        name: string,
        metadata: {
            submitted: number,
            [key: string]: string
        }
    }[],
    list_complete: boolean,
    cursor: string
}