from flask import Flask, render_template, url_for, request, session
from dotenv import load_dotenv


from util import json_response
import mimetypes, os
import queries
import util


mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = os.urandom(11)
load_dotenv()


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/api/boards", methods=['POST', 'GET', 'PUT', 'DELETE'])
@json_response
def get_boards():
    if request.method == 'POST':
        return queries.insert_new_board()
    elif request.method == 'PUT':
        board_id = request.json['id']
        new_title = request.json['title']
        queries.update_board_title(board_id, new_title)
    elif request.method == 'DELETE':
        board_id = request.json['id']
        print(board_id)
        queries.delete_board(board_id)

    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/")
@json_response
def get_single_board(board_id):
    return queries.get_single_board(board_id)


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/cards/<int:card_id>/")
@json_response
def get_card(card_id: int):
    return queries.get_card(card_id)


@app.route("/api/statuses")
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route("/api/statuses/<int:status_id>/")
@json_response
def get_card_status(status_id):
    return queries.get_card_status(status_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    # queries.test();
    main()
