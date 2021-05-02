export function load_positions(time_paths) {
    let root_time_paths = [];
    for (let time_path of time_paths)
        if (time_path.get_parent_time_stamp() === null) {
            root_time_paths.push(time_path);
            time_path.calculate_height(20);
        }
    console.log(root_time_paths);
}
//# sourceMappingURL=renderer.js.map