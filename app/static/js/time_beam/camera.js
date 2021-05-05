export class Camera {
    constructor(left_bound, right_bound, lower_bound, upper_bound, canvas_id) {
        if (left_bound > right_bound)
            throw new Error("left_bound can't be bigger than right_bound");
        if (lower_bound < upper_bound)
            throw new Error("lower_bound can't be smaller than upper_bound");
        // get canvas
        let canvas = document.getElementById(canvas_id);
        canvas.width = canvas.scrollWidth;
        canvas.height = canvas.scrollHeight;
        this.ctx = canvas.getContext("2d");
        this.left_bound = left_bound;
        this.right_bound = right_bound;
        this.lower_bound = lower_bound;
        this.upper_bound = upper_bound;
        this.scale_x = this.ctx.canvas.width / (right_bound - left_bound);
        this.scale_y = this.ctx.canvas.height / (lower_bound - upper_bound);
    }
    get_left_bound() { return this.left_bound; }
    get_right_bound() { return this.right_bound; }
    get_lower_bound() { return this.lower_bound; }
    get_upper_bound() { return this.upper_bound; }
    get_ctx() { return this.ctx; }
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