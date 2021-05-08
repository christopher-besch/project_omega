const path = require("path");

module.exports = (env) => {
    return {
        // can be development or production
        mode: env["production"] ? "production" : "development",
        // eval good for development
        devtool: env["production"] ? false : "eval-source-map",
        // only entry file, include any imported files
        entry: {
            article_overview: "./src/article_overview.ts",
            delete: "./src/delete.ts",
            edit_article: "./src/edit_article.ts",
            users: "./src/users.ts",
        },
        module: {
            rules: [
                {
                    // when test passed
                    test: /\.ts$/,
                    // use ts-loader to compile
                    use: "ts-loader",
                    include: [path.resolve(__dirname, "src")],
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        output: {
            // tell dev server where to serve code in memory from
            publicPath: "../app/static/js",
            // template based on keys in entry
            filename: "[name].js",
            // need absolute path
            path: path.resolve(__dirname, "../app/static/js"),
        },
        devServer: {
            publicPath: "/",
            contentBase: "../app/static/js",
            hot: true,
        },
    };
};
