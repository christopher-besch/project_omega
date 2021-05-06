import { Vec2 } from "./vec2.js";
export class Camera {
    constructor(canvas_id, left_bound, right_bound, lower_bound, upper_bound) {
        if (left_bound > right_bound)
            throw new Error("left_bound can't be bigger than right_bound");
        if (lower_bound < upper_bound)
            throw new Error("lower_bound can't be smaller than upper_bound");
        // get canvas
        let canvas = document.getElementById(canvas_id);
        canvas.width = canvas.scrollWidth;
        canvas.height = canvas.scrollHeight;
        this.ctx = canvas.getContext("2d");
        this.top_left = new Vec2(left_bound, upper_bound);
        this.bottom_right = new Vec2(right_bound, lower_bound);
        this.scale_x = this.ctx.canvas.width / (right_bound - left_bound);
        this.scale_y = this.ctx.canvas.height / (lower_bound - upper_bound);
        this.diagonal = thiu;
    }
    get_ctx() { return this.ctx; }
    get_left_bound() { return this.top_left.x; }
    get_right_bound() { return this.bottom_right.x; }
    get_lower_bound() { return this.top_left.y; }
    get_upper_bound() { return this.bottom_right.y; }
    calculate() {
        this.scale = new Vec2(this.ctx.canvas.width / (right_bound - left_bound));
        this.scale_x = this.ctx.canvas.width / (right_bound - left_bound);
        this.scale_y = this.ctx.canvas.height / (lower_bound - upper_bound);
        this.diagonal = Math.sqrt();
    }
    // todo: fix
    is_viewable(left_bound, right_bound, lower_bound, upper_bound) {
        return true;
        if (left_bound)
            return false;
        return left_bound >= this.left_bound &&
            right_bound <= this.right_bound &&
            lower_bound <= this.lower_bound &&
            upper_bound >= this.upper_bound;
    }
    // relative to canvas
    get_rel_locations(x, y) {
        return [
            (x - this.left_bound) * this.scale_x,
            (y - this.upper_bound) * this.scale_y
        ];
    }
    clear_screen() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
//# sourceMappingURL=camera.js.map