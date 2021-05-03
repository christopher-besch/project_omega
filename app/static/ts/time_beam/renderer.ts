import { TimePath } from "./time_path.js";
import { TimeStamp } from "./time_stamp.js";

export function load_positions(time_paths: TimePath[]) {
    const height_per_path = 20;
    const y_start = 0;

    let root_time_paths: TimePath[] = [];
    for (let time_path of time_paths)
        if (time_path.get_parent_time_stamp() === null)
            root_time_paths.push(time_path);
    for (let time_path of root_time_paths)
        time_path.calculate_height(height_per_path);

    // biggest first
    root_time_paths.sort((a, b): number => {
        return b.get_height() - a.get_height();
    });

    if (root_time_paths.length == 0)
        throw new Error("at least one time path is required");
    // let [
    //     current_upper_bound,
    //     current_lower_bound,
    // ] = root_time_paths[0].set_location(
    //     0,
    //     root_time_paths[0].get_height() / 2,
    //     -root_time_paths[0].get_height() / 2
    // );

    // for (let idx = 0; idx < root_time_paths.length; idx++) {}
}
