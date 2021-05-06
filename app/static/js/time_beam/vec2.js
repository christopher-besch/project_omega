export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    times(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    over(scalar) {
        return this.times(1 / scalar);
    }
}
export function dot_product(a, b) {
    return a.x * b.x + a.y * b.y;
}
//# sourceMappingURL=vec2.js.map