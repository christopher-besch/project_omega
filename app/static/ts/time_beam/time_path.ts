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
    // gets defined later on if necessary
    private parent_time_stamp: TimeStamp | null = null;
    // sorted at all time
    private time_stamps: TimeStamp[] = [];

    ////////////
    // render //
    ////////////
    private x: number | null = null;
    private y: number | null = null;
    private height: number | null = null;

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

    // connect to parent branch
    tie_up(): void {
        // no tie up needed <- no parent path
        if (this.parent_path === null || this.start_in_parent === null) return;
        this.parent_time_stamp = this.parent_path.get_time_stamp(
            this.start_in_parent
        );
        this.parent_time_stamp.add_child_path(this);
        if (!this.parent_time_stamp.no_width())
            throw new Error(
                `start and end of branching time stamp '${this.parent_time_stamp.get_label()}' has to be the same to tie up time path '${
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

    ///////////////
    // rendering //
    ///////////////
    calculate_height(height_per_path: number): number {
        this.height = height_per_path;
        for (let time_stamp of this.time_stamps)
            for (let child_time_path of time_stamp.get_children_paths())
                this.height += child_time_path.calculate_height(
                    height_per_path
                );
        return this.height;
    }
}
