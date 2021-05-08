import { TimePath } from "./time_path.js";
import { TimeStamp } from "./time_stamp.js";

// todo: better solution
const height_per_path = 20;
const y_start = 0;

export function load_time_paths(input_json: string): TimePath[] {
    // load json
    const input = JSON.parse(input_json) as {
        time_paths: {
            label: string;
            // null -> no start
            start: number | null;
            // null -> no end
            end: number | null;
            // null -> not branch of other path
            parent_path_id: number | null;
            // null -> start in parent at start in this path <- no time jump
            start_in_parent: number | null;
        }[];
        time_stamps: {
            label: string;
            path_id: number;
            start: number;
            // null -> same as start
            end: number | null;
        }[];
    };

    // create time paths
    // labels have to be unique
    let used_labels: string[] = [];
    // create TimePath objects with references to parent TimePath
    let time_paths: TimePath[] = [];
    for (let time_path of input.time_paths) {
        if (used_labels.indexOf(time_path.label) > -1)
            throw new Error(`doubled use of label '${time_path.label}'`);
        used_labels.push(time_path.label);

        if (time_path.parent_path_id === null)
            time_paths.push(
                new TimePath(time_path.label, time_path.start, time_path.end)
            );
        // with parent path
        else
            time_paths.push(
                new TimePath(
                    time_path.label,
                    time_path.start,
                    time_path.end,
                    time_paths[time_path.parent_path_id],
                    time_path.start_in_parent
                )
            );
    }

    // create time stamps
    for (let time_stamp of input.time_stamps) {
        if (used_labels.indexOf(time_stamp.label) > -1)
            throw new Error(`doubled use of label '${time_stamp.label}'`);
        used_labels.push(time_stamp.label);
        new TimeStamp(
            time_stamp.label,
            time_paths[time_stamp.path_id],
            time_stamp.start,
            time_stamp.end !== null ? time_stamp.end : time_stamp.start
        );
    }

    // tie up all TimeStamp objects <- requires TimeStamp object at start on parent TimePath
    for (let time_path of time_paths) time_path.tie_up();


    // get root time paths
    let root_time_paths: TimePath[] = [];
    for (let time_path of time_paths)
        if (!time_path.is_child())
            root_time_paths.push(time_path);

    // calculate y-locations
    let lower_bound = y_start;
    let upper_bound = y_start;
    for (let idx = 0; idx < root_time_paths.length; ++idx)
        if (idx % 2)
            lower_bound += root_time_paths[idx].calculate_positions(height_per_path, lower_bound, false);
        else
            upper_bound -= root_time_paths[idx].calculate_positions(height_per_path, upper_bound, true);
    return root_time_paths;
}
