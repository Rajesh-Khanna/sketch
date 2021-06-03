// --------------- Networking ---------------------- 
export const CONFIGURATION = {
    'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' },
        { 'url': 'stun:stun1.l.google.com:19302' },
        { 'url': 'stun:stun2.l.google.com:19302' },
        { 'url': 'stun:stun3.l.google.com:19302' },
        { 'url': 'stun:stun4.l.google.com:19302' },
    ]
};

// -------------------------------------------------

export const APP_STATE = {
    HOST: 'HOST',
    GATHERING: 'GATHERING',
    PASSIVE_BOARD: 'PASSIVE_BOARD',
    ACTIVE_BOARD: 'ACTIVE_BOARD',
    TERMINAL: 'TERMINAL',
    DISCONNECTED: 'DISCONNECTED',
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

export const HOME_PAGE_URL = '/'; // todo: change this to a valid home page url

export const LOBBY_COLLECTION = 'LOBBY_COLLECTION';

export const MAX_FONT = 80;
export const MIN_FONT = 1;

export const DEFAULT_BACKGROUND_COLOR = '#fff';

// --------------- Meta Channel types ----------------------
export const META_TYPES = {
    NEW_PLAYER: 'NEW_PLAYER',
    PLAYERS: 'PLAYERS',
    START_GAME: 'START_GAME',
    END_GAME: 'END_GAME',
    RESET_GAME: 'RESET_GAME',
    HEART_BEAT: 'HEART_BEAT',
    ALIVE: 'ALIVE',
    TURN_TIME: 'TURN_TIME',
    ROUND_NUM: 'ROUND_NUM',
}

export const CHAT_TYPE = {
    GUESS: 'GUESS',
    SOLVED: 'SOLVED',
    CLUE: 'CLUE',
    CORRECT_WORD: 'CORRECT_WORD',
}

export const POPUP_TIMEOUT = 4000;

export const TURN_TIME = 80;
export const ROUNDS = 3;

export const SKETCH_CHANNELS = [
    { name: 'meta', type: 'data' },
    { name: 'brush', type: 'data' },
    { name: 'chat', type: 'data' },
    { name: 'background', type: 'data' }
];

export const firebaseConfig = {
    apiKey: "AIzaSyC76AeV9WHmHfgN0dSJcMLfXOHHI09ZZDs",
    authDomain: "sketch-e5889.firebaseapp.com",
    projectId: "sketch-e5889",
    storageBucket: "sketch-e5889.appspot.com",
    messagingSenderId: "417640075335",
    appId: "1:417640075335:web:d27812bbfa1a905bcea162",
    measurementId: "G-2RWBX5QBR6"
};