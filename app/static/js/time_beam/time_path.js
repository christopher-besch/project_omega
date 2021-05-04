export class TimePath {
    constructor(label, start = null, end = null, parent_path = null, start_in_parent = null) {
        // gets defined in tie_up if necessary
        this.parent_time_stamp = null;
        this.child_paths = [];
        // sorted at all time
        this.time_stamps = [];
        ////////////
        // render //
        ////////////
        // relative to origin of parent path or global origin if root path
        // <- for this path and all children
        this.path_y = null;
        // location of main path relative to this path's origin
        this.main_y = null;
        // null if root path
        this.connect_up = null;
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
    get_child_paths() {
        return this.child_paths;
    }
    // relative to origin of parent path or global origin if root path
    // <- for this path and all children
    get_path_y() {
        if (this.path_y === null)
            throw new Error(`path_y of '${this.label}' is null`);
        return this.path_y;
    }
    // relative to this path's origin
    get_main_path_y() {
        if (this.main_y === null)
            throw new Error(`start_y of '${this.label}' is null`);
        return this.main_y;
    }
    get_connect_up() {
        if (this.connect_up === null)
            throw new Error(`connect_up of '${this.label}' is null`);
        return this.connect_up;
    }
    // connect to parent branch at specified location
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
    move(amount, go_up) {
        if (this.path_y === null)
            throw new Error(`path_y of '${this.label}' is null`);
        if (go_up)
            this.path_y -= amount;
        else
            this.path_y += amount;
    }
    // move this path with all children up or down
    move_line_children(amount, go_up) {
        // move line
        if (this.main_y === null)
            throw new Error(`start_y of '${this.label}' is null`);
        if (go_up)
            this.main_y -= amount;
        else
            this.main_y += amount;
        // move entire children
        for (let child_path of this.child_paths) {
            child_path.move(amount, go_up);
        }
    }
    // return added height -> space between fixed_bound and bound belongs to this path
    // go_up -> allocate space just above or below fixed_bound
    // connect_up -> connect to parent path up or down
    calculate_positions(height_per_path, fixed_bound, go_up, connect_up) {
        this.connect_up = connect_up;
        // this much space is required by this path herself
        // low bound is fixed if above, else upper bound fixed
        // other bound gets moved away from the start depending on amount of recursive child paths
        let upper_bound;
        let lower_bound;
        if (go_up) {
            upper_bound = fixed_bound - height_per_path;
            lower_bound = fixed_bound;
        }
        else {
            upper_bound = fixed_bound;
            lower_bound = fixed_bound + height_per_path;
        }
        // start at bottom
        this.main_y = lower_bound;
        // go through all child paths
        this.child_paths = [];
        let idx = 0;
        for (let time_stamp of this.time_stamps)
            for (let child_path of time_stamp.get_children_paths()) {
                if (idx % 2) {
                    if (go_up) {
                        // start at bottom and go up
                        let added_height = child_path.calculate_positions(height_per_path, lower_bound, true, true);
                        // move everything up <- things have been added below and are overlapping already added paths
                        this.move_line_children(added_height, true);
                        // lower bound fixed
                        upper_bound -= added_height;
                    }
                    else {
                        // start at bottom and go down
                        let added_height = child_path.calculate_positions(height_per_path, lower_bound, false, true);
                        // everything has been added at the variable end -> nothing has to be moved
                        // upper bound fixed
                        lower_bound += added_height;
                    }
                }
                else {
                    if (go_up) {
                        // start at top and go up
                        let added_height = child_path.calculate_positions(height_per_path, upper_bound, true, false);
                        upper_bound -= added_height;
                    }
                    else {
                        // start at top and go down
                        let added_height = child_path.calculate_positions(height_per_path, upper_bound, false, false);
                        this.move_line_children(added_height, false);
                        lower_bound += added_height;
                    }
                }
                this.child_paths.push(child_path);
                ++idx;
            }
        this.path_y = lower_bound;
        return lower_bound - upper_bound;
        // todo: use global coordinates
    }
}
//# sourceMappingURL=time_path.js.map