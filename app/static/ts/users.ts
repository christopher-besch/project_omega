import {
    add_button_links,
    add_button_listener,
    add_moments,
    get_ajax_urls,
    toggle_button,
} from "./utils.js";

// icon resembling state of toggle button
export function set_logo(class_name: string, username: string, status: boolean): void {
    let logos = document.getElementsByClassName(class_name) as HTMLCollectionOf<HTMLElement>;
    for (let logo of logos)
        if (logo.dataset.username === username)
            logo.style.display = status ? "inline-block" : "none";
}

let ajax_urls = get_ajax_urls(["set-admin", "set-author"]);
document.body.onload = () => {
    add_button_links();

    add_button_listener("toggle-admin", (b) => {
        let username = b.dataset.username as string;
        toggle_button(b, ajax_urls["set-admin"], { username }, (resp): void => {
            set_logo("is-admin", username, resp.status);
        });
    });
    add_button_listener("toggle-author", (b) => {
        let username = b.dataset.username as string;
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
