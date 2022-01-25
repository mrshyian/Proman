import data_manager


def insertNewBoard():
    data_manager.execute_insert(
        """INSERT INTO boards (title) VALUES ('NEW BOARD');"""
    )


def delete_board(board_id):
    data_manager.execute_insert(
        """DELETE FROM boards  WHERE boards.id = %(board_id)s;""",
        {"board_id": board_id}

    )


def get_boards():
    return data_manager.execute_select(
        """SELECT * FROM boards;"""
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
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE board_id = %(board_id)s
        ORDER BY card_order;""",
        {"board_id": board_id}
    )

    return matching_cards


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
        """SELECT title FROM statuses;"""
    )


def get_card_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE id = %(status_id)s;"""
        , {"status_id": status_id}
    )

    return