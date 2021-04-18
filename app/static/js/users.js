import { AjaxAddress, add_button_listener, set_load_status } from "./utils.js";
function toggle_admin(button) {
    let current_status = JSON.parse(button.dataset.status);
    let msg = {
        username: button.dataset.username,
        status: !current_status,
    };
    // send ajax
    ajax_urls["set_admin"].send(msg, (response, success) => {
        // admin status got changed?
        if (success && response.success === true) {
            set_load_status(button, false, msg.status ? "Revoke Admin" : "Make Admin");
            button.dataset.status = JSON.stringify(msg.status);
        }
        else
            set_load_status(button, false, "Failure");
    });
    set_load_status(button, true);
}
// load urls from html
let ajax_urls = {
    set_admin: new AjaxAddress("set-admin"),
};
document.body.onload = () => {
    // like anchor with href
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url);
    });
    add_button_listener("toggle-admin", toggle_admin);
};
//# sourceMappingURL=users.js.map