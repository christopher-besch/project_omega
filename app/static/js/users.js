import { AjaxAddress } from "./ajax.js";
// load urls from html
let ajax_urls = {
    set_admin: new AjaxAddress("set_admin"),
};
function set_admin(username, status) {
    console.log("hello world!");
}
document.body.onload = () => {
    // revoke admin
    let buttons = document.getElementsByClassName("revoke-admin");
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            console.log(`${button.dataset.username} revoke admin`);
        });
    }
    // make admin
    buttons = document.getElementsByClassName("make-admin");
    for (let button of buttons) {
        button.addEventListener("click", (e) => {
            console.log(`${button.dataset.username} make admin`);
        });
    }
};
