//////////
// ajax //
//////////
// represent one endpoint the client can talk to
export class AjaxAddress {
    constructor(name) {
        // load urls from html
        let obj = document.getElementById(name);
        this.url = obj.getAttribute("url");
    }
    send(msg, callback, async = true) {
        let request = new XMLHttpRequest();
        // set callback
        request.onreadystatechange = function () {
            // when a response has been received
            if (request.readyState == 4)
                callback(JSON.parse(request.responseText), request.status === 200);
        };
        // send request
        request.open("POST", this.url, async);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(msg));
    }
}
// return dictionary with required urls
export function get_ajax_urls(names) {
    let ajax_urls = {};
    for (let name of names)
        ajax_urls[name] = new AjaxAddress(name);
    return ajax_urls;
}
////////////////////
// button control //
////////////////////
// add click listener to buttons of <button_class>
export function add_button_listener(class_name, callback) {
    let buttons = document.getElementsByClassName(class_name);
    for (let button of buttons)
        button.addEventListener("click", (e) => {
            callback(button);
        });
}
export function set_spinner(button, loading, text = "Loading...") {
    let on_loads = button.getElementsByClassName("on-loads");
    // hide or unhide spinner
    for (let on_load of on_loads)
        on_load.style.display = loading ? "inline-block" : "none";
    // enable or disable button
    if (loading)
        button.setAttribute("disabled", "");
    else
        button.removeAttribute("disabled");
    // update text
    let text_element = button.getElementsByClassName("button-text");
    text_element[0].innerText = text;
}
// button with two statuses
export function toggle_button(button, ajax_address, msg, resp_callback) {
    // load from html
    let current_status = JSON.parse(button.dataset.status);
    let true_text = button.dataset.trueText;
    let false_text = button.dataset.falseText;
    msg.status = !current_status;
    ajax_address.send(msg, (resp, success) => {
        // status got changed?
        if (success && resp.success) {
            resp_callback(resp);
            // button text
            set_spinner(button, false, resp.status ? true_text : false_text);
            // button status
            button.dataset.status = JSON.stringify(resp.status);
        }
        else
            set_spinner(button, false, "Failure");
    });
    set_spinner(button, true);
}
// like anchor with href
export function add_button_links() {
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url);
    });
}
//////////////////
// time control //
//////////////////
// load time stamps and convert into human readable format
export function add_moments() {
    let moment_divs = document.getElementsByClassName("moment-from-now");
    for (let moment_div of moment_divs) {
        let this_moment = moment.utc(moment_div.dataset.time, "YYYY-MM-DD HH:mm:ss.SSS");
        moment_div.innerText = this_moment.fromNow();
    }
}
//# sourceMappingURL=utils.js.map