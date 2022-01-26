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


@app.route("/api/add_new_board/")
@json_response
def insert_new_board():
    return queries.insertNewBoard()


@app.route("/api/boards/<int:board_id>/delete/")
@json_response
def delete_board(board_id):
    return queries.delete_board(board_id)


@app.route("/api/boards/<int:board_id>/<new_title>/")
@json_response
def update_board_title(new_title, board_id):
    return queries.update_board_title(board_id, new_title)


@app.route("/api/boards")
@json_response
def get_boards():
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


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        if request.form['user_name'] != '' and request.form['password_name'] != '':
            login = request.form['user_name']
            password = request.form['password_name']
            print(queries.login(login)[0]['id'])
            if util.verify_password(password, queries.login(login)[0]['password']):
                session['name'] = queries.login(login)[0]['name']
                session['email'] = queries.login(login)[0]['email']
                session['id'] = queries.login(login)[0]['id']
                return util.YOU_ARE_LOGGED_IN
            else:
                return util.INVALID_LOGIN_ATTEMPT
        else:
            return util.ENTER_ALL_VALUES
    return render_template('index.html')



def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    # queries.test();
    main()
