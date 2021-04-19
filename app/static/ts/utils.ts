declare var moment: any;

//////////
// ajax //
//////////

// represent one endpoint the client can talk to
export class AjaxAddress {
    private url: string;
    constructor(name: string) {
        // load urls from html
        let obj = document.getElementById(name) as HTMLElement;
        this.url = obj.getAttribute("url") as string;
    }

    send(msg: any, callback: { (response: any, success: boolean): void }): void {
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
export function get_ajax_urls(names: string[]): { [name: string]: AjaxAddress } {
    let ajax_urls: { [name: string]: AjaxAddress } = {};
    for (let name of names) ajax_urls[name] = new AjaxAddress(name);
    return ajax_urls;
}

////////////////////
// button control //
////////////////////

// add click listener to buttons of <button_class>
export function add_button_listener(
    class_name: string,
    callback: { (button: HTMLButtonElement): void }
): void {
    let buttons = document.getElementsByClassName(
        class_name
    ) as HTMLCollectionOf<HTMLButtonElement>;

    for (let button of buttons)
        button.addEventListener("click", (e) => {
            callback(button);
        });
}

// hide or unhide spinner
export function set_load_status(element: HTMLElement, loading: boolean, text = "Loading..."): void {
    let on_loads = element.getElementsByClassName("on-loads") as HTMLCollectionOf<HTMLElement>;
    // hide or unhide spinner
    for (let on_load of on_loads) on_load.style.display = loading ? "inline-block" : "none";
    // enable or disable button
    if (loading) element.setAttribute("disabled", "");
    else element.removeAttribute("disabled");
    // update text
    let text_element = element.getElementsByClassName(
        "button-text"
    ) as HTMLCollectionOf<HTMLElement>;
    text_element[0].innerText = text;
}

// icon resembling state of toggle button
export function set_logo(class_name: string, username: string, status: boolean): void {
    let logos = document.getElementsByClassName(class_name) as HTMLCollectionOf<HTMLElement>;
    for (let logo of logos)
        if (logo.dataset.username === username)
            logo.style.display = status ? "inline-block" : "none";
}

// button with two statuses
export function toggle_button(
    ajax_address: AjaxAddress,
    true_text: string,
    false_text: string,
    logo_class_name: string,
    button: HTMLButtonElement
): void {
    let current_status = JSON.parse(button.dataset.status as string);
    let msg = {
        username: button.dataset.username as string,
        // new status
        status: !current_status,
    };
    // send ajax
    ajax_address.send(msg, (response, success) => {
        // status got changed?
        if (success && response.success === true) {
            // button text
            set_load_status(button, false, msg.status ? true_text : false_text);
            // button status
            button.dataset.status = JSON.stringify(msg.status);
            // e.g. is-admin logo
            set_logo(logo_class_name, msg.username, msg.status);
        } else set_load_status(button, false, "Failure");
    });
    set_load_status(button, true);
}

//////////////////
// time control //
//////////////////

// load time stamps and convert into human readable format
export function add_moments(): void {
    let moment_divs = document.getElementsByClassName(
        "moment-from-now"
    ) as HTMLCollectionOf<HTMLDivElement>;
    for (let moment_div of moment_divs) {
        let this_moment = moment.utc(moment_div.dataset.time as string, "YYYY-MM-DD HH:mm:ss.SSS");
        moment_div.innerText = this_moment.fromNow();
    }
}
