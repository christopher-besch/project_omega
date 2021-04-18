import { AjaxAddress, add_button_listener, set_load_status } from "./utils.js";

function set_admin_logo(username: string, status: boolean): void {
    let logos = document.getElementsByClassName("is-admin") as HTMLCollectionOf<HTMLElement>;
    for (let logo of logos)
        if (logo.dataset.username === username)
            logo.style.display = status ? "inline-block" : "none";
}

function toggle_admin(button: HTMLButtonElement): void {
    let current_status = JSON.parse(button.dataset.status as string);
    let msg = {
        username: button.dataset.username as string,
        status: !current_status,
    };
    // send ajax
    ajax_urls["set_admin"].send(msg, (response, success) => {
        // admin status got changed?
        if (success && response.success === true) {
            // button text
            set_load_status(button, false, msg.status ? "Revoke Admin" : "Make Admin");
            // button status
            button.dataset.status = JSON.stringify(msg.status);
            // is-admin logo
            set_admin_logo(msg.username, msg.status);
        } else set_load_status(button, false, "Failure");
    });
    set_load_status(button, true);
}

// load urls from html
let ajax_urls: { [name: string]: AjaxAddress } = {
    set_admin: new AjaxAddress("set-admin"),
};

document.body.onload = () => {
    // like anchor with href
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url as string);
    });
    add_button_listener("toggle-admin", toggle_admin);
};
