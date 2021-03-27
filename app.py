from flask import Flask, url_for

app = Flask(__name__)


@app.route("/")
def hello_world():
    x = 0 / 0
    return "Welcome World!"


@app.route("/test")
def test():
    return url_for("static", filename="test.html")
