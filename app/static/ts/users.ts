import { AjaxAddress } from "./ajax.js";

// load urls from html
let ajax_urls: { [name: string]: AjaxAddress } = {
    set_admin: new AjaxAddress("set-admin"),
};

// add click listener to buttons of <button_class>
function add_button_listener(button_class: string, callback: { (button: HTMLButtonElement): void }): void {
    let buttons = document.getElementsByClassName(button_class) as HTMLCollectionOf<HTMLButtonElement>;

    for (let button of buttons)
        button.addEventListener("click", (e) => {
            callback(button);
        });
}

function set_load_status(element: HTMLElement, status: boolean): void {
    let children = element.children as HTMLCollectionOf<HTMLElement>;
    console.log(children);
    if (status) {
        // disable button
        element.setAttribute("disabled", "");
        // unhide all on-loading children
        for (let child of children) if (child.classList.contains("on-loading")) child.style.visibility = "visible";
        // remove text
        element.innerHTML = "";
    } else {
        // enable button
        element.removeAttribute("disabled");
        // hide all on-loading children
        for (let child of children) if (child.classList.contains("on-loading")) child.setAttribute("hidden", "");
    }
}

function make_admin(button: HTMLButtonElement): void {
    let msg = {
        username: button.dataset.username,
        status: true,
    };
    ajax_urls["set_admin"].send(msg, (response, success) => {
        set_load_status(button, false);
        if (success && response.success === true) button.innerText = "Revoke Admin";
        else button.innerText = "Failure";
    });
    set_load_status(button, true);
}
function revoke_admin(button: HTMLButtonElement): void {
    let username = button.dataset.username as string;
    ajax_urls["set_admin"].send({ username: username, status: false }, (response, success) => {
        set_load_status(button, false);
        if (success && response.success === true) button.innerText = "Make Admin";
        else button.innerText = "Failure";
    });
    set_load_status(button, true);
}

document.body.onload = () => {
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url as string);
    });
    add_button_listener("make-admin", make_admin);
    add_button_listener("revoke-admin", revoke_admin);
};
