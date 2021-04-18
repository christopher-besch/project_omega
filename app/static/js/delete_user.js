import { get_ajax_urls, add_button_listener, set_load_status } from "./utils.js";
function delete_user(button) {
    console.log("test");
    let msg = {
        username: button.dataset.username,
    };
    ajax_urls["confirm-delete"].send(msg, (response, success) => {
        // user got deleted?
        if (success && response.success === true) {
            window.location.assign(button.dataset.url);
        }
        else
            set_load_status(button, false, "Failure");
    });
    set_load_status(button, true);
}
// load urls from html
let ajax_urls = get_ajax_urls(["confirm-delete"]);
document.body.onload = () => {
    add_button_listener("confirm-delete", delete_user);
    // disable spinning after a while
    let buttons = document.getElementsByClassName("confirm-delete");
    for (let button of buttons)
        window.setTimeout(() => {
            set_load_status(button, false, "Delete User");
        }, 1000);
};
//# sourceMappingURL=delete_user.js.map