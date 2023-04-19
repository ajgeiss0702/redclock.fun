import {building, dev} from "$app/environment";
import { env } from "$env/dynamic/private";
import type {ServerLoad} from "@sveltejs/kit";
import {error} from "@sveltejs/kit";
import type { Abortable } from "events";
import type { PathLike, Mode, RmDirOptions, RmOptions, ObjectEncodingOptions, BufferEncodingOption, StatOptions, Stats, BigIntStats, StatFsOptions, StatsFs, BigIntStatsFs, TimeLike, OpenMode, OpenDirOptions, Dir, WatchOptions, CopyOptions } from "fs";
import type { FileHandle, FlagAndOpenMode, FileChangeInfo } from "fs/promises";
import type { Stream } from "stream";


let vpnIp = "149.28.87.60";
let vpnIpv6 = "2001:19f0:6001:1ca2:5400:3ff:feac:5f2e";

let fs: { mkdir: any; readdir: any; default?: any; access?: (path: PathLike, mode?: number | undefined) => Promise<void>; copyFile?: (src: PathLike, dest: PathLike, mode?: number | undefined) => Promise<void>; open?: (path: PathLike, flags?: string | number | undefined, mode?: Mode | undefined) => Promise<FileHandle>; rename?: (oldPath: PathLike, newPath: PathLike) => Promise<void>; truncate?: (path: PathLike, len?: number | undefined) => Promise<void>; rmdir?: (path: PathLike, options?: RmDirOptions | undefined) => Promise<void>; rm?: (path: PathLike, options?: RmOptions | undefined) => Promise<void>; readlink?: { (path: PathLike, options?: ObjectEncodingOptions | BufferEncoding | null | undefined): Promise<string>; (path: PathLike, options: BufferEncodingOption): Promise<Buffer>; (path: PathLike, options?: string | ObjectEncodingOptions | null | undefined): Promise<string | Buffer>; }; symlink?: (target: PathLike, path: PathLike, type?: string | null | undefined) => Promise<void>; lstat?: { (path: PathLike, opts?: (StatOptions & { bigint?: false | undefined; }) | undefined): Promise<Stats>; (path: PathLike, opts: StatOptions & { bigint: true; }): Promise<BigIntStats>; (path: PathLike, opts?: StatOptions | undefined): Promise<Stats | BigIntStats>; }; stat?: { (path: PathLike, opts?: (StatOptions & { bigint?: false | undefined; }) | undefined): Promise<Stats>; (path: PathLike, opts: StatOptions & { bigint: true; }): Promise<BigIntStats>; (path: PathLike, opts?: StatOptions | undefined): Promise<Stats | BigIntStats>; }; statfs?: { (path: PathLike, opts?: (StatFsOptions & { bigint?: false | undefined; }) | undefined): Promise<StatsFs>; (path: PathLike, opts: StatFsOptions & { bigint: true; }): Promise<BigIntStatsFs>; (path: PathLike, opts?: StatFsOptions | undefined): Promise<StatsFs | BigIntStatsFs>; }; link?: (existingPath: PathLike, newPath: PathLike) => Promise<void>; unlink?: (path: PathLike) => Promise<void>; chmod?: (path: PathLike, mode: Mode) => Promise<void>; lchmod?: (path: PathLike, mode: Mode) => Promise<void>; lchown?: (path: PathLike, uid: number, gid: number) => Promise<void>; lutimes?: (path: PathLike, atime: TimeLike, mtime: TimeLike) => Promise<void>; chown?: (path: PathLike, uid: number, gid: number) => Promise<void>; utimes?: (path: PathLike, atime: TimeLike, mtime: TimeLike) => Promise<void>; realpath?: { (path: PathLike, options?: ObjectEncodingOptions | BufferEncoding | null | undefined): Promise<string>; (path: PathLike, options: BufferEncodingOption): Promise<Buffer>; (path: PathLike, options?: ObjectEncodingOptions | BufferEncoding | null | undefined): Promise<string | Buffer>; }; mkdtemp?: { (prefix: string, options?: ObjectEncodingOptions | BufferEncoding | null | undefined): Promise<string>; (prefix: string, options: BufferEncodingOption): Promise<Buffer>; (prefix: string, options?: ObjectEncodingOptions | BufferEncoding | null | undefined): Promise<string | Buffer>; }; writeFile?: (file: PathLike | FileHandle, data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | Stream, options?: BufferEncoding | (ObjectEncodingOptions & { mode?: Mode | undefined; flag?: OpenMode | undefined; } & Abortable) | null | undefined) => Promise<void>; appendFile?: (path: PathLike | FileHandle, data: string | Uint8Array, options?: BufferEncoding | (ObjectEncodingOptions & FlagAndOpenMode) | null | undefined) => Promise<void>; readFile?: { (path: PathLike | FileHandle, options?: ({ encoding?: null | undefined; flag?: OpenMode | undefined; } & Abortable) | null | undefined): Promise<Buffer>; (path: PathLike | FileHandle, options: BufferEncoding | ({ encoding: BufferEncoding; flag?: OpenMode | undefined; } & Abortable)): Promise<string>; (path: PathLike | FileHandle, options?: BufferEncoding | (ObjectEncodingOptions & Abortable & { flag?: OpenMode | undefined; }) | null | undefined): Promise<string | Buffer>; }; opendir?: (path: PathLike, options?: OpenDirOptions | undefined) => Promise<Dir>; watch?: { (filename: PathLike, options: "buffer" | (WatchOptions & { encoding: "buffer"; })): AsyncIterable<FileChangeInfo<Buffer>>; (filename: PathLike, options?: BufferEncoding | WatchOptions | undefined): AsyncIterable<FileChangeInfo<string>>; (filename: PathLike, options: string | WatchOptions): AsyncIterable<FileChangeInfo<Buffer>> | AsyncIterable<FileChangeInfo<string>>; }; cp?: (source: string | URL, destination: string | URL, opts?: CopyOptions | undefined) => Promise<void>; constants?: any; } | undefined = undefined;

if(env.NODE_ENV && !building) {
    (async () => {
        // fs = await import("fs/promises");
        fs.mkdir("quote-requests").then(() => {}).catch(() => {});
    })()
}


export const load = (async ({getClientAddress}) => {
    if(!env.NODE_ENV || building) throw error(500, "Invalid environment!")
    console.log("got " + getClientAddress())
    let admin = dev || getClientAddress() === vpnIp || getClientAddress() === vpnIpv6;
    let list: string[] = [];
    if(admin) {
        // if(!fs) fs = await import("fs/promises");
        list = await fs.readdir("quote-requests")
    }
    return {
        list,
        admin
    }
}) satisfies ServerLoad