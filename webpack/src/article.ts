export function get_dynamic_resource_urls(): { [filename: string]: string; } {
    let dynamic_resource_urls: { [filename: string]: string; } = {};
    let elements = document.getElementsByTagName("dynamic_resource_url");
    for (let element of elements)
        dynamic_resource_urls[element.getAttribute("filename")!] = element.getAttribute("address")!;
    return dynamic_resource_urls;
}

document.body.onload = () => {
    let dynamic_resource_urls = get_dynamic_resource_urls();

    let update_elements = document.getElementsByClassName("dynamic_resource") as HTMLCollectionOf<HTMLElement>;
    for (let element of update_elements) {
        let filename = element.dataset.filename!;
        let address = dynamic_resource_urls[filename];
        if (address === undefined)
            console.log(`can't find resource '${filename}'`);
        element.setAttribute("href", address);
        element.setAttribute("src", address);
        // videos need to be reloaded
        if (element.parentElement?.tagName === "VIDEO") {
            (element.parentElement as HTMLVideoElement).load();
        }
    }
};
