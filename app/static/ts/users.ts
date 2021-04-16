import { AjaxAddress } from "./ajax.js";

// load urls from html
let ajax_urls: { [name: string]: AjaxAddress } = {
    set_admin: new AjaxAddress("set_admin"),
};

function set_admin(username: string, status: boolean): void {
    console.log("hello world!");
}

document.body.onload = () => {
    // revoke admin
    let buttons = document.getElementsByClassName("revoke-admin") as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            console.log(`${button.dataset.username} revoke admin`);
        });
    }
    // make admin
    buttons = document.getElementsByClassName("make-admin") as HTMLCollectionOf<HTMLButtonElement>;
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            console.log(`${button.dataset.username} make admin`);
        });
    }
};
