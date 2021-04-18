// represent one endpoint the client can talk to
export class AjaxAddress {
    private name;
    private url: string;
    constructor(name: string) {
        this.name = name;
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

// add click listener to buttons of <button_class>
export function add_button_listener(
    button_class: string,
    callback: { (button: HTMLButtonElement): void }
): void {
    let buttons = document.getElementsByClassName(
        button_class
    ) as HTMLCollectionOf<HTMLButtonElement>;

    for (let button of buttons)
        button.addEventListener("click", (e) => {
            callback(button);
        });
}

// hide or unhide spinner
export function set_load_status(element: HTMLElement, loading: boolean, text = "Loading..."): void {
    let on_loads = element.getElementsByClassName("on-loads") as HTMLCollectionOf<HTMLElement>;
    if (loading) {
        // disable button
        element.setAttribute("disabled", "");
        // unhide spinner
        for (let on_load of on_loads) on_load.style.display = "inline-block";
    } else {
        // enable button
        element.removeAttribute("disabled");
        // hide spinner
        for (let on_load of on_loads) on_load.style.display = "none";
    }
    // update text
    let text_element = element.getElementsByClassName(
        "button-text"
    ) as HTMLCollectionOf<HTMLElement>;
    text_element[0].innerText = text;
}
