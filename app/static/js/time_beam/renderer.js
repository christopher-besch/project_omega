export class Camera {
    constructor(left_bound, right_bound, lower_bound, upper_bound, ctx) {
        if (left_bound > right_bound)
            throw new Error("left_bound can't be bigger than right_bound");
        if (lower_bound < upper_bound)
            throw new Error("lower_bound can't be smaller than upper_bound");
        this.left_bound = left_bound;
        this.right_bound = right_bound;
        this.lower_bound = lower_bound;
        this.upper_bound = upper_bound;
        this.scale_x = ctx.canvas.width / (this.right_bound - this.left_bound);
        this.scale_y = ctx.canvas.height / (this.lower_bound - this.upper_bound);
        this.ctx = ctx;
    }
    is_viewable(left_bound, right_bound, lower_bound, upper_bound) {
        return left_bound > this.left_bound &&
            right_bound < this.right_bound &&
            lower_bound < this.lower_bound &&
            upper_bound > this.upper_bound;
    }
    // relative to canvas
    get_rel_locations(x, y) {
        return [
            (x - this.left_bound) * this.scale_x,
            (y - this.upper_bound) * this.scale_y
        ];
    }
}
export class RenderObject {
}
export class Line extends RenderObject {
    // null -> (negative) infinity
    constructor(x1, x2, y1, y2) {
        super();
        // x1 is supposed to be left to x2
        if (x1 !== null && x2 !== null && x1 > x2)
            [x1, x2] = [x2, x1];
        this.x1 = x1;
        this.x2 = x2;
        // y1 si supposed to be below y2
        if (y1 !== null && y2 !== null && y1 < y2)
            [y1, y2] = [y2, y1];
        this.y1 = y1;
        this.y2 = y2;
    }
    draw(camera) {
        // infinity <- border of ctx
        let this_x1 = this.x1 === null ? camera.left_bound : this.x1;
        let this_x2 = this.x2 === null ? camera.right_bound : this.x2;
        let this_y1 = this.y1 === null ? camera.lower_bound : this.y1;
        let this_y2 = this.y2 === null ? camera.upper_bound : this.y2;
        // cull invisible
        if (!camera.is_viewable(this_x1, this_x2, this_y1, this_y2))
            return;
        camera.ctx.beginPath();
        let [x, y] = camera.get_rel_locations(this_x1, this_y1);
        camera.ctx.moveTo(x, y);
        [x, y] = camera.get_rel_locations(this_x2, this_y2);
        camera.ctx.lineTo(x, y);
        // todo: don't hard code
        camera.ctx.strokeStyle = "black";
        camera.ctx.stroke();
    }
}
//# sourceMappingURL=renderer.js.map