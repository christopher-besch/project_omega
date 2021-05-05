import { Camera } from "./camera.js";

export abstract class RenderObject {
    abstract draw(camera: Camera): void;
    // gets called after draw call
    // used for moving objects
    update(frame_time_delta: number): void { }
}

export class Line extends RenderObject {
    // global coordinates
    private x1: number;
    private x2: number;
    private y1: number;
    private y2: number;

    // inf -> no end of line
    private left_inf: boolean;
    private right_inf: boolean;

    // left_inf extends x1 and y1, right_inf x2 and y2 beyond visible area
    constructor(x1: number, x2: number, y1: number, y2: number, left_inf: boolean, right_inf: boolean) {
        super();
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.left_inf = left_inf;
        this.right_inf = right_inf;
    }

    draw(camera: Camera): void {
        let used_x1 = this.x1;
        let used_x2 = this.x2;
        let used_y1 = this.y1;
        let used_y2 = this.y2;

        let delta_x = used_x2 - used_x1;
        let delta_y = used_y2 - used_y1;
        if (this.left_inf) {
            used_x1 = camera.get_left_bound();
            // don't divide by 0 <- vertical line
            if (delta_x == 0) {
                used_y1 = camera.get_upper_bound();
            } else {
                // get intersection point with left boundary
                used_y1 = (delta_y / delta_x) * used_x1;
            }
        }
        // get intersection point with right boundary
        if (this.right_inf) {
            used_x2 = camera.get_right_bound();
            if (delta_x == 0) {
                // return vertical line
                used_y2 = camera.get_lower_bound();
            } else {
                // get intersection point with right boundary
                used_y2 = (delta_y / delta_x) * used_x2;
            }
        }

        // cull invisible
        if (!camera.is_viewable(used_x1, used_x2, used_y1, used_y2))
            return;

        camera.get_ctx().beginPath();
        let [x, y] = camera.get_rel_locations(used_x1, used_y1);
        camera.get_ctx().moveTo(x, y);
        [x, y] = camera.get_rel_locations(used_x2, used_y2);
        camera.get_ctx().lineTo(x, y);
        // todo: don't hard code
        camera.get_ctx().strokeStyle = "black";
        camera.get_ctx().stroke();
    }

    update(frame_time_delta: number): void {
        if (this.x1 !== null)
            this.x1 += (10 * frame_time_delta) / 1000;
        if (this.x2 !== null)
            this.x2 += (10 * frame_time_delta) / 1000;
    }
}
