const CHARACTER_DATA = {
    'player': {
        'down': [
            ['F','F','F','F','F','6','6','6','6','6','6','F','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','6','6','8','8','8','8','6','6','F','F','F','F'],
            ['F','F','F','F','6','8','8','8','8','8','8','6','F','F','F','F'],
            ['F','F','F','F','6','8','G','8','8','G','8','6','F','F','F','F'],
            ['F','F','F','F','8','8','8','8','8','8','8','8','F','F','F','F'],
            ['F','F','F','F','8','8','8','G','G','8','8','8','F','F','F','F'],
            ['F','F','F','F','F','8','8','8','8','8','8','F','F','F','F','F'],
            ['F','F','F','F','F','G','8','8','8','8','G','F','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','4','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','4','G','G','G','F','F','F','F'],
            ['F','F','F','F','8','G','G','G','G','G','G','8','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','8','8','F','F','8','8','F','F','F','F','F'],
        ],
        'top': [
            ['F','F','F','F','F','6','6','6','6','6','6','F','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','8','6','6','6','6','6','6','8','F','F','F','F'],
            ['F','F','F','F','8','8','6','6','6','6','8','8','F','F','F','F'],
            ['F','F','F','F','F','8','8','8','8','8','8','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','8','G','G','G','G','G','G','8','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','8','8','F','F','8','8','F','F','F','F','F'],
        ],
        'left': [
            ['F','F','F','F','F','6','6','6','6','6','6','F','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','8','8','8','8','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','8','8','8','8','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','8','G','8','8','8','6','6','6','F','F','F','F'],
            ['F','F','F','F','8','8','8','8','8','8','6','6','F','F','F','F'],
            ['F','F','F','F','G','8','8','8','8','8','8','F','F','F','F','F'],
            ['F','F','F','F','8','8','8','8','8','8','8','F','F','F','F','F'],
            ['F','F','F','F','F','8','8','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','4','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','4','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','8','8','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','F','F','8','8','F','F','F','F','F','F','F'],
        ],
        'right': [
            ['F','F','F','F','F','6','6','6','6','6','6','F','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','6','6','6','6','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','8','8','8','8','F','F','F','F'],
            ['F','F','F','F','6','6','6','6','8','8','8','8','F','F','F','F'],
            ['F','F','F','F','6','6','6','8','8','8','G','8','F','F','F','F'],
            ['F','F','F','F','6','6','8','8','8','8','8','8','F','F','F','F'],
            ['F','F','F','F','F','8','8','8','8','8','8','G','F','F','F','F'],
            ['F','F','F','F','F','8','8','8','8','8','8','8','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','8','8','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','8','8','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','F','F','8','8','F','F','F','F','F','F','F'],
        ],
    },
    'enemy': {
        'down': [
            ['F','F','F','F','F','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','G','1','1','G','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','G','1','1','G','1','1','F','F','F','F'],
            ['F','F','F','F','1','G','G','1','1','G','G','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','F','1','G','1','1','G','1','F','F','F','F','F'],
            ['F','F','F','F','F','G','1','1','1','1','G','F','F','F','F','F'],
            ['F','F','F','F','G','1','G','G','G','G','1','G','F','F','F','F'],
            ['F','F','F','F','G','G','1','G','G','1','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','1','1','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','1','3','3','3','3','3','3','1','F','F','F','F'],
            ['F','F','F','F','F','3','3','3','3','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','1','1','F','F','1','1','F','F','F','F','F'],
        ],
        'top': [
            ['F','F','F','F','F','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','F','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
            ['F','F','F','F','1','3','3','3','3','3','3','1','F','F','F','F'],
            ['F','F','F','F','F','3','3','3','3','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','1','1','F','F','1','1','F','F','F','F','F'],
        ],
        'left': [
            ['F','F','F','F','F','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','G','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','G','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','G','G','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','G','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','F','1','1','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','1','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','1','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','1','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','3','3','1','1','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','3','3','3','3','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','F','F','1','1','F','F','F','F','F','F','F'],
        ],
        'right': [
            ['F','F','F','F','F','1','1','1','1','1','1','F','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','G','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','1','G','1','F','F','F','F'],
            ['F','F','F','F','1','1','1','1','1','G','G','1','F','F','F','F'],
            ['F','F','F','F','F','1','1','1','1','1','1','1','F','F','F','F'],
            ['F','F','F','F','F','1','1','1','1','1','1','G','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','1','1','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','1','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','1','G','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','1','F','F','F','F','F'],
            ['F','F','F','F','F','G','G','G','G','G','G','F','F','F','F','F'],
            ['F','F','F','F','F','3','3','1','1','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','3','3','3','3','3','3','F','F','F','F','F'],
            ['F','F','F','F','F','F','F','1','1','F','F','F','F','F','F','F'],
        ],
    },
};

const HOLE_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','C','C','C','C','C','C','C','C','F','F','F','F'],
    ['F','F','F','C','C','C','C','C','C','C','C','C','C','F','F','F'],
    ['F','C','C','C','G','G','G','G','G','G','G','G','C','C','C','F'],
    ['C','C','C','G','G','G','G','G','G','G','G','G','G','C','C','C'],
    ['C','G','G','G','G','G','G','G','G','G','G','G','G','G','G','C'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['F','G','G','G','G','G','G','G','G','G','G','G','G','G','G','F'],
    ['F','F','F','G','G','G','G','G','G','G','G','G','G','F','F','F'],
    ['F','F','F','F','G','G','G','G','G','G','G','G','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];

const COIN_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','B','B','B','B','B','F','F','F','F','F'],
    ['F','F','F','F','F','B','9','D','D','D','D','B','F','F','F','F'],
    ['F','F','F','F','B','9','B','E','E','E','B','9','E','F','F','F'],
    ['F','F','F','F','B','D','E','9','9','9','E','D','E','F','F','F'],
    ['F','F','F','F','B','D','E','9','9','9','E','D','E','F','F','F'],
    ['F','F','F','F','B','D','E','9','9','9','E','D','E','F','F','F'],
    ['F','F','F','F','B','D','E','9','9','9','E','D','E','F','F','F'],
    ['F','F','F','F','B','D','E','9','9','9','E','D','E','F','F','F'],
    ['F','F','F','F','B','D','9','E','E','E','9','D','E','F','F','F'],
    ['F','F','F','F','F','D','D','D','D','D','D','E','F','F','F','F'],
    ['F','F','F','F','F','F','E','E','E','E','E','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];

const STAIRS_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','C','C','C','G'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','C','C','G','C'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','C','C','C','G'],
    ['F','F','F','F','F','F','F','F','C','C','C','G','C','C','G','C'],
    ['F','F','F','F','F','F','F','F','C','C','G','C','C','C','C','G'],
    ['F','F','F','F','F','F','F','F','C','C','C','G','C','C','G','C'],
    ['F','F','F','F','C','C','C','G','C','C','G','C','G','G','G','G'],
    ['F','F','F','F','C','C','G','C','C','C','C','G','G','G','G','G'],
    ['F','F','F','F','C','C','C','G','C','C','G','C','G','G','G','G'],
    ['C','C','C','G','C','C','G','C','G','G','G','G','G','G','G','G'],
    ['C','C','G','C','C','C','C','G','G','G','G','G','G','G','G','G'],
    ['C','C','C','G','C','C','G','C','G','G','G','G','G','G','G','G'],
    ['C','C','G','C','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['C','C','C','G','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['C','C','G','C','G','G','G','G','G','G','G','G','G','G','G','G'],
    ['G','G','G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
];

const SHOVEL_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','G','G','G','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','G','C','C','C','G','F'],
    ['F','F','F','F','F','F','F','F','F','G','C','C','A','C','G','F'],
    ['F','F','F','F','F','F','F','F','G','C','C','A','C','C','G','F'],
    ['F','F','F','F','F','F','F','F','F','G','A','C','C','G','F','F'],
    ['F','F','F','F','F','F','F','F','H','7','G','C','G','F','F','F'],
    ['F','F','F','F','F','F','F','H','7','H','F','G','F','F','F','F'],
    ['F','F','F','F','F','F','H','7','H','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','H','7','H','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','H','7','H','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','H','7','H','F','F','F','F','F','F','F','F','F','F'],
    ['F','H','H','7','H','F','F','F','F','F','F','F','F','F','F','F'],
    ['H','F','F','H','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['H','F','F','H','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','H','H','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];

const SWORD_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','G','G','G','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','G','C','C','C','G','F'],
    ['F','F','F','F','F','F','F','F','F','G','C','C','A','C','G','F'],
    ['F','F','F','F','F','F','F','F','G','C','C','A','C','C','G','F'],
    ['F','F','F','F','F','F','F','G','C','C','A','C','C','G','F','F'],
    ['F','F','F','F','F','F','G','C','C','A','C','C','G','F','F','F'],
    ['F','F','H','F','F','G','C','C','A','C','C','G','F','F','F','F'],
    ['F','F','H','H','G','C','C','A','C','C','G','F','F','F','F','F'],
    ['F','F','F','H','G','C','A','C','C','G','F','F','F','F','F','F'],
    ['F','F','F','F','I','I','C','C','G','F','F','F','F','F','F','F'],
    ['F','F','F','H','I','I','G','G','F','F','F','F','F','F','F','F'],
    ['F','F','H','7','H','F','H','H','F','F','F','F','F','F','F','F'],
    ['F','H','7','H','F','F','F','H','H','F','F','F','F','F','F','F'],
    ['H','7','H','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','H','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];

const ONIGIRI_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','G','G','G','G','F','F','F','F','F','F'],
    ['F','F','F','F','F','G','1','1','1','1','G','F','F','F','F','F'],
    ['F','F','F','F','G','1','1','1','1','1','1','G','F','F','F','F'],
    ['F','F','F','G','1','1','1','1','1','1','1','1','G','F','F','F'],
    ['F','F','F','G','1','1','1','1','1','1','1','1','G','F','F','F'],
    ['F','F','G','1','1','1','1','1','1','1','1','1','1','G','F','F'],
    ['F','F','G','1','1','1','1','1','1','1','1','1','1','G','F','F'],
    ['F','F','G','1','1','1','1','1','1','1','1','1','1','G','F','F'],
    ['F','F','G','1','1','G','G','G','G','G','G','1','1','G','F','F'],
    ['F','G','1','1','1','G','G','G','G','G','G','1','1','1','G','F'],
    ['F','G','1','1','1','G','G','G','G','G','G','1','1','1','G','F'],
    ['F','G','1','1','1','G','G','G','G','G','G','1','1','1','G','F'],
    ['F','G','1','1','1','G','G','G','G','G','G','1','1','1','G','F'],
    ['F','F','G','G','G','G','G','G','G','G','G','G','G','G','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];


const KEY_IMG = [
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','9','9','9','E','E','E','F','F','F','F','F'],
    ['F','F','F','F','F','9','9','9','F','E','E','F','F','F','F','F'],
    ['F','F','F','F','F','9','9','9','E','E','E','F','F','F','F','F'],
    ['F','F','F','F','F','9','9','9','E','E','E','F','F','F','F','F'],
    ['F','F','F','F','F','F','9','9','E','E','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','9','E','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','E','F','F','F','F','F','F','F','F'],
    ['F','F','F','F','F','F','F','F','F','F','F','F','F','F','F','F'],
];

const PIXEL_SIZE = 2;
const WALL_COLOR = "rgb(100, 100, 100)";
const GROUND_COLOR = "rgb(  0,176, 80)";
const FPS = 60;
const FRAME_TIME = 1 / FPS;

const PLAYER_SIGN = 'P';
const ENEMY_SIGN = 'E';
const THING_SIGN = 'T';
const HOLE_SIGN = 'H';
const EXIT_SIGN = 'E';

const COLORS = {
    '0': GROUND_COLOR,
    '1': "rgb(255,255,255)",    // 白
    '2': "rgb(  1,  1,  1)",    // 黒
    '3': "rgb(255,  0,  0)",    // 赤(穴掘る人の帽子、ガイコツのズボン)
    '4': "rgb(217,217,217)",    // グレー(ガイコツの肌)
    '5': "rgb(  0,176, 80)",    // 緑
    '6': "rgb(255,192,  0)",    // オレンジ(掘る人の髪)
    '7': "rgb(204,102,  0)",    // 茶色
    '8': "rgb(255,255,153)",    // 肌色
    '9': "rgb(255,255,  0)",    // 黄色　コインメイン
    'A': WALL_COLOR,
    'B': "rgb(255,200,  0)",    // コイン　2段階目
    'C': "rgb(120,120,120)",    // 穴の影
    'D': "rgb(255,180,  0)",    // コイン　3段階目
    'E': "rgb(255,150,  0)",    // コイン　4段階目
    'G': "rgb(1,1,1)",          // 黒
    'H': "rgb(100,51,0)",          // 黒
    'I': "rgb(0,112,192)",  // 剣の宝石
};

const CHARACTER_SIZE = CHARACTER_DATA.player.down.length+1;
const MINIMUM_ROOM_SIZE = CHARACTER_SIZE * 3;
const ROOM_MARGIN = (CHARACTER_SIZE - 1) * 2;
const DEBUG = false;
const MESSAGE_WINDOW_HEIGHT = 100;