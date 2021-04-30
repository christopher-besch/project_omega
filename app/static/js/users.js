import { add_button_listener, add_moments, get_ajax_urls, toggle_button } from "./utils.js";
// icon resembling state of toggle button
export function set_logo(class_name, username, status) {
    let logos = document.getElementsByClassName(class_name);
    for (let logo of logos)
        if (logo.dataset.username === username)
            logo.style.display = status ? "inline-block" : "none";
}
let ajax_urls = get_ajax_urls(["set-admin", "set-author"]);
document.body.onload = () => {
    // like anchor with href
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url);
    });
    add_button_listener("toggle-admin", (b) => {
        let username = b.dataset.username;
        toggle_button(b, ajax_urls["set-admin"], { username }, (resp) => {
            set_logo("is-admin", username, resp.status);
        });
    });
    add_button_listener("toggle-author", (b) => {
        let username = b.dataset.username;
        toggle_button(b, ajax_urls["set-author"], { username }, (resp) => {
            set_logo("is-author", username, resp.status);
            // for when changing own author status
            if (resp.reload_page)
                window.location.replace(window.location.pathname + window.location.search + window.location.hash);
        });
    });
    add_moments();
};
//# sourceMappingURL=users.js.map