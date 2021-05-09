declare var moment: any;

//////////
// ajax //
//////////

// represent one endpoint the client can talk to
export class AjaxAddress {
    private url: string;
    private csrf_token: string;

    constructor(name: string) {
        // load urls and tokens from html
        let obj = document.getElementById(name)!;
        this.url = obj.getAttribute("url")!;
        this.csrf_token = obj.getAttribute("csrf_token")!;
    }

    send(msg: any, callback: { (response: any, success: boolean): void; }, async = true): void {
        let request = new XMLHttpRequest();
        // set callback
        request.onreadystatechange = function () {
            // when a response has been received
            if (request.readyState == 4) {
                try {
                    let response: any = JSON.parse(request.responseText);
                } catch (error) {
                    callback("failure", false);
                    return;
                }
                callback(JSON.parse(request.responseText), request.status === 200);
            }
        };
        // send request
        request.open("POST", this.url, async);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("X-CSRFToken", this.csrf_token);
        request.send(JSON.stringify(msg));
    }
}

// return dictionary with required urls
export function get_ajax_urls(names: string[]): { [name: string]: AjaxAddress; } {
    let ajax_urls: { [name: string]: AjaxAddress; } = {};
    for (let name of names) ajax_urls[name] = new AjaxAddress(name);
    return ajax_urls;
}

////////////////////
// button control //
////////////////////

// add click listener to buttons of class <class_name>
export function add_button_listener(
    class_name: string,
    callback: { (button: HTMLButtonElement): void; }
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
// e.g. make and revoke admin
export function toggle_button(
    button: HTMLButtonElement,
    ajax_address: AjaxAddress,
    msg: any,
    resp_callback: { (response: any): void; }
): void {
    // load from html
    let current_status: boolean = JSON.parse(button.dataset.status!);
    let true_text = button.dataset.trueText!;
    let false_text = button.dataset.falseText!;
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

// like anchor with href
export function add_button_links(): void {
    add_button_listener("button-link", (b) => {
        window.location.assign(b.dataset.url!);
    });
}

// icon resembling state of toggle button
export function set_logo(class_name: string, id: string, status: boolean): void {
    let logos = document.getElementsByClassName(class_name) as HTMLCollectionOf<HTMLElement>;
    for (let logo of logos)
        if (logo.dataset.id === id) logo.style.display = status ? "inline-block" : "none";
}

//////////////////
// time control //
//////////////////

// load time stamps and convert into human readable format
export function add_moments(): void {
    let moment_elements = document.getElementsByClassName(
        "moment-from-now"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let moment_element of moment_elements) {
        let this_moment = moment.utc(
            moment_element.dataset.time!,
            "YYYY-MM-DD HH:mm:ss.SSS"
        );
        moment_element.innerText = this_moment.fromNow();
    }
}
