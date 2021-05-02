import { TimePath } from "./time_path.js";
import { TimeStamp } from "./time_stamp.js";
export function load_time_paths(input_json) {
    const input = JSON.parse(input_json);
    // create TimePath objects with references to parent TimePath
    let time_paths = [];
    for (let time_path of input.time_paths)
        if (time_path.parent_path_id === null)
            time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end));
        // with parent path
        else
            time_paths.push(new TimePath(time_path.label, time_path.start, time_path.end, time_paths[time_path.parent_path_id]));
    // create TimeStamp object for TimePath objects
    for (let time_stamp of input.time_stamps)
        new TimeStamp(time_stamp.label, time_paths[time_stamp.path_id], time_stamp.start, time_stamp.end !== null ? time_stamp.end : time_stamp.start);
    // tie up all TimeStamp objects <- requires TimeStamp object at start on parent TimePath
    for (let time_path of time_paths)
        time_path.tie_up();
    return time_paths;
}
//# sourceMappingURL=load.js.map