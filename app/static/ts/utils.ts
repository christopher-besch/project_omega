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

export function set_spinner(
    button: HTMLButtonElement,
    loading: boolean,
    text = "Loading..."
): void {
    let on_loads = button.getElementsByClassName("on-loads") as HTMLCollectionOf<HTMLElement>;
    // hide or unhide spinner
    for (let on_load of on_loads) on_load.style.display = loading ? "inline-block" : "none";
    // enable or disable button
    if (loading) button.setAttribute("disabled", "");
    else button.removeAttribute("disabled");
    // update text
    let text_element = button.getElementsByClassName(
        "button-text"
    ) as HTMLCollectionOf<HTMLElement>;
    text_element[0].innerText = text;
}

// button with two statuses
export function toggle_button(
    button: HTMLButtonElement,
    ajax_address: AjaxAddress,
    msg: any,
    resp_callback: { (response: any): void }
): void {
    // load from html
    let current_status: boolean = JSON.parse(button.dataset.status as string);
    let true_text = button.dataset.trueText as string;
    let false_text = button.dataset.falseText as string;
    msg.status = !current_status;

    ajax_address.send(msg, (resp, success) => {
        // status got changed?
        if (success && resp.success) {
            resp_callback(resp);
            // button text
            set_spinner(button, false, resp.status ? true_text : false_text);
            // button status
            button.dataset.status = JSON.stringify(resp.status);
        } else set_spinner(button, false, "Failure");
    });
    set_spinner(button, true);
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
