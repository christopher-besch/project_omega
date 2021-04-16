// represent one endpoint the client can talk to
export class AjaxAddress {
    constructor(name) {
        this.name = name;
        // load urls from html
        let obj = document.getElementById(`${name}_ajax`);
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
