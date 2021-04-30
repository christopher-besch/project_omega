import { add_button_listener, toggle_button, get_ajax_urls, set_spinner } from "./utils.js";

// load urls from html
let ajax_urls = get_ajax_urls(["confirm-delete"]);
document.body.onload = () => {
    add_button_listener("confirm-delete", (b) => {
        let username = b.dataset.username as string;
        let url = b.dataset.url as string;
        // not using toggle feature
        toggle_button(b, ajax_urls["confirm-delete"], { username }, (resp): void => {
            window.location.assign(url);
        });
    });

    // disable spinning after a while
    let buttons = document.getElementsByClassName(
        "confirm-delete"
    ) as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons) {
        set_spinner(button, true);
        window.setTimeout(() => {
            set_spinner(button, false, "Delete User");
        }, 1000);
    }
};
