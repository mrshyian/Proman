from flask import Flask, render_template, url_for, request, session, redirect
from dotenv import load_dotenv


from util import json_response, get_new_is_archived_status
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
        if session:
            print(session['id'])
            return queries.insert_new_board(session['id'])
        else:
            return queries.insert_new_board(0)
    elif request.method == 'PUT':
        board_id = request.json['id']
        new_title = request.json['title']
        queries.update_board_title(board_id, new_title)
    elif request.method == 'DELETE':
        board_id = request.json['id']
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


@app.route("/api/boards/<int:board_id>/card/", methods=['POST'])
@json_response
def create_card_for_board(board_id: int):
    return queries.insert_new_card(board_id)


@app.route("/api/boards/cards/<int:card_id>/", methods=['GET', 'DELETE', 'PUT'])
@json_response
def get_card(card_id: int):
    if request.method == 'GET':
        return queries.get_card(card_id)
    elif request.method == 'DELETE':
        return queries.delete_card(card_id)
    elif request.method == 'PUT':
        card_id = request.json['id']
        new_title = request.json['title']
        queries.update_card_title(card_id, new_title)


@app.route("/api/boards/cards/statuses/<int:board_id>/<int:card_id>/<int:status_id>", methods=['PUT'])
@json_response
def update_card_status(board_id: int, card_id: int, status_id: int):
    queries.update_card_status(board_id, card_id, status_id)


@app.route("/api/statuses/<int:board_id>/")
@json_response
def get_statuses(board_id):
    return queries.get_statuses(board_id)


@app.route("/api/cards/<int:card_id>/status/")
@json_response
def get_card_status(card_id):
    return queries.get_card_status(card_id)


@app.route("/api/boards/<int:board_id>/cards/archived")
@json_response
def get_archived_cards(board_id):
    return queries.get_archived_cards(board_id)


@app.route("/api/board/cards/<int:card_id>/archive", methods=['GET', 'PUT'])
@json_response
def change_card_archive_status(card_id):
    if request.method == 'PUT':
        card_id = request.json['id']
        is_archived_status = request.json['is_archived_status']
        new_is_archived_status = get_new_is_archived_status(is_archived_status)
    return queries.change_card_archive_status(card_id, new_is_archived_status)


@app.route("/api/boards/<int:board_id>/columns/", methods=['POST'])
@json_response
def create_new_column(board_id: int):
    return queries.insert_new_column(board_id)


@app.route("/api/boards/columns/<int:column_id>/", methods=['DELETE', 'PUT'])
@json_response
def delete_upgrade_column(column_id: int):
    if request.method == 'DELETE':
        queries.delete_column(column_id)
    elif request.method == 'PUT':
        new_title = request.json['title']
        queries.update_column_title(column_id, new_title)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        if request.form['user_name'] != '' and request.form['password_name'] != '':
            login = request.form['user_name']
            password = request.form['password_name']
            if util.verify_password(password, queries.login(login)[0]['password']):
                session['name'] = queries.login(login)[0]['name']
                session['email'] = queries.login(login)[0]['email']
                session['id'] = queries.login(login)[0]['id']
                return render_template('index.html', user_id=session['id'], user_name=session['name'])
            else:
                return util.INVALID_LOGIN_ATTEMPT
        else:
            return util.ENTER_ALL_VALUES
    return render_template('index.html')


@app.route('/logout')
def logout():
    session.pop('email', None)
    session.pop('name', None)
    session.pop('id', None)
    return redirect('/')


@app.route("/registration", methods=["POST", "GET"])
def create_new_account():
    if request.method == 'POST':
        firstName = request.form['registrationFirstName']
        secondName = request.form['registrationSecondName']
        email = request.form['registrationEmail']
        telephoneNumber = request.form['TelephoneNumber']
        hashpassword = util.hash_password(request.form['registrationPassword'])
        queries.create_account(firstName, secondName, email, telephoneNumber, hashpassword, )
    return render_template('index.html')


def main():
    app.run(host='0.0.0.0',
        port=8000,
        debug=True,)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    # queries.test();
    main()
