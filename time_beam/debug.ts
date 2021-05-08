import { TimePath } from "./time_path.js";

export function print_full_path(time_paths: TimePath[]): void {
    function print_path(path: TimePath, intends = 0): void {
        console.log(`${">".repeat(intends)}${path.get_label()}:`);
        console.log(`${">".repeat(intends)} lower_bound: ${path.get_lower_bound()}`);
        console.log(`${">".repeat(intends)} upper_bound: ${path.get_upper_bound()}`);
        console.log(`${">".repeat(intends)} main_path_lower_bound location: ${path.get_main_path_lower_bound()}`);
        if (path.is_child()) {
            console.log(`${">".repeat(intends)} connect_to: ${path.get_connected_to()}`);
        }

        for (let child of path.get_child_paths())
            print_path(child, intends + 1);
    }

    for (let path of time_paths) {
        print_path(path);
    }
}
