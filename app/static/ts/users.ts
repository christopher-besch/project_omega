class AjaxConnection {
    name: string;
    url: string;
    constructor(name: string) {
        this.name = name;
        // ger url from html
        let obj = document.getElementById(`${name}_ajax`) as HTMLElement;
        this.url = obj.getAttribute("url") as string;
    }

    do_request(response_callback: { (request: XMLHttpRequest): void }):

}

// load urls from html
let ajax_urls: { [name: string]: string } = {
    set_admin: "",
};

function get_ajax_urls(): void {
    for (let name in ajax_urls) {
        let obj = document.getElementById(`${name}_ajax`) as HTMLElement;
        let url = obj.getAttribute("url") as string;
        ajax_urls[name] = url;
    }
}

function set_admin(username: string, status: boolean): void {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        // when a response from the server has been received
        if (request.readyState === 4) {
            if (request.status === 20) {
                console.log(request.responseText);
            } else {
                // todo: better error
                alert("An error occurred!");
            }
        }
    };

    request.open("POST", "hello world");
}

function setup(): void {
    get_ajax_urls();
}
