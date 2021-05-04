import { TimePath } from "./time_path.js";

export class TimeStamp {
    private label: string;
    private path: TimePath;
    // in seconds
    private start: number;
    private end: number;
    // all paths that have this their start_time_stamp
    private children_paths: TimePath[] = [];

    constructor(label: string, time_path: TimePath, start: number, end = start) {
        this.label = label;
        if (end < start) throw new Error(`end of time stamp '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.path = time_path;
        time_path.add_time_stamp(this);
    }

    get_label(): string {
        return this.label;
    }
    get_path(): TimePath {
        return this.path;
    }
    get_start(): number {
        return this.start;
    }
    get_end(): number {
        return this.end;
    }
    no_width(): boolean {
        return this.start == this.end;
    }
    get_child_paths(): TimePath[] {
        return this.children_paths;
    }

    add_child_path(time_path: TimePath): void {
        this.children_paths.push(time_path);
    }
}
