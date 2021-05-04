import { TimePath } from "./time_path.js";
import { TimeStamp } from "./time_stamp.js";

function print_full_path(time_paths: TimePath[]): void {
    function print_path(path: TimePath, intends = 0): void {
        console.log(`${">".repeat(intends)}${path.get_label()}:`);
        console.log(`${">".repeat(intends)} location: ${path.get_path_y()}`);
        console.log(`${">".repeat(intends)} main_path location: ${path.get_main_path_y()}`);
        if (path.get_parent_time_stamp() !== null)
            console.log(`${">".repeat(intends)} connect_up: ${path.get_connect_up()}`);

        for (let child of path.get_child_paths())
            print_path(child, ++intends);
    }

    for (let path of time_paths) {
        print_path(path);
    }
}

export function load_positions(time_paths: TimePath[]) {
    const height_per_path = 20;
    const y_start = 0;

    let root_time_paths: TimePath[] = [];
    for (let time_path of time_paths)
        if (time_path.get_parent_time_stamp() === null)
            root_time_paths.push(time_path);

    // settings
    let lower_bound = y_start;
    let upper_bound = y_start;
    for (let idx = 0; idx < root_time_paths.length; ++idx) {
        if (idx % 2)
            lower_bound += root_time_paths[idx].calculate_positions(height_per_path, lower_bound, false, null);
        else
            upper_bound -= root_time_paths[idx].calculate_positions(height_per_path, upper_bound, true, null);
        print_full_path([root_time_paths[idx]]);
    }
}
