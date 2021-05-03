import { TimeStamp } from "./time_stamp.js";

export class TimePath {
    private label: string;
    // in seconds
    // null when without start or end
    private start: number | null;
    private end: number | null;
    // null when this path is not a branch of a different path
    private parent_path: TimePath | null;
    private start_in_parent: number | null;
    // gets defined in tie_up if necessary
    private parent_time_stamp: TimeStamp | null = null;
    // private child_paths: TimePath[] = [];
    // sorted at all time
    private time_stamps: TimeStamp[] = [];

    ////////////
    // render //
    ////////////
    // relative to origin of parent path or global origin if root path
    // <- for this path and all children
    path_y: number | null = null;
    // relative to this path's origin
    start_y: number | null = null;
    // null if root path
    connect_up: boolean | null = null;

    constructor(
        label: string,
        start: number | null = null,
        end: number | null = null,
        parent_path: TimePath | null = null,
        start_in_parent: number | null = null
    ) {
        this.label = label;
        if (start !== null && end !== null && end < start)
            throw new Error(
                `end of time path '${label}' can't be before start`
            );
        this.start = start;
        this.end = end;
        this.parent_path = parent_path;
        // no time jump if null
        this.start_in_parent =
            start_in_parent === null ? start : start_in_parent;

        if (parent_path !== null) {
            if (start === null)
                throw new Error(`branched time path '${label}' needs a start`);
        }
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
            throw new Error(
                `can't find time stamp with start of ${start}s in time path '${this.label}'`
            );
        return match;
    }
    get_parent_time_stamp(): TimeStamp | null {
        return this.parent_time_stamp;
    }

    // connect to parent branch at specified location
    tie_up(): void {
        // no tie up needed <- no parent path
        if (this.parent_path === null || this.start_in_parent === null) return;
        this.parent_time_stamp = this.parent_path.get_time_stamp(
            this.start_in_parent
        );
        this.parent_time_stamp.add_child_path(this);
        if (!this.parent_time_stamp.no_width())
            throw new Error(
                `start and end of branching time stamp '${this.parent_time_stamp.get_label()}' has to be the same to tie up time path '${this.label
                }'`
            );
    }

    add_time_stamp(time_stamp: TimeStamp): void {
        this.time_stamps.push(time_stamp);
        if (this.start !== null && time_stamp.get_start() < this.start)
            throw new Error(
                `start of time stamp '${time_stamp.get_label()}' needs to be at or after start of time path '${this.label
                }'`
            );
        if (this.end !== null && time_stamp.get_end() > this.end)
            throw new Error(
                `end of time stamp '${time_stamp.get_label()}' needs to be at or before end of time path '${this.label
                }'`
            );
        this.time_stamps.sort((a, b): number => {
            return a.get_start() - b.get_start();
        });
    }

    ///////////////
    // rendering //
    ///////////////
    // return added height -> space between path_y and bound belongs to this path
    // go_up -> allocate space just above or below path_y
    calculate_positions(
        height_per_path: number,
        path_y: number,
        go_up: boolean
    ): number {
        // todo: store connection type

        // this much space is required by this path herself
        // low bound is fixed if above, else upper bound fixed
        // other bound gets moved away from the start depending on amount of recursive child paths
        let upper_bound: number;
        let lower_bound: number;
        if (go_up) {
            upper_bound = path_y - height_per_path;
            lower_bound = path_y;
        } else {
            upper_bound = path_y;
            lower_bound = path_y + height_per_path;
        }

        // go through all child paths
        let idx = 0;
        for (let time_stamp of this.time_stamps)
            for (let child_time_path of time_stamp.get_children_paths()) {
                if (idx % 2) {
                    // start at bottom and go down
                    let added_height = child_time_path.calculate_positions(height_per_path, lower_bound, false);
                    if (go_up) {
                        // move everything up
                        // todo: add enum for movement direction
                        this.move(added_height, true);
                        // lower bound is fixed
                    }
                    // upper bound fixed
                    lower_bound += added_height;
                } else {
                    // start at top and go up
                    let added_height = child_time_path.calculate_positions(height_per_path, upper_bound, true);
                    if (!go_up) {
                        this.move(added_height, false);
                    }
                    upper_bound -= added_height;
                }
                ++idx;
            }
        this.path_y = lower_bound;
        return lower_bound - upper_bound;
    }
}
