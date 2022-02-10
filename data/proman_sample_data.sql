--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS statuses_and_boards CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS userinfo;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL
);

CREATE TABLE statuses_and_boards (
    id       SERIAL PRIMARY KEY     NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    user_id     INTEGER
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    is_archived  BOOLEAN             NOT NULL
);

CREATE TABLE userinfo (
    id          SERIAL PRIMARY KEY  NOT NULL,
    name        TEXT                NOT NULL,
    secondname  TEXT                NOT NULL,
    email       TEXT                NOT NULL,
    telephonenumber  INTEGER        NOT NULL,
    password      VARCHAR           NOT NULL,
    registration_date  TIME         NOT NULL
);

---
--- insert data
---

INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');
INSERT INTO statuses(title) VALUES ('new');
INSERT INTO statuses(title) VALUES ('in progress');
INSERT INTO statuses(title) VALUES ('testing');
INSERT INTO statuses(title) VALUES ('done');

INSERT INTO boards(title, user_id) VALUES ('Board 1', 0);
INSERT INTO boards(title, user_id) VALUES ('Board 2', 0);

INSERT INTO statuses_and_boards(board_id, status_id) VALUES (1, 1);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (1, 2);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (1, 3);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (1, 4);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (2, 5);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (2, 6);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (2, 7);
INSERT INTO statuses_and_boards(board_id, status_id) VALUES (2, 8);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 1', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 2', 2, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'in progress card', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'planning', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 1, FALSE);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 2, FALSE);

