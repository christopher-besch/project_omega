import { Camera } from "./camera.js";
import { Vec2 } from "./vec2.js";

export abstract class RenderObject {
    abstract draw(camera: Camera): void;
    // gets called after draw call
    // used for moving objects
    update(frame_time_delta: number): void { }
}

export class Line extends RenderObject {
    // global coordinates
    private p1: Vec2;
    private p2: Vec2;
    private inclination: Vec2;

    // inf -> no end of line
    private inf1: boolean;
    private inf2: boolean;

    // inf1 extends x1 and y1, inf2 x2 and y2 beyond visible area
    constructor(x1: number, x2: number, y1: number, y2: number, inf1: boolean, inf2: boolean) {
        super();
        this.p1 = new Vec2(x1, y1);
        this.p2 = new Vec2(x2, y2);
        this.inclination = this.p2.subtract(this.p1);
        this.inf1 = inf1;
        this.inf2 = inf2;
    }

    draw(camera: Camera): void {
        // // todo: should be moved in own function
        // let used_p1 = this.p1;
        // let used_p2 = this.p2;

        // let lambda = Math.sqrt();
        // if (this.inf1) {
        //     used_p1 = this.inclination.times(lambda).add(used_p1);
        // }
        // if (this.inf2) {
        //     used_p2 = this.inclination.times(-lambda).add(used_p2);
        // }

        // // cull invisible
        // if (!camera.is_viewable(used_x1, used_x2, used_y1, used_y2))
        //     return;

        // camera.get_ctx().beginPath();
        // let [x, y] = camera.get_rel_locations(used_x1, used_y1);
        // camera.get_ctx().moveTo(x, y);
        // [x, y] = camera.get_rel_locations(used_x2, used_y2);
        // camera.get_ctx().lineTo(x, y);
        // // todo: don't hard code
        // camera.get_ctx().strokeStyle = "black";
        // camera.get_ctx().stroke();
    }

    update(frame_time_delta: number): void {
        // if (this.x1 !== null)
        //     this.x1 += (10 * frame_time_delta) / 1000;
        // if (this.x2 !== null)
        //     this.x2 += (10 * frame_time_delta) / 1000;
    }
}
