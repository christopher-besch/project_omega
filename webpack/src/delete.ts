import { add_button_listener, toggle_button, get_ajax_urls, set_spinner } from "./utils";

// load urls from html
let ajax_urls = get_ajax_urls(["confirm-delete"]);
document.body.onload = () => {
    add_button_listener("confirm-delete", (b) => {
        // may be username or internal_name of article
        let id = b.dataset.id!;
        let url = b.dataset.url!;
        // not using toggle feature
        toggle_button(b, ajax_urls["confirm-delete"], { id }, (resp): void => {
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
            let text = button.dataset.falseText!;
            set_spinner(button, false, text);
        }, 3000);
    }
};
