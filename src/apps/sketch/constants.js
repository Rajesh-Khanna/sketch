export const APP_STATE = {
    HOST: 'HOST',
    GATHERING: 'GATHERING',
    PASSIVE_BOARD: 'PASSIVE_BOARD',
    ACTIVE_BOARD: 'ACTIVE_BOARD',
    TERMINAL: 'TERMINAL',
};

Object.freeze(APP_STATE);

export const USER_TYPE = {
    HOST: 'HOST',
    GUEST: 'GUEST',
};

Object.freeze(USER_TYPE);

export const MESSAGE_TYPE = {
    CLIENT: 'CLIENT',
    OFFER: 'OFFER',
    ANSWER: 'ANSWER',
    GUEST: 'GUEST'
};

Object.freeze(MESSAGE_TYPE);

export const LOBBY_COLLECTION = 'LOBBY_COLLECTION';

export const MAX_FONT = 80;
export const MIN_FONT = 1;

export const DEFAULT_BACKGROUND_COLOR = 225;

// --------------- Meta Channel types ----------------------
export const META_TYPES = {
    NEW_PLAYER: 'NEW_PLAYER',
    PLAYERS: 'PLAYERS',
    START_GAME: 'START_GAME',
    END_GAME: 'END_GAME',
    RESET_GAME: 'RESET_GAME',
    HEART_BEAT: 'HEART_BEAT',
    ALIVE: 'ALIVE',
}

export const CHAT_TYPE = {
    GUESS: 'GUESS',
    SOLVED: 'SOLVED',
    CLUE: 'CLUE',
    CORRECT_WORD: 'CORRECT_WORD',
}

export const POPUP_TIMEOUT = 4000;