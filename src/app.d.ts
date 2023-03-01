// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
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
