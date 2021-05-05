import { load_time_paths } from "./time_beam/load.js";
import { print_full_path } from "./time_beam/debug.js";
import { Camera } from "./time_beam/camera.js";
import { Line } from "./time_beam/render_objects.js";
import { Animation } from "./time_beam/animation.js";

const input_json: string = `
{
    "time_paths": [
        { "label": "path a" },
        { "label": "path b", "start": 5 },
        { "label": "path c", "start": 2, "end": 7, "parent_path_id": 0 },
        {
            "label": "path d",
            "start": 6,
            "end": 8,
            "parent_path_id": 2,
            "start_in_parent": 3
        },
        { "label": "path e", "start": 1, "end": null, "parent_path_id": 0 },
        { "label": "path f" },
        { "label": "path g", "start": 0, "parent_path_id": 5 },
        { "label": "path h", "start": 0, "parent_path_id": 6 },
        { "label": "path i", "start": 0, "parent_path_id": 7 },
        { "label": "path j", "start": 0, "parent_path_id": 8 },
        { "label": "path k", "start": 0, "parent_path_id": 9 },
        { "label": "path l", "start": 0, "parent_path_id": 10 },
        { "label": "path m", "start": 0, "parent_path_id": 11 },
        { "label": "path n", "start": 0, "parent_path_id": 11 },

        { "label": "path o", "start": 0, "parent_path_id": 5 },
        { "label": "path p", "start": 0, "parent_path_id": 5 }
    ],
    "time_stamps": [
        { "label": "stamp a", "path_id": 0, "start": 1 },
        { "label": "stamp b", "path_id": 0, "start": 8, "end": 9 },
        { "label": "stamp c", "path_id": 0, "start": 2 },
        { "label": "stamp d", "path_id": 2, "start": 6 },
        { "label": "stamp e", "path_id": 0, "start": 0 },
        { "label": "stamp f", "path_id": 2, "start": 3 },
        { "label": "stamp g", "path_id": 5, "start": 0 },
        { "label": "stamp h", "path_id": 6, "start": 0 },
        { "label": "stamp i", "path_id": 7, "start": 0 },
        { "label": "stamp j", "path_id": 8, "start": 0 },
        { "label": "stamp k", "path_id": 9, "start": 0 },
        { "label": "stamp l", "path_id": 10, "start": 0 },
        { "label": "stamp m", "path_id": 11, "start": 0 }
    ]
}
`;

// let root_time_paths = load_time_paths(input_json);
// print_full_path(root_time_paths);

let camera = new Camera(0, 100, 100, 0, "time-beam-canvas");
let line = new Line(20, 0, 20, 50, true, false);
let animation = new Animation(camera, [line]);
animation.init();
