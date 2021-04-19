import { get_ajax_urls, add_button_listener, toggle_button, add_moments } from "./utils.js";

let ajax_urls = get_ajax_urls(["set-admin", "set-author"]);

document.body.onload = () => {
    // like anchor with href
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url as string);
    });
    add_button_listener("toggle-admin", (b) => {
        toggle_button(ajax_urls["set-admin"], "Revoke Admin", "Make Admin", "is-admin", b);
    });
    add_button_listener("toggle-author", (b) => {
        toggle_button(ajax_urls["set-author"], "Revoke Author", "Make Author", "is-author", b);
    });
    add_moments();
};
