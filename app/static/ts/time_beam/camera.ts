export class Camera {
    private left_bound: number;
    private right_bound: number;
    private lower_bound: number;
    private upper_bound: number;

    private scale_x: number;
    private scale_y: number;

    private ctx: CanvasRenderingContext2D;

    constructor(left_bound: number, right_bound: number, lower_bound: number, upper_bound: number, canvas_id: string) {
        if (left_bound > right_bound)
            throw new Error("left_bound can't be bigger than right_bound");
        if (lower_bound < upper_bound)
            throw new Error("lower_bound can't be smaller than upper_bound");

        // get canvas
        let canvas: HTMLCanvasElement = document.getElementById(canvas_id) as HTMLCanvasElement;
        canvas.width = canvas.scrollWidth;
        canvas.height = canvas.scrollHeight;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.left_bound = left_bound;
        this.right_bound = right_bound;
        this.lower_bound = lower_bound;
        this.upper_bound = upper_bound;

        this.scale_x = this.ctx.canvas.width / (right_bound - left_bound);
        this.scale_y = this.ctx.canvas.height / (lower_bound - upper_bound);
    }

    get_left_bound(): number { return this.left_bound; }
    get_right_bound(): number { return this.right_bound; }
    get_lower_bound(): number { return this.lower_bound; }
    get_upper_bound(): number { return this.upper_bound; }
    get_ctx(): CanvasRenderingContext2D { return this.ctx; }

    // todo: fix
    is_viewable(left_bound: number, right_bound: number, lower_bound: number, upper_bound: number): boolean {
        return true;
        if (left_bound)
            return false;
        return left_bound >= this.left_bound &&
            right_bound <= this.right_bound &&
            lower_bound <= this.lower_bound &&
            upper_bound >= this.upper_bound;
    }

    // relative to canvas
    get_rel_locations(x: number, y: number): [number, number] {
        return [
            (x - this.left_bound) * this.scale_x,
            (y - this.upper_bound) * this.scale_y
        ];
    }

    clear_screen(): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
