import { get_ajax_urls, add_button_listener, set_load_status, add_moments } from "./utils.js";
function set_admin_logo(username, status) {
    let logos = document.getElementsByClassName("is-admin");
    for (let logo of logos)
        if (logo.dataset.username === username)
            logo.style.display = status ? "inline-block" : "none";
}
function toggle_admin(button) {
    let current_status = JSON.parse(button.dataset.adminStatus);
    let msg = {
        username: button.dataset.username,
        status: !current_status,
    };
    // send ajax
    ajax_urls["set-admin"].send(msg, (response, success) => {
        // admin status got changed?
        if (success && response.success === true) {
            // button text
            set_load_status(button, false, msg.status ? "Revoke Admin" : "Make Admin");
            // button status
            button.dataset.adminStatus = JSON.stringify(msg.status);
            // is-admin logo
            set_admin_logo(msg.username, msg.status);
        }
        else
            set_load_status(button, false, "Failure");
    });
    set_load_status(button, true);
}
let ajax_urls = get_ajax_urls(["set-admin"]);
document.body.onload = () => {
    // like anchor with href
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url);
    });
    add_button_listener("toggle-admin", toggle_admin);
    add_moments();
};
//# sourceMappingURL=users.js.map