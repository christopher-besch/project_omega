"use strict";
class AjaxConnection {
    constructor(name) {
        this.name = name;
        // ger url from html
        let obj = document.getElementById(`${name}_ajax`);
        this.url = obj.getAttribute("url");
    }
}
// load urls from html
let ajax_urls = {
    set_admin: "",
};
function get_ajax_urls() {
    for (let name in ajax_urls) {
        let obj = document.getElementById(`${name}_ajax`);
        let url = obj.getAttribute("url");
        ajax_urls[name] = url;
    }
}
function set_admin(username, status) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        // when a response from the server has been received
        if (request.readyState === 4) {
            if (request.status === 20) {
                console.log(request.responseText);
            }
            else {
                // todo: better error
                alert("An error occurred!");
            }
        }
    };
    request.open("POST", "hello world");
}
function setup() {
    get_ajax_urls();
}
