import { add_button_links, add_button_listener, add_moments, get_ajax_urls, set_logo, toggle_button, } from "./utils.js";
let ajax_urls = get_ajax_urls(["set-unlisted", "set-author"]);
document.body.onload = () => {
    add_button_links();
    add_button_listener("toggle-unlisted", (b) => {
        let internal_name = b.dataset.internal_name;
        toggle_button(b, ajax_urls["set-unlisted"], { internal_name }, (resp) => { });
    });
    add_button_listener("toggle-author", (b) => {
        let username = b.dataset.username;
        let internal_name = b.dataset.internal_name;
        toggle_button(b, ajax_urls["set-author"], { username, internal_name }, (resp) => {
            set_logo("is-author", username, resp.status);
        });
    });
    add_moments();
};
//# sourceMappingURL=edit_article.js.map