import {
    add_button_links,
    add_button_listener,
    add_moments,
    get_ajax_urls,
    set_logo,
    toggle_button,
} from "./utils";

let ajax_urls = get_ajax_urls(["set-admin", "set-author"]);
document.body.onload = () => {
    add_button_links();

    add_button_listener("toggle-admin", (b) => {
        let username = b.dataset.username!;
        toggle_button(b, ajax_urls["set-admin"], { username }, (resp): void => {
            set_logo("is-admin", username, resp.status);
        });
    });
    add_button_listener("toggle-author", (b) => {
        let username = b.dataset.username!;
        toggle_button(b, ajax_urls["set-author"], { username }, (resp): void => {
            set_logo("is-author", username, resp.status);
            // for when changing own author status
            if (resp.reload_page)
                window.location.replace(
                    window.location.pathname + window.location.search + window.location.hash
                );
        });
    });

    add_moments();
};
