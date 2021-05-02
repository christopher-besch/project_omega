export class TimePath {
    constructor(label, start = null, end = null, parent_path = null, start_in_parent = null) {
        // gets defined later on if necessary
        this.parent_time_stamp = null;
        // sorted at all time
        this.time_stamps = [];
        ////////////
        // render //
        ////////////
        this.x = null;
        this.y = null;
        this.height = null;
        this.label = label;
        if (start !== null && end !== null && end < start)
            throw new Error(`end of time path '${label}' can't be before start`);
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
    get_label() {
        return this.label;
    }
    has_start() {
        return this.start !== null;
    }
    has_end() {
        return this.end !== null;
    }
    get_time_stamp(start) {
        const match = this.time_stamps.find((time_stamp) => {
            return time_stamp.get_start() == start;
        });
        if (match === undefined)
            throw new Error(`can't find time stamp with start of ${start}s in time path '${this.label}'`);
        return match;
    }
    get_parent_time_stamp() {
        return this.parent_time_stamp;
    }
    // connect to parent branch
    tie_up() {
        // no tie up needed <- no parent path
        if (this.parent_path === null || this.start_in_parent === null)
            return;
        this.parent_time_stamp = this.parent_path.get_time_stamp(this.start_in_parent);
        this.parent_time_stamp.add_child_path(this);
        if (!this.parent_time_stamp.no_width())
            throw new Error(`start and end of branching time stamp '${this.parent_time_stamp.get_label()}' has to be the same to tie up time path '${this.label}'`);
    }
    add_time_stamp(time_stamp) {
        this.time_stamps.push(time_stamp);
        if (this.start !== null && time_stamp.get_start() < this.start)
            throw new Error(`start of time stamp '${time_stamp.get_label()}' needs to be at or after start of time path '${this.label}'`);
        if (this.end !== null && time_stamp.get_end() > this.end)
            throw new Error(`end of time stamp '${time_stamp.get_label()}' needs to be at or before end of time path '${this.label}'`);
        this.time_stamps.sort((a, b) => {
            return a.get_start() - b.get_start();
        });
    }
    ///////////////
    // rendering //
    ///////////////
    calculate_height(height_per_path) {
        this.height = height_per_path;
        for (let time_stamp of this.time_stamps)
            for (let child_time_path of time_stamp.get_children_paths())
                this.height += child_time_path.calculate_height(height_per_path);
        return this.height;
    }
}
//# sourceMappingURL=time_path.js.map