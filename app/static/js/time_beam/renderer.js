function print_full_path(time_paths) {
    function print_path(path, intends = 0) {
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
export function load_positions(time_paths) {
    const height_per_path = 20;
    const y_start = 0;
    let root_time_paths = [];
    for (let time_path of time_paths)
        if (!time_path.is_child())
            root_time_paths.push(time_path);
    // settings
    let lower_bound = y_start;
    let upper_bound = y_start;
    for (let idx = 0; idx < root_time_paths.length; ++idx) {
        if (idx % 2)
            lower_bound += root_time_paths[idx].calculate_positions(height_per_path, lower_bound, false);
        else
            upper_bound -= root_time_paths[idx].calculate_positions(height_per_path, upper_bound, true);
        print_full_path([root_time_paths[idx]]);
    }
}
//# sourceMappingURL=renderer.js.map