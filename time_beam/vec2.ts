export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    subtract(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    times(scalar: number): Vec2 {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    over(scalar: number): Vec2 {
        return this.times(1 / scalar);
    }
}

export function dot_product(a: Vec2, b: Vec2): number {
    return a.x * b.x + a.y * b.y;
}
