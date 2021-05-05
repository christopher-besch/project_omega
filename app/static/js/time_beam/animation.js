export class Animation {
    constructor(camera, render_objects) {
        this.last_frame_time = 0;
        this.camera = camera;
        this.render_objects = render_objects;
    }
    render() {
        this.camera.clear_screen();
        // set time
        let current_frame_time = Date.now();
        let frame_time_delta = current_frame_time - this.last_frame_time;
        this.last_frame_time = current_frame_time;
        for (let render_object of this.render_objects) {
            render_object.update(frame_time_delta);
            render_object.draw(this.camera);
        }
        window.requestAnimationFrame(this.render.bind(this));
    }
    init() {
        this.last_frame_time = Date.now();
        this.render();
    }
}
//# sourceMappingURL=animation.js.map