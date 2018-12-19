from flask import Flask, render_template, jsonify
from stock_scraper import get_data

application = Flask(__name__)


@application.route("/")
def index():
    return render_template("index.html")

@application.route("/v3")
def v3():
    return render_template("v3.html")

@application.route('/data')
def data():
    return jsonify(get_data())

if __name__ == "__main__":
    app.run(debug=True)
