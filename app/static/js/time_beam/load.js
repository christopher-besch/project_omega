import { TimePath } from "./time_path.js";
import { TimeStamp } from "./time_stamp.js";
export function load_time_paths(input_json) {
    // load json
    const input = JSON.parse(input_json);
    // labels have to be unique
    let used_labels = [];
    // create TimePath objects with references to parent TimePath
    let time_paths = [];
    for (let time_path of input.time_paths) {
        if (used_labels.indexOf(time_path.label) > -1)
            throw new Error(`doubled use of label '${time_path.label}'`);
        used_labels.push(time_path.label);
        if (time_path.parent_path_id === null)
            time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end));
        // with parent path
        else
            time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end, time_paths[time_path.parent_path_id], time_path.start_in_parent));
    }
    // create TimeStamp object for TimePath objects
    for (let time_stamp of input.time_stamps) {
        if (used_labels.indexOf(time_stamp.label) > -1)
            throw new Error(`doubled use of label '${time_stamp.label}'`);
        used_labels.push(time_stamp.label);
        new TimeStamp(time_stamp.label, time_paths[time_stamp.path_id], time_stamp.start, time_stamp.end !== null ? time_stamp.end : time_stamp.start);
    }
    // tie up all TimeStamp objects <- requires TimeStamp object at start on parent TimePath
    for (let time_path of time_paths)
        time_path.tie_up();
    return time_paths;
}
//# sourceMappingURL=load.js.map