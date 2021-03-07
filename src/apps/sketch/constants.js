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
};

Object.freeze(MESSAGE_TYPE);