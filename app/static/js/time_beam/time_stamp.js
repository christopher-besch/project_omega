export class TimeStamp {
    constructor(label, time_path, start, end = start) {
        // all paths that have this their start_time_stamp
        this.children_paths = [];
        this.label = label;
        if (end < start)
            throw new Error(`end of time stamp '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.path = time_path;
        time_path.add_time_stamp(this);
    }
    get_label() {
        return this.label;
    }
    get_path() {
        return this.path;
    }
    get_start() {
        return this.start;
    }
    get_end() {
        return this.end;
    }
    no_width() {
        return this.start == this.end;
    }
    get_child_paths() {
        return this.children_paths;
    }
    add_child_path(time_path) {
        this.children_paths.push(time_path);
    }
}
//# sourceMappingURL=time_stamp.js.map