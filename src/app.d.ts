// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
        user: User | null,
        addTiming: (timing: TimingEntry) => void
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

            KV_ANALYTICS?: AnalyticsEngineDataset;

            D1DB: D1Database;
            SESSION_STORE: KVNamespace;
            CACHE: KVNamespace;
            SCHOOLS: KVNamespace;
            DISTRICTS: KVNamespace;
            QUOTE_SUGGESTIONS: KVNamespace;
            SCHEDULE_BUCKET: R2Bucket;
            DURABLE: DurableObjectNamespace;
        };
        context?: {
            /**
             * Waits for the promise to complete without blocking.
             * @param promise The promise that is ensured completion
             */
            waitUntil: (promise: Promise) => void
        }
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
    name: string,
    has2fa?: boolean
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

type TimingEntry = {
    id: string,
    duration: number,
    description?: string
}