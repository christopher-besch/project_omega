import { load_time_paths } from "./time_beam.js";

const input_json: string = `
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

console.log(load_time_paths(input_json));

export class TimePathRenderer {}

export class TimeStampRender {}
