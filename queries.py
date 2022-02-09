import data_manager


def insert_new_board():
    data_manager.execute_insert(
        """INSERT INTO boards (title) VALUES ('NEW BOARD');"""
    )
    response = data_manager.execute_select(
        """SELECT * FROM boards
           ORDER BY id DESC
           LIMIT 1;"""
    )
    if response is not None:
        return response[0]


def insert_new_card(board_id):
    data_manager.execute_insert(
        """INSERT INTO cards (board_id, status_id, title, card_order, is_archived) 
           VALUES (%(board_id)s, 1,'new card', 1, FALSE);""",
        {"board_id": board_id}
    )
    response = data_manager.execute_select(
        """SELECT * FROM cards
           ORDER BY id DESC
           LIMIT 1;"""
    )
    if response is not None:
        return response[0]


def insert_new_column():
    data_manager.execute_insert(
        """INSERT INTO statuses (title) 
           VALUES ('new column');""",
    )


def delete_board(board_id):
    data_manager.execute_insert(
        """SELECT * INTO TABLE todelete FROM boards
           WHERE id=%(board_id)s;
            
           DELETE FROM cards
           USING todelete
           WHERE cards.board_id=todelete.id;
           
           DROP TABLE IF EXISTS todelete;
            
           DELETE FROM boards
           WHERE id=%(board_id)s;
            
           """,
        {"board_id": board_id}
    )


def delete_card(card_id):
    data_manager.execute_insert(
        """DELETE FROM cards WHERE id = %(card_id)s;""",
        {"card_id": card_id}
    )


def delete_column(column_id):
    data_manager.execute_insert(
        """DELETE FROM statuses WHERE id = %(column_id)s;""",
        {"column_id": column_id}
    )


def update_board_title(board_id, new_title):
    data_manager.execute_insert(
        """
            UPDATE boards
            SET title = %(new_title)s
            WHERE id = %(board_id)s;""",
        {"board_id": board_id,
         "new_title": new_title}
    )


def update_card_title(card_id, new_title):
    data_manager.execute_insert(
        """
            UPDATE cards
            SET title = %(new_title)s
            WHERE id = %(board_id)s;""",
        {"board_id": card_id,
         "new_title": new_title}
    )



def update_card_status(board_id, card_id, new_status):
    data_manager.execute_insert(
        """
            UPDATE cards
            SET board_id = %(board_id)s, status_id = %(new_status)s
            WHERE id = %(card_id)s;""",
        {"card_id": card_id,
         "new_status": new_status,
         "board_id": board_id}

def update_column_title(column_id, new_title):
    data_manager.execute_insert(
        """
            UPDATE statuses
            SET title = %(new_title)s
            WHERE id = %(column_id)s;""",
        {"column_id": column_id,
         "new_title": new_title}

    )


def change_card_archive_status(card_id, is_archived_status):
    data_manager.execute_insert(
        f"""
            UPDATE cards
            SET is_archived = {is_archived_status}
            WHERE id = {card_id};"""
    )
    return data_manager.execute_select(
        f"""SELECT * FROM cards
           WHERE id = {card_id};"""
    )[0]


def get_boards():
    return data_manager.execute_select(
        """SELECT * FROM boards
           ORDER BY id;"""
    )


def get_single_board(board_id):
    board_title = data_manager.execute_select(
        """
            SELECT title FROM boards
            WHERE id = %(board_id)s
            ORDER BY id;""",
        {'board_id': board_id}
    )
    return board_title


def get_cards_for_board(board_id):
    return data_manager.execute_select(
        f"""
        SELECT * FROM cards
        WHERE board_id = {board_id} and cards.is_archived = false
        ORDER BY card_order;"""
    )


def get_archived_cards(board_id):
    return data_manager.execute_select(
        f"""
        SELECT * FROM cards
        WHERE board_id = {board_id} and cards.is_archived = true
        ORDER BY cards.id DESC;"""
    )


def get_card(card_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE id = %(card_id)s;""",
        {"card_id": card_id}
    )

    return matching_cards


def get_statuses():
    return data_manager.execute_select(
        """SELECT * FROM statuses
            ORDER BY id ASC;"""
    )


def get_card_status(card_id):
    status = data_manager.execute_select(
        """
        SELECT status_id FROM cards
        WHERE id = %(card_id)s;"""
        , {"card_id": card_id}
    )

    return status




# Registration

def create_account(name, secondname, email, telephonenumber, password):
    query =("""
        INSERT INTO userinfo
        (name, email, telephonenumber, password, secondname, registration_date)
        VALUES (%(name)s, %(email)s, %(telephonenumber)s, %(password)s, %(secondname)s, NOW())""")
    data_manager.execute_insert(query, {'name': name, 'email': email, 'telephonenumber': telephonenumber, 'password': password, 'secondname': secondname})


def login(email):
    query = data_manager.execute_select(
        """
    SELECT password, name, email, id
    FROM userinfo
    WHERE email = %(email)s;
    """
        , {'email': email}
    )
    return query


