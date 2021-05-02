"use strict";
// create TimePath objects with references to parent TimePath
// create TimeStamp object for TimePath objects
// tie up all TimeStamp objects <- requires TimeStamp object at start on parent TimePath
class TimePath {
    constructor(label, start = null, end = null, parent_path = null) {
        // gets defined later on if necessary
        this.start_time_stamp = null;
        // sorted at all time
        this.time_stamps = [];
        this.label = label;
        if (start !== null && end !== null && end < start)
            throw new Error(`end of time path '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.parent_path = parent_path;
        if (parent_path !== null && start == null)
            throw new Error(`branching time path '${label}' needs a start`);
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
    // connect to parent branch
    tie_up() {
        // no tie up needed <- no parent path
        if (this.parent_path === null || this.start === null)
            return;
        this.start_time_stamp = this.parent_path.get_time_stamp(this.start);
        if (!this.start_time_stamp.no_width())
            throw new Error(`start and end of branching time stamp '${this.start_time_stamp.get_label()}' has to be the same to tie up time path '${this.label}'`);
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
}
class TimeStamp {
    constructor(label, time_path, start, end = start) {
        this.label = label;
        if (end < start)
            throw new Error(`end of time stamp '${label}' can't be before start`);
        this.start = start;
        this.end = end;
        this.time_path = time_path;
        time_path.add_time_stamp(this);
    }
    get_label() {
        return this.label;
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
}
const input_raw = `
{
    "time_paths": [
        { "label": "path a", "start": null, "end": null, "parent_path_id": null },
        { "label": "path b", "start": 5, "end": null, "parent_path_id": null },
        { "label": "path c", "start": 2, "end": 7, "parent_path_id": 0 },
        { "label": "path d", "start": 6, "end": 8, "parent_path_id": 2 },
        { "label": "path e", "start": 1, "end": null, "parent_path_id": 0 }
    ],
    "time_stamps": [
        { "label": "stamp a", "path_id": 0, "start": 1, "end": null },
        { "label": "stamp b", "path_id": 0, "start": 8, "end": 9 },
        { "label": "stamp c", "path_id": 0, "start": 2, "end": null },
        { "label": "stamp d", "path_id": 2, "start": 6, "end": null },
        { "label": "stamp e", "path_id": 0, "start": 0, "end": null }
    ]
}
`;
const input = JSON.parse(input_raw);
// time paths
let time_paths = [];
for (let time_path of input.time_paths)
    if (time_path.parent_path_id === null)
        time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end));
    // with parent path
    else
        time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end, time_paths[time_path.parent_path_id]));
// time stamps
for (let time_stamp of input.time_stamps)
    new TimeStamp(time_stamp.label, time_paths[time_stamp.path_id], time_stamp.start, time_stamp.end !== null ? time_stamp.end : time_stamp.start);
// tie up
for (let time_path of time_paths)
    time_path.tie_up();
console.log(time_paths);
//# sourceMappingURL=time_beam.js.map