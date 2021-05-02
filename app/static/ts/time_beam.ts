import { TimePathRenderer, TimeStampRender } from "./time_beam_renderer.js";

// create TimePath objects with references to parent TimePath
// create TimeStamp object for TimePath objects
// tie up all TimeStamp objects <- requires TimeStamp object at start on parent TimePath
export class TimePath {
    private label: string;
    // in seconds
    // null when without start or end
    private start: number | null;
    private end: number | null;
    // null when this path is not a branch of a different path
    private parent_path: TimePath | null;
    // gets defined later on if necessary
    private start_time_stamp: TimeStamp | null = null;
    // sorted at all time
    private time_stamps: TimeStamp[] = [];

    private renderer: TimePathRenderer | undefined = undefined;

    constructor(
        label: string,
        start: number | null = null,
        end: number | null = null,
        parent_path: TimePath | null = null
    ) {
        this.label = label;
        if (start !== null && end !== null && end < start)
            throw new Error(`end of time path '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.parent_path = parent_path;

        if (parent_path !== null && start == null) throw new Error(`branching time path '${label}' needs a start`);
    }

    get_label(): string {
        return this.label;
    }
    has_start(): boolean {
        return this.start !== null;
    }
    has_end(): boolean {
        return this.end !== null;
    }
    get_time_stamp(start: number): TimeStamp {
        const match = this.time_stamps.find((time_stamp): boolean => {
            return time_stamp.get_start() == start;
        });
        if (match === undefined)
            throw new Error(`can't find time stamp with start of ${start}s in time path '${this.label}'`);
        return match;
    }

    // connect to parent branch
    tie_up(): void {
        // no tie up needed <- no parent path
        if (this.parent_path === null || this.start === null) return;
        this.start_time_stamp = this.parent_path.get_time_stamp(this.start);
        this.start_time_stamp.add_child_path(this);
        if (!this.start_time_stamp.no_width())
            throw new Error(
                `start and end of branching time stamp '${this.start_time_stamp.get_label()}' has to be the same to tie up time path '${
                    this.label
                }'`
            );
    }

    add_time_stamp(time_stamp: TimeStamp): void {
        this.time_stamps.push(time_stamp);
        if (this.start !== null && time_stamp.get_start() < this.start)
            throw new Error(
                `start of time stamp '${time_stamp.get_label()}' needs to be at or after start of time path '${
                    this.label
                }'`
            );
        if (this.end !== null && time_stamp.get_end() > this.end)
            throw new Error(
                `end of time stamp '${time_stamp.get_label()}' needs to be at or before end of time path '${
                    this.label
                }'`
            );
        this.time_stamps.sort((a, b): number => {
            return a.get_start() - b.get_start();
        });
    }
}

export class TimeStamp {
    private label: string;
    private time_path: TimePath;
    // in seconds
    private start: number;
    private end: number;
    // all paths that have this their start_time_stamp
    private children_paths: TimePath[] = [];

    private renderer: TimeStampRender | undefined = undefined;

    constructor(label: string, time_path: TimePath, start: number, end = start) {
        this.label = label;
        if (end < start) throw new Error(`end of time stamp '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.time_path = time_path;
        time_path.add_time_stamp(this);
    }

    get_label(): string {
        return this.label;
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
    get_children_paths(): TimePath[] {
        return this.children_paths;
    }

    add_child_path(time_path: TimePath): void {
        this.children_paths.push(time_path);
    }
}

export function load_time_paths(input_json: string): TimePath[] {
    const input = JSON.parse(input_json) as {
        time_paths: {
            label: string;
            // null -> no start
            start: number | null;
            // null -> no end
            end: number | null;
            // null -> not branch of other path
            parent_path_id: number | null;
        }[];
        time_stamps: {
            label: string;
            path_id: number;
            start: number;
            // null -> same as start
            end: number | null;
        }[];
    };

    // time paths
    let time_paths: TimePath[] = [];
    for (let time_path of input.time_paths)
        if (time_path.parent_path_id === null)
            time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end));
        // with parent path
        else
            time_paths.push(
                new TimePath(time_path.label, time_path.start, time_path.end, time_paths[time_path.parent_path_id])
            );

    // time stamps
    for (let time_stamp of input.time_stamps)
        new TimeStamp(
            time_stamp.label,
            time_paths[time_stamp.path_id],
            time_stamp.start,
            time_stamp.end !== null ? time_stamp.end : time_stamp.start
        );

    // tie up
    for (let time_path of time_paths) time_path.tie_up();
    return time_paths;
}
