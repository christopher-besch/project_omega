import { TimeStamp } from "./time_stamp.js";

export class TimePath {
    private label: string;
    // in seconds
    // null when infinity
    private start: number | null;
    private end: number | null;
    // null when this path is not a branch of a different path -> orphan
    private parent_path: TimePath | null;
    private start_in_parent: number | null;
    // gets defined in tie_up if necessary
    private parent_time_stamp: TimeStamp | null = null;
    // null when not calculated yet
    private child_paths: TimePath[] | null = null;
    // sorted at all time
    private time_stamps: TimeStamp[] = [];

    // location of this path and all children
    path_y: number | null = null;
    // location of main path only
    main_path_y: number | null = null;

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

        if (parent_path !== null && start === null)
            throw new Error(`branched time path '${label}' needs a start`);
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
    get_child_paths(): TimePath[] {
        if (this.child_paths === null)
            throw new Error(`child_paths of path '${this.label}' is null`);
        return this.child_paths;
    }
    // relative to origin of parent path or global origin if root path
    // <- for this path and all children
    get_path_y(): number {
        if (this.path_y === null)
            throw new Error(`path_y of '${this.label}' is null`);
        return this.path_y;
    }
    // relative to this path's origin
    get_main_path_y(): number {
        if (this.main_path_y === null)
            throw new Error(`start_y of '${this.label}' is null`);
        return this.main_path_y;
    }
    is_child(): boolean {
        return this.parent_time_stamp !== null;
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
    move(amount: number, go_up: boolean): void {
        if (this.path_y === null)
            throw new Error(`path_y of '${this.label}' is null`);
        if (go_up) {
            this.path_y -= amount;
        }
        else {
            this.path_y += amount;
        }

    }
    // move this path with all children up or down
    move_line_children(amount: number, go_up: boolean): void {
        // move line
        if (this.main_path_y === null)
            throw new Error(`start_y of '${this.label}' is null`);
        if (this.child_paths === null)
            throw new Error(`child_paths of '${this.label}' is null`);
        if (go_up)
            this.main_path_y -= amount;
        else
            this.main_path_y += amount;
        // move entire children
        for (let child_path of this.child_paths) {
            child_path.move(amount, go_up);
        }
    }

    // return added height -> space between fixed_bound and bound belongs to this path
    // go_up -> allocate space just above or below fixed_bound
    // connect_up -> connect to parent path up or down
    calculate_positions(
        height_per_path: number,
        fixed_bound: number,
        go_up: boolean
    ): number {
        // this much space is required by this path herself
        // low bound is fixed if above, else upper bound fixed
        // other bound gets moved away from the start depending on amount of recursive child paths
        let upper_bound: number;
        let lower_bound: number;
        if (go_up) {
            upper_bound = fixed_bound - height_per_path;
            lower_bound = fixed_bound;
        } else {
            upper_bound = fixed_bound;
            lower_bound = fixed_bound + height_per_path;
        }
        // start at bottom
        this.main_path_y = lower_bound;

        // go through all child paths
        this.child_paths = [];
        let idx = 0;
        for (let time_stamp of this.time_stamps)
            for (let child_path of time_stamp.get_child_paths()) {
                if (idx % 2) {
                    if (go_up) {
                        // start at bottom and go up
                        let added_height = child_path.calculate_positions(height_per_path, lower_bound, true);
                        // move everything up <- things have been added below and are overlapping already added paths
                        this.move_line_children(added_height, true);
                        // lower bound fixed
                        upper_bound -= added_height;
                    } else {
                        // start at bottom and go down
                        let added_height = child_path.calculate_positions(height_per_path, lower_bound, false);
                        // everything has been added at the variable end -> nothing has to be moved
                        // upper bound fixed
                        lower_bound += added_height;
                    }
                } else {
                    if (go_up) {
                        // start at top and go up
                        let added_height = child_path.calculate_positions(height_per_path, upper_bound, true);
                        upper_bound -= added_height;
                    } else {
                        // start at top and go down
                        let added_height = child_path.calculate_positions(height_per_path, upper_bound, false);
                        this.move_line_children(added_height, false);
                        lower_bound += added_height;
                    }
                }
                this.child_paths.push(child_path);
                ++idx;
            }
        this.path_y = lower_bound;
        return lower_bound - upper_bound;
    }
}
