// represent one endpoint the client can talk to
class AjaxAddress {
    constructor(name) {
        this.name = name;
        // load urls from html
        let obj = document.getElementById(name);
        this.url = obj.getAttribute("url");
    }
    send(msg, callback) {
        let request = new XMLHttpRequest();
        // set callback
        request.onreadystatechange = function () {
            // when a response has been received
            if (request.readyState == 4)
                callback(JSON.parse(request.responseText), request.status === 200);
        };
        // send request
        request.open("POST", this.url, true);
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
// add click listener to buttons of <button_class>
export function add_button_listener(button_class, callback) {
    let buttons = document.getElementsByClassName(button_class);
    for (let button of buttons)
        button.addEventListener("click", (e) => {
            callback(button);
        });
}
// hide or unhide spinner
export function set_load_status(element, loading, text = "Loading...") {
    let on_loads = element.getElementsByClassName("on-loads");
    // hide or unhide spinner
    for (let on_load of on_loads)
        on_load.style.display = loading ? "inline-block" : "none";
    // enable or disable button
    if (loading)
        element.setAttribute("disabled", "");
    else
        element.removeAttribute("disabled");
    // update text
    let text_element = element.getElementsByClassName("button-text");
    text_element[0].innerText = text;
}
export function add_moments() {
    let moment_divs = document.getElementsByClassName("moment-from-now");
    for (let moment_div of moment_divs) {
        let this_moment = moment(moment_div.dataset.time, "YYYY-MM-DD HH:mm:ss.x");
        moment_div.innerText = this_moment.fromNow();
    }
}
//# sourceMappingURL=utils.js.map