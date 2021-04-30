import { add_button_listener, toggle_button, get_ajax_urls, set_spinner } from "./utils.js";
// load urls from html
let ajax_urls = get_ajax_urls(["confirm-delete"]);
document.body.onload = () => {
    add_button_listener("confirm-delete", (b) => {
        let username = b.dataset.username;
        let url = b.dataset.url;
        // not using toggle feature
        toggle_button(b, ajax_urls["confirm-delete"], { username }, (resp) => {
            window.location.assign(url);
        });
    });
    // disable spinning after a while
    let buttons = document.getElementsByClassName("confirm-delete");
    for (let button of buttons) {
        set_spinner(button, true);
        window.setTimeout(() => {
            set_spinner(button, false, "Delete User");
        }, 1000);
    }
};
//# sourceMappingURL=delete_user.js.map