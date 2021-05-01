import {
    add_button_links,
    add_button_listener,
    add_moments,
    get_ajax_urls,
    set_logo,
    toggle_button,
} from "./utils.js";

let ajax_urls = get_ajax_urls(["set-author"]);
document.body.onload = () => {
    add_button_links();

    add_button_listener("toggle-author", (b) => {
        let username = b.dataset.username as string;
        let internal_name = b.dataset.internal_name as string;
        toggle_button(b, ajax_urls["set-author"], { username, internal_name }, (resp): void => {
            set_logo("is-author", username, resp.status);
        });
    });

    add_moments();
};
