/*
 * Low Battery
 * A puzzle about untangling charging cables so your phone gets the power it needs.
 *
 * Rebuilt for PewPlay from "13% LOW" by Marvin (js13kGames 2024), released under
 * the MIT license (see LICENSE). Level design, pixel art, sound and rules come
 * from the original game; rendering, layout, input and menus were rewritten so
 * the game fills any screen and plays well with mouse, keyboard and touch.
 */
(function () {
  'use strict';

  const SLUG = 'low-battery';

  /* ------------------------------------------------------------------ */
  /*  Pixel art (11x11 sprites and a 5x7 font, '#' = filled pixel)       */
  /* ------------------------------------------------------------------ */

  const SPRITES = {
    start: [
      '....###....',
      '.......#...',
      '...###..#..',
      '..#...#..#.',
      '.#..#..#..#',
      '#..#.#.#..#',
      '#..#...#..#',
      '.#..###..#.',
      '..#.....#..',
      '...#...#...',
      '....###....',
    ],
    goal: [
      '.....#.....',
      '...........',
      '###########',
      '#.........#',
      '#.###.###.#',
      '#.###.###.#',
      '#.###.###.#',
      '#.........#',
      '###########',
      '...........',
      '...........',
    ],
    button: [
      '.....#.....',
      '...........',
      '..#######..',
      '..#######..',
      '..#######..',
      '..#######..',
      '..#######..',
      '###########',
      '##..#..#..#',
      '#.#..#..#.#',
      '##.#..#..##',
    ],
    recycle: [
      '.#########.',
      '#.........#',
      '#...###...#',
      '#..#...#..#',
      '#.#.###.#.#',
      '#.#.###.#.#',
      '#.#.###.#.#',
      '#..#...#..#',
      '#...###...#',
      '#.........#',
      '.#########.',
    ],
    arrow: [
      '#..##.....#',
      '....##.....',
      '.....##....',
      '...#..##...',
      '...##..##..',
      '.....#..##.',
      '...##..##..',
      '...#..##...',
      '.....##....',
      '....##.....',
      '#..##.....#',
    ],
    wall: [
      '###########',
      '##..#..#..#',
      '#.#..#..#.#',
      '#..#..#..##',
      '##..#..#..#',
      '#.#..#..#.#',
      '#..#..#..##',
      '##..#..#..#',
      '#.#..#..#.#',
      '#..#..#..##',
      '###########',
    ],
    tempWall: [
      '###########',
      '##.#.#.#.##',
      '#.#.#.#.#.#',
      '##.#.#.#.##',
      '#.#.#.#.#.#',
      '##.#.#.#.##',
      '#.#.#.#.#.#',
      '##.#.#.#.##',
      '#.#.#.#.#.#',
      '##.#.#.#.##',
      '###########',
    ],
    fail: [
      '.#########.',
      '##.......##',
      '#.#.....#.#',
      '#..#...#..#',
      '#...###...#',
      '#...###...#',
      '#...###...#',
      '#..#...#..#',
      '#.#.....#.#',
      '##.......##',
      '.#########.',
    ],
    cableCorner: [
      '#.........#',
      '...........',
      '#########..',
      '..#..#..#..',
      '#..#..#.#..',
      '.#..#..##..',
      '..#..#..#..',
      '#..#..#.#..',
      '###.#..##..',
      '..#..#..#..',
      '..#...#.#.#',
    ],
    cableStraight: [
      '..#..#..#..',
      '..##..#.#..',
      '..#.#..##..',
      '..#..#..#..',
      '..#...#.#..',
      '..##...##..',
      '..#.#...#..',
      '..#..#..#..',
      '..#...#.#..',
      '..##...##..',
      '..#.#...#..',
    ],
    home: [
      '....###....',
      '...##.##...',
      '..##...##..',
      '.##..#..##.',
      '##..###..##',
      '#..##.##..#',
      '##.#...#.##',
      '.#.#...#.#.',
      '.#.#####.#.',
      '.#.......#.',
      '.#########.',
    ],
    restart: [
      '...........',
      '..########.',
      '..#......#.',
      '#####..#.#.',
      '.###..##.#.',
      '..#..#.#.#.',
      '....#..#.#.',
      '.##.####.#.',
      '.##......#.',
      '..########.',
      '...........',
    ],
    scrollButton: [
      '#..#......#',
      '....#......',
      '.....#.....',
      '......#....',
      '.......#...',
      '........#..',
      '.......#...',
      '......#....',
      '.....#.....',
      '....#......',
      '#..#......#',
    ],
    hintArrowA: [
      '...........',
      '....#......',
      '....##.....',
      '....###....',
      '########...',
      '#########..',
      '########...',
      '....###....',
      '....##.....',
      '....#......',
      '...........',
    ],
    hintArrowB: [
      '...........',
      '......#....',
      '......##...',
      '......###..',
      '..########.',
      '..#########',
      '..########.',
      '......###..',
      '......##...',
      '......#....',
      '...........',
    ],
    plugA: [
      '...........',
      '..######...',
      '###.#..##..',
      '.#.#..#####',
      '.##..#.#...',
      '.#..#..#...',
      '.#.#..##...',
      '.##..#.####',
      '###.#..##..',
      '..######...',
      '...........',
    ],
    plugB: [
      '...........',
      '..######...',
      '###..#.##..',
      '.#..#..####',
      '.#.#..##...',
      '.##..#.#...',
      '.#..#..#...',
      '.#.#..#####',
      '###..#.##..',
      '..######...',
      '...........',
    ],
    sound: [
      '#.......#..',
      '##.....#...',
      '###...#....',
      '####.#.....',
      '####.......',
      '####.#####.',
      '####.......',
      '####.#.....',
      '###...#....',
      '##.....#...',
      '#.......#..',
    ],
  };

  const GLYPHS = {
    ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
    '%': ['##.##', '##.#.', '...#.', '.###.', '.#...', '.#.##', '##.##'],
    '!': ['.###.', '.#.#.', '.#.#.', '.#.#.', '..#..', '.....', '..#..'],
    '?': ['.###.', '#...#', '#...#', '...#.', '..#..', '.....', '..#..'],
    '0': ['.###.', '##..#', '#.#.#', '#.#.#', '#.#.#', '#..##', '.###.'],
    '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    '2': ['.###.', '#...#', '#...#', '..##.', '##...', '#...#', '#####'],
    '3': ['.###.', '#...#', '#...#', '..##.', '#...#', '#...#', '.####'],
    '4': ['#..#.', '#..#.', '#..#.', '#####', '...#.', '...#.', '...#.'],
    '5': ['.###.', '#...#', '#....', '.###.', '....#', '#...#', '.###.'],
    '6': ['.###.', '#...#', '#....', '####.', '#...#', '#...#', '.###.'],
    '7': ['#####', '....#', '...#.', '..#..', '..#..', '..#..', '..#..'],
    '8': ['.####', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    '9': ['.####', '#...#', '#...#', '.####', '....#', '....#', '....#'],
    'A': ['.###.', '##.##', '#...#', '#...#', '#####', '##.##', '#...#'],
    'B': ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
    'C': ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
    'D': ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
    'E': ['#####', '#...#', '#....', '####.', '#....', '#...#', '#####'],
    'F': ['#####', '#...#', '#....', '####.', '#....', '#....', '#....'],
    'G': ['.###.', '#...#', '#....', '#.###', '#.#.#', '#...#', '.###.'],
    'H': ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
    'I': ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    'J': ['....#', '....#', '....#', '....#', '.#..#', '.#..#', '..##.'],
    'K': ['#...#', '#...#', '#..#.', '###..', '#..#.', '#...#', '#...#'],
    'L': ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
    'M': ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
    'N': ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
    'O': ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'P': ['.###.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
    'Q': ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..##', '#####'],
    'R': ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
    'S': ['.###.', '#...#', '#....', '.###.', '....#', '#...#', '.###.'],
    'T': ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
    'U': ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
    'V': ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
    'W': ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
    'X': ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
    'Y': ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
    'Z': ['#####', '#...#', '...#.', '..#..', '.#...', '#...#', '#####'],
  };

  // A few extra glyphs in the same style as the original font
  // (and a plainer '!' that reads better at small sizes).
  Object.assign(GLYPHS, {
    '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
    '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
    '-': ['.....', '.....', '.....', '.###.', '.....', '.....', '.....'],
  });

  /* ------------------------------------------------------------------ */
  /*  Colors                                                             */
  /* ------------------------------------------------------------------ */

  const COLOR = {
    background: '#060606',
    board: '#065279',
    boardShadow: '#425066',
    levelDone: '#549688',
    levelHover: '#388e3c',
    alarm: '#e61c5d',
    charge: '#888800',
    good: '#22aa77',
    textMain: '#e29c45',
    textShadow: '#a78e44',
  };

  /* ------------------------------------------------------------------ */
  /*  Sprite sheets built at startup                                     */
  /* ------------------------------------------------------------------ */

  const PIXEL = 16; // source resolution of one art pixel

  function makeSprite(rows, color, outline) {
    const h = rows.length;
    const w = rows[0].length;
    const c = document.createElement('canvas');
    c.width = w * PIXEL;
    c.height = h * PIXEL;
    const g = c.getContext('2d');
    const on = (x, y) => y >= 0 && y < h && x >= 0 && x < w && rows[y][x] === '#';
    g.fillStyle = color;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!on(x, y)) continue;
        g.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
      }
    }
    if (outline) {
      // Light edge on the outside of every filled pixel (the original "stroke" style).
      g.strokeStyle = '#cccccc';
      g.lineWidth = 5;
      g.beginPath();
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (!on(x, y)) continue;
          const X = x * PIXEL, Y = y * PIXEL;
          if (!on(x - 1, y)) { g.moveTo(X, Y); g.lineTo(X, Y + PIXEL); }
          if (!on(x + 1, y)) { g.moveTo(X + PIXEL, Y); g.lineTo(X + PIXEL, Y + PIXEL); }
          if (!on(x, y - 1)) { g.moveTo(X, Y); g.lineTo(X + PIXEL, Y); }
          if (!on(x, y + 1)) { g.moveTo(X, Y + PIXEL); g.lineTo(X + PIXEL, Y + PIXEL); }
        }
      }
      g.stroke();
    }
    return c;
  }

  // Rotations used everywhere: right (0deg), left (180), up (270), down (90).
  const ROTATIONS = [0, 180, 270, 90];

  function rotateSprite(src, degrees) {
    const c = document.createElement('canvas');
    c.width = src.width;
    c.height = src.height;
    const g = c.getContext('2d');
    g.translate(c.width / 2, c.height / 2);
    g.rotate((degrees * Math.PI) / 180);
    g.drawImage(src, -c.width / 2, -c.height / 2);
    return c;
  }

  const fourWays = (rows, color) => {
    const base = makeSprite(rows, color);
    return ROTATIONS.map((a) => rotateSprite(base, a));
  };

  // Board tiles, indexed by the numbers used in the level maps.
  const TILE = {
    EMPTY: 0, START: 1, GOAL: 2, SWITCH: 3, RECYCLE: 4,
    RIGHT: 5, LEFT: 6, UP: 7, DOWN: 8,
    WALL: 9, CRACKED: 10, SHORT: 11,
    // 12-15 cable corners, 16-19 straight cable pieces
  };
  const isPassable = (v) => v <= 8;

  const TILES = [
    null,
    makeSprite(SPRITES.start, '#333333'),
    makeSprite(SPRITES.goal, '#22aa77'),
    makeSprite(SPRITES.button, '#333333'),
    makeSprite(SPRITES.recycle, '#ffffff'),
    ...fourWays(SPRITES.arrow, '#aa8844'),
    makeSprite(SPRITES.wall, '#333333'),
    makeSprite(SPRITES.tempWall, '#bbccbb'),
    makeSprite(SPRITES.fail, '#aa0000'),
    ...fourWays(SPRITES.cableCorner, '#221166'),
    ...fourWays(SPRITES.cableStraight, '#221166'),
  ];

  const ICON = {
    home: makeSprite(SPRITES.home, '#229977'),
    restart: rotateSprite(makeSprite(SPRITES.restart, '#ffffff'), 180),
    sound: makeSprite(SPRITES.sound, '#ffffff'),
    scrollRight: makeSprite(SPRITES.scrollButton, '#ffffff'),
    scrollLeft: rotateSprite(makeSprite(SPRITES.scrollButton, '#ffffff'), 180),
    hintA: fourWays(SPRITES.hintArrowA, '#ffffff'),
    hintB: fourWays(SPRITES.hintArrowB, '#ffffff'),
    plugA: fourWays(SPRITES.plugA, '#221166'),
    plugB: fourWays(SPRITES.plugB, '#221166'),
  };

  const FONT_MAIN = {};
  const FONT_SHADOW = {};
  for (const ch of Object.keys(GLYPHS)) {
    FONT_MAIN[ch] = makeSprite(GLYPHS[ch], COLOR.textMain, true);
    FONT_SHADOW[ch] = makeSprite(GLYPHS[ch], COLOR.textShadow, false);
  }

  /* ------------------------------------------------------------------ */
  /*  Levels (21 mazes from the original game)                           */
  /*  turns: how many times you may pick a direction                     */
  /*  items: arrow/switch/block pieces you can drag onto empty cells     */
  /* ------------------------------------------------------------------ */

  const LEVELS = [
    { turns: 1, items: [], map: [
      [1, 0, 0, 0, 2],
    ] },
    { turns: 1, items: [5], map: [
      [0, 0, 0, 0, 2],
      [1, 0, 0, 0, 9],
    ] },
    { turns: 1, items: [5, 7, 5, 7, 5, 8], map: [
      [1, 9, 0, 0, 0, 11, 2],
      [0, 0, 0, 11, 0, 0, 0],
    ] },
    { turns: 1, items: [5, 5, 7, 8], map: [
      [1, 0, 9, 0, 2],
      [0, 0, 0, 0, 9],
    ] },
    { turns: 2, items: [5, 7], map: [
      [8, 0, 0, 11, 0],
      [0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0],
      [0, 0, 0, 0, 6],
      [0, 11, 0, 1, 0],
    ] },
    { turns: 2, items: [7, 9], map: [
      [0, 0, 0, 0, 8],
      [0, 0, 0, 11, 0],
      [0, 0, 11, 2, 0],
      [0, 0, 0, 11, 0],
      [0, 1, 0, 0, 0],
    ] },
    { turns: 2, items: [6, 6, 10], map: [
      [8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 2, 9, 1],
      [0, 0, 0, 0, 0],
      [7, 0, 0, 0, 0],
    ] },
    { turns: 2, items: [9], map: [
      [0, 0, 11, 0, 0, 0],
      [0, 0, 0, 2, 0, 0],
      [0, 1, 0, 0, 11, 0],
    ] },
    { turns: 3, items: [8], map: [
      [0, 0, 10, 0, 0, 0],
      [0, 0, 2, 0, 0, 0],
      [0, 0, 0, 0, 1, 0],
    ] },
    { turns: 3, items: [7, 9], map: [
      [11, 11, 0, 0, 6, 0],
      [0, 0, 2, 0, 0, 10],
      [0, 11, 10, 0, 0, 0],
      [0, 0, 6, 0, 1, 0],
    ] },
    { turns: 3, items: [5, 6, 9], map: [
      [0, 0, 0, 0, 0, 0],
      [0, 11, 0, 0, 11, 0],
      [0, 11, 10, 0, 2, 10],
      [0, 11, 0, 0, 11, 0],
      [1, 0, 0, 0, 0, 0],
    ] },
    { turns: 3, items: [5, 6, 7, 8], map: [
      [0, 0, 10, 0, 0],
      [0, 11, 2, 11, 0],
      [0, 0, 11, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
    ] },
    { turns: 2, items: [10], map: [
      [0, 0, 9, 0, 0, 0],
      [0, 9, 2, 9, 3, 0],
      [0, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 1, 0],
    ] },
    { turns: 4, items: [5, 3, 7], map: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 8, 0, 0, 0, 0],
      [0, 11, 2, 9, 0, 0, 0],
      [0, 0, 9, 0, 0, 0, 0],
      [0, 0, 0, 10, 0, 0, 1],
    ] },
    { turns: 4, items: [3, 7], map: [
      [10, 4, 0, 10, 9, 0, 6],
      [0, 0, 0, 9, 9, 0, 0],
      [0, 0, 11, 0, 1, 11, 0],
      [0, 2, 0, 0, 0, 0, 0],
      [0, 11, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ] },
    { turns: 3, items: [5, 6, 7], map: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 9, 2, 9, 0],
      [0, 0, 0, 0, 0, 4, 0],
      [9, 0, 0, 0, 9, 0, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 11, 0, 3, 11],
    ] },
    { turns: 8, items: [4, 7, 10], map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 9, 0, 0, 0, 6, 6, 6],
      [0, 0, 0, 0, 0, 10, 0, 0, 9, 0],
      [0, 0, 3, 0, 7, 0, 0, 9, 2, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 9, 0],
    ] },
    { turns: 6, items: [7], map: [
      [10, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 9, 9, 9, 0, 0, 0],
      [1, 0, 11, 5, 2, 6, 11, 0, 0],
      [0, 0, 0, 9, 9, 9, 0, 0, 0],
      [0, 4, 0, 0, 0, 0, 0, 3, 0],
      [0, 0, 0, 0, 0, 10, 0, 0, 10],
    ] },
    { turns: 10, items: [], map: [
      [0, 0, 0, 0, 0, 9, 0, 4, 0, 0],
      [0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 9, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 9, 0, 0],
    ] },
    { turns: 8, items: [7], map: [
      [0, 0, 9, 0, 0, 0, 0, 0, 4, 0],
      [0, 2, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 3, 0, 0, 9, 9, 0, 0, 0],
      [0, 9, 0, 0, 0, 0, 9, 0, 1, 0],
      [0, 0, 0, 0, 9, 0, 0, 0, 0, 0],
    ] },
    { turns: 15, items: [8], map: [
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 3, 0, 0, 0, 0, 0],
      [9, 9, 9, 0, 0, 9, 9, 9, 9],
      [0, 0, 9, 0, 0, 0, 11, 0, 9],
      [0, 2, 9, 0, 0, 0, 9, 9, 9],
      [0, 0, 9, 0, 4, 0, 0, 11, 9],
      [11, 0, 9, 10, 0, 9, 9, 9, 9],
    ] },
  ];

  // Short tutorial lines shown under the board when something new appears.
  const CAPTIONS = {
    0: ['TAP AN ARROW', 'TO PLUG IN'],
    1: ['DRAG THE ARROW', 'ONTO THE BOARD'],
    2: ['AVOID THE', 'RED SOCKETS'],
    4: ['THE NUMBER SHOWS', 'TURNS LEFT'],
    8: ['STRIPED BLOCKS', 'BREAK WHEN HIT'],
    12: ['THE SWITCH', 'REMOVES ALL WALLS'],
    14: ['THE RECYCLER', 'CLEARS THE BOARD'],
  };

  // Direction tiles 5..8 and the step each one moves the plug by.
  const DIRS = { 5: [1, 0], 6: [-1, 0], 7: [0, -1], 8: [0, 1] };

  /* ------------------------------------------------------------------ */
  /*  Storage (keys prefixed with the game slug)                         */
  /* ------------------------------------------------------------------ */

  const store = {
    get(key) {
      try { return localStorage.getItem(SLUG + ':' + key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(SLUG + ':' + key, value); } catch (e) { /* storage unavailable */ }
    },
  };

  let completed = (() => {
    try {
      const saved = JSON.parse(store.get('progress'));
      if (Array.isArray(saved)) return LEVELS.map((_, i) => saved[i] ? 1 : 0);
    } catch (e) { /* ignore broken save */ }
    return LEVELS.map(() => 0);
  })();

  const batteryLevel = () =>
    Math.round(13 + (87 * completed.filter(Boolean).length) / LEVELS.length);

  /* ------------------------------------------------------------------ */
  /*  Audio: looping chiptune and two sound effects (original data)      */
  /* ------------------------------------------------------------------ */

  const Sound = (() => {
    let ac = null;
    let master = null;
    let muted = store.get('muted') === '1';
    let section = 0;
    let musicRunning = false;

    const NOTE = [0];
    for (let i = 0; i < 50; i++) NOTE.push(130.81 * Math.pow(2, i / 12));

    const WAVE = ['sawtooth', 'square', 'triangle', 'sine'];
    const FIFTHS = [
      [0, 13, 15, 17, 20, 22],
      [0, 17, 19, 21, 24, 26],
      [0, 20, 22, 24, 27, 29],
      [0, 24, 26, 28, 31, 33],
      [0, 27, 29, 31, 34, 36],
    ];
    // Each part: [wave, beat length, note length, voicings, melody, volume, attack]
    const SONG = {
      t: [
        [1, 0.5, 0.5, [[0, 1, 3, 4, 5, 7, 8, 10, 12]],
          [1, 0, 0, 1, 0, 2, 0, 0, 2, 3, 4, 5, 0, 0, 5, 4, 3, 0, 0, 2, 2, 0, 0, 0, 1, 1, 0], 0.1, 0.01],
        [3, 1, 1, FIFTHS, [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 3, 0, 1, 0, 0], 0.1, 0.01],
      ],
      b: [
        [1, 0.5, 0.5, [[0, 1, 3, 4, 5, 7, 8, 10, 12]],
          [0, 0, 6, 0, 4, 0, 5, 2, 6, 6, 0, 0, 4, 0, 0, 3, 0, 0, 6, 0, 4, 0, 5, 2,
            2, 0, 4, 0, 6, 4, 0, 3, 2, 6, 0, 7, 6, 0, 3, 4], 0.1, 0.01],
        [3, 1, 1, FIFTHS, [1, 0, 0, 1, 0, 3, 0, 0, 3, 0, 2, 0, 0, 3, 0, 1, 0, 0], 0.1, 0.01],
      ],
    };
    const ORDER = ['b', 'b', 't', 'b', 't', 't'];

    function pcm(f0, f1, attack, decay, sustain, release, duration, volume) {
      const rate = 44600;
      const n = Math.floor(rate * duration);
      const data = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const t = i / rate;
        const f = f0 + (f1 - f0) * (i / n);
        let env;
        if (t < attack) env = t / attack;
        else if (t < attack + decay) env = 1 - (1 - sustain) * ((t - attack) / decay);
        else if (t < attack + decay + duration - release) env = sustain;
        else env = sustain * (1 - (t - attack - decay - duration + release) / release);
        data[i] = env * volume * Math.sin(2 * Math.PI * f * t);
      }
      return { rate, data };
    }
    const SFX = {
      fail: pcm(NOTE[4], NOTE[1], 0.1, 1, 0, 0.5, 0.8, 0.5),
      win: pcm(NOTE[5], NOTE[7], 0.1, 1, 0.4, 1, 0.5, 0.5),
    };

    function ensure() {
      // Browsers only allow audio after a real user gesture (for touch that is
      // the end of the tap), so wait until the page has been activated.
      const ua = navigator.userActivation;
      if (ua && !ua.hasBeenActive) return false;
      if (!ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ac = new AC();
        master = ac.createGain();
        master.gain.value = muted ? 0 : 0.8;
        master.connect(ac.destination);
      }
      if (ac.state === 'suspended' && !document.hidden) ac.resume();
      return true;
    }

    function playSection() {
      const parts = SONG[ORDER[section]];
      let last = null;
      for (const [wave, beat, length, voicings, melody, volume, attack] of parts) {
        let time = ac.currentTime + 0.05;
        for (const step of melody) {
          for (const chord of voicings) {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(master);
            osc.type = WAVE[wave];
            osc.frequency.value = NOTE[chord[step]];
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(volume, time + attack * beat);
            gain.gain.exponentialRampToValueAtTime(0.01 * volume, time + length);
            osc.start(time);
            osc.stop(time + length);
            last = osc;
          }
          time += beat;
        }
      }
      // The last scheduled note of the last part closes the section.
      last.onended = () => {
        section = (section + 1) % ORDER.length;
        playSection();
      };
    }

    return {
      start() {
        if (!ensure()) return;
        if (!musicRunning) {
          musicRunning = true;
          playSection();
        }
      },
      play(name) {
        if (!ac || muted) return;
        const s = SFX[name];
        const buffer = ac.createBuffer(1, s.data.length, s.rate);
        buffer.copyToChannel(s.data, 0);
        const src = ac.createBufferSource();
        src.buffer = buffer;
        src.connect(master);
        src.start();
      },
      toggle() {
        muted = !muted;
        store.set('muted', muted ? '1' : '0');
        if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ac.currentTime, 0.02);
      },
      get muted() { return muted; },
      pause() { if (ac && ac.state === 'running') ac.suspend(); },
      resume() { if (ac && ac.state === 'suspended') ac.resume(); },
      get state() { return ac ? ac.state : 'none'; },
    };
  })();

  /* ------------------------------------------------------------------ */
  /*  Canvas, layout and drawing helpers                                 */
  /* ------------------------------------------------------------------ */

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const insetProbe = document.getElementById('safe-area');

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (n) => Math.random() * n;

  const L = {}; // current layout, in CSS pixels

  function readInsets() {
    const s = getComputedStyle(insetProbe);
    return {
      t: parseFloat(s.paddingTop) || 0,
      r: parseFloat(s.paddingRight) || 0,
      b: parseFloat(s.paddingBottom) || 0,
      l: parseFloat(s.paddingLeft) || 0,
    };
  }

  function computeLayout() {
    const W = Math.max(1, window.innerWidth);
    const H = Math.max(1, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    const inset = readInsets();
    const short = Math.min(W, H);
    const B = Math.round(clamp(short * 0.1, 44, 64)); // touch-friendly button size
    const pad = Math.round(clamp(short * 0.025, 8, 16));
    const side = W >= H * 1.25; // toolbar in a column on wide screens

    Object.assign(L, { W, H, dpr, inset, B, pad, side });

    L.toolSlot = (i) => side
      ? { x: inset.l + pad, y: inset.t + pad + i * (B + pad), w: B, h: B }
      : { x: inset.l + pad + i * (B + pad), y: inset.t + pad, w: B, h: B };
    L.batteryBox = { x: W - inset.r - pad - B, y: inset.t + pad, w: B, h: B };

    L.content = side
      ? { x0: inset.l + pad * 2 + B, x1: W - inset.r - pad * 2 - B, y0: inset.t + pad, y1: H - inset.b - pad }
      : { x0: inset.l + pad, x1: W - inset.r - pad, y0: inset.t + pad * 2 + B, y1: H - inset.b - pad };

    layoutBoard();
    layoutMenu();
  }

  // Size of glyph cells: height h, width 5/7 h, advance 6/7 h.
  const textWidth = (str, h) => (str.length * 6 - 1) * h / 7;

  function drawText(str, cx, y, h, alpha = 1) {
    const adv = (h * 6) / 7;
    const gw = (h * 5) / 7;
    let x = cx - textWidth(str, h) / 2;
    const shadow = Math.max(1, h * 0.09);
    ctx.save();
    ctx.globalAlpha *= alpha;
    for (const raw of str) {
      const ch = GLYPHS[raw] ? raw : ' ';
      if (ch !== ' ') {
        ctx.drawImage(FONT_SHADOW[ch], x + shadow, y + shadow, gw, h);
        ctx.drawImage(FONT_MAIN[ch], x, y, gw, h);
      }
      x += adv;
    }
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function panel(x, y, w, h, r, color = COLOR.board, shadowColor = COLOR.boardShadow) {
    const off = Math.max(3, Math.min(w, h) * 0.04, r * 0.4);
    ctx.fillStyle = shadowColor;
    roundRect(x + off, y + off, w, h, r);
    ctx.fill();
    ctx.fillStyle = color;
    roundRect(x, y, w, h, r);
    ctx.fill();
  }

  // Battery outline with a nub, filled to `level` percent.
  function drawBattery(x, y, w, h, level, fillColor, outline = '#888888') {
    const lw = Math.max(2, h * 0.08);
    const nub = w * 0.08;
    ctx.save();
    ctx.lineWidth = lw;
    ctx.strokeStyle = outline;
    roundRect(x, y, w - nub, h, h * 0.18);
    ctx.stroke();
    ctx.fillStyle = outline;
    roundRect(x + w - nub + lw * 0.4, y + h * 0.3, nub - lw * 0.4, h * 0.4, nub * 0.3);
    ctx.fill();
    const inner = lw * 1.4;
    const fw = Math.max(0, (w - nub - inner * 2) * clamp(level / 100, 0, 1));
    ctx.fillStyle = fillColor;
    roundRect(x + inner, y + inner, fw, h - inner * 2, h * 0.08);
    ctx.fill();
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Background effects                                                 */
  /* ------------------------------------------------------------------ */

  const Network = {
    dots: [],
    hue: rand(360),
    reset() {
      const n = Math.round(clamp((L.W * L.H) / 9000, 40, 130));
      this.dots = [];
      for (let i = 0; i < n; i++) {
        this.dots.push({
          x: rand(L.W), y: rand(L.H), size: rand(3) + 2,
          vx: rand(1) - 0.5, vy: rand(1) - 0.5,
        });
      }
    },
    update() {
      if (!this.dots.length) this.reset();
      for (const d of this.dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = L.W;
        if (d.x > L.W) d.x = 0;
        if (d.y < 0) d.y = L.H;
        if (d.y > L.H) d.y = 0;
      }
    },
    draw() {
      const dots = this.dots;
      ctx.save();
      ctx.fillStyle = '#bbbbbb';
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= 100) continue;
          const alpha = 1 - dist / 100;
          const hue = this.hue + rand(60) - 30;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, `hsla(${hue},70%,60%,${alpha * 0.5})`);
          grad.addColorStop(0.3, `hsla(${hue},100%,80%,${alpha})`);
          grad.addColorStop(1, `hsla(${hue},70%,60%,${alpha * 0.5})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 * alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          if (rand(1) < 0.05) {
            // the occasional spark
            ctx.lineWidth = 3 * alpha;
            ctx.quadraticCurveTo((a.x + b.x) / 2 + rand(10), (a.y + b.y) / 2 + rand(10), b.x, b.y);
          } else {
            ctx.lineTo(b.x, b.y);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    },
  };

  const Rain = {
    drops: [],
    update() {
      if (!this.drops.length) {
        for (let i = 0; i < 60; i++) {
          this.drops.push({ x: rand(L.W), y: rand(L.H), len: rand(20) + 10, speed: rand(5) + 2, alpha: rand(0.5) + 0.2 });
        }
      }
      for (const d of this.drops) {
        d.y += d.speed;
        if (d.y > L.H) {
          d.y = -d.len;
          d.x = rand(L.W);
        }
      }
    },
    draw() {
      ctx.save();
      ctx.lineWidth = 2;
      for (const d of this.drops) {
        ctx.strokeStyle = `rgba(255,255,255,${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();
      }
      ctx.restore();
    },
  };

  /* ------------------------------------------------------------------ */
  /*  Game state                                                         */
  /* ------------------------------------------------------------------ */

  const game = {
    scene: 'title', // title | menu | play | end
    level: 0,
    frame: 0,
  };

  // Title screen
  const TITLE = 'LOW BATTERY';
  const title = {
    letters: [],
    leaving: 0, // frames since the player tapped
    pulse: 0,
    pulseUp: true,
  };
  function resetTitle() {
    title.leaving = 0;
    title.letters = [...TITLE].map(() => ({ x: rand(L.W), y: rand(L.H), sx: rand(L.W), sy: rand(L.H), a: 1 }));
  }

  // Level state
  const play = {
    map: [],
    cols: 0,
    rows: 0,
    turns: 0,
    items: [],
    scroll: 0,
    slots: 1,
    plug: null,
    intro: null,  // fade-in transition
    ending: null, // { kind: 'win' | 'fail', t }
    drag: null,   // { kind, x, y, pointerId, touch }
    shorted: false,
  };

  function newPlug(x, y) {
    return {
      cell: { x, y },     // cell the plug is heading to / sits in
      prev: { x, y },     // cell it came from
      pos: { x, y },      // drawn position in cell units
      step: { x: 0, y: 0 },
      direction: 1,       // tile value read when entering a cell (>= 9 means "stopped")
      prevDir: 8,         // previous heading (5..8), used to pick cable pieces
      curDir: 7,          // current heading (5..8)
      moving: false,
      moveTimer: 0,       // 0..1 progress of the current cell step
    };
  }

  function loadLevel(index) {
    const lvl = LEVELS[index];
    game.level = index;
    game.scene = 'play';
    play.map = lvl.map.map((row) => row.slice());
    play.rows = lvl.map.length;
    play.cols = Math.max(...lvl.map.map((r) => r.length));
    play.turns = lvl.turns;
    play.items = lvl.items.slice();
    play.slots = play.cols - 4;
    play.scroll = 0;
    play.drag = null;
    play.ending = null;
    play.shorted = false;
    let sx = 0, sy = 0;
    lvl.map.forEach((row, y) => row.forEach((v, x) => { if (v === TILE.START) { sx = x; sy = y; } }));
    play.plug = newPlug(sx, sy);
    play.intro = { t: 0 };
    layoutBoard();
  }

  function goMenu() {
    game.scene = 'menu';
    play.drag = null;
    layoutMenu();
  }

  function goTitle() {
    game.scene = 'title';
    resetTitle();
  }

  /* ---------------------------- layouts ----------------------------- */

  function layoutBoard() {
    if (!L.W || game.scene !== 'play') return;
    const c = L.content;
    const cw = c.x1 - c.x0;
    const ch = c.y1 - c.y0;
    const caption = CAPTIONS[game.level];
    let capH = 0, capSize = 0;
    if (caption) {
      const longest = Math.max(...caption.map((s) => s.length));
      capSize = Math.floor(Math.min(clamp(Math.min(L.W, L.H) * 0.035, 12, 30), (cw * 0.95) / (longest * 6 / 7)));
      capH = caption.length * capSize * 1.6 + capSize * 0.6;
    }
    // Fit [inventory row + gap + board + shadow] in the free area. A board that is
    // much wider than the screen allows (tall phones) is shown turned a quarter
    // turn clockwise: same puzzle, bigger cells.
    const fit = (rot) => {
      const dc = rot ? play.rows : play.cols; // displayed columns
      const dr = rot ? play.cols : play.rows; // displayed rows
      const invCols = Math.max(5, dc);
      const maxGrid = clamp(Math.min(L.W, L.H) * 0.17, 90, 180);
      const grid = Math.floor(Math.min(cw / (Math.max(dc, invCols) + 0.4), (ch - capH) / (dr + 1.55), maxGrid));
      return { rot, dc, dr, invCols, grid };
    };
    const straight = fit(false);
    const turned = fit(true);
    const f = turned.grid > straight.grid * 1.12 ? turned : straight;
    const grid = f.grid;
    const blockH = grid * (f.dr + 1.55) + capH;
    const top = c.y0 + (ch - blockH) / 2;
    const cx = (c.x0 + c.x1) / 2;
    Object.assign(L, { grid, rot: f.rot, dc: f.dc, dr: f.dr, invCols: f.invCols });
    play.slots = f.invCols - 4;
    play.scroll = Math.max(0, Math.min(play.scroll, play.items.length - play.slots));
    L.ox = Math.round(cx - (f.dc * grid) / 2);
    L.invX = Math.round(cx - (f.invCols * grid) / 2);
    L.invY = Math.round(top);
    L.oy = Math.round(top + grid * 1.25);
    L.capY = L.oy + f.dr * grid + grid * 0.3 + capSize * 0.6;
    L.capSize = capSize;
  }

  // Board cell (x, y) -> displayed point, in cell units (handles the quarter turn).
  function toDisplay(bx, by) {
    return L.rot ? { x: play.rows - by, y: bx } : { x: bx, y: by };
  }

  // Screen pixel -> board cell (may be outside the board).
  function boardCellAt(px, py) {
    const dx = Math.floor((px - L.ox) / L.grid);
    const dy = Math.floor((py - L.oy) / L.grid);
    return L.rot ? { x: dy, y: play.rows - 1 - dx } : { x: dx, y: dy };
  }

  // Draw a sprite, turned with the board when needed.
  function drawTurned(img, x, y, s) {
    if (!L.rot) {
      ctx.drawImage(img, x, y, s, s);
      return;
    }
    ctx.save();
    ctx.translate(x + s / 2, y + s / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -s / 2, -s / 2, s, s);
    ctx.restore();
  }

  function layoutMenu() {
    if (!L.W) return;
    const c = L.content;
    const cw = c.x1 - c.x0;
    const ch = c.y1 - c.y0;
    const titleH = Math.floor(Math.min(34, (cw * 0.9) / (12 * 6 / 7), ch * 0.08));
    let best = null;
    for (let cols = 3; cols <= 7; cols++) {
      const rows = Math.ceil(LEVELS.length / cols);
      const size = Math.min(cw / (cols * 1.2), (ch - titleH * 2.4) / (rows * 1.2), clamp(Math.min(L.W, L.H) * 0.15, 90, 150));
      if (!best || size > best.size) best = { cols, rows, size };
    }
    const size = Math.floor(best.size);
    const gap = size * 0.2;
    const gridW = best.cols * size + (best.cols - 1) * gap;
    const gridH = best.rows * size + (best.rows - 1) * gap;
    const top = c.y0 + (ch - gridH - titleH * 2.4) / 2;
    L.menuTitleY = top;
    L.menuTitleH = titleH;
    L.menuButtons = LEVELS.map((_, i) => ({
      x: (c.x0 + c.x1) / 2 - gridW / 2 + (i % best.cols) * (size + gap),
      y: top + titleH * 2.4 + Math.floor(i / best.cols) * (size + gap),
      w: size,
      h: size,
    }));
  }

  /* -------------------------- toolbar ------------------------------- */

  function toolbarButtons() {
    const ids = {
      title: ['sound'],
      menu: ['home', 'sound'],
      play: ['home', 'restart', 'sound'],
      end: ['home', 'sound'],
    }[game.scene];
    return ids.map((id, i) => ({ id, ...L.toolSlot(i) }));
  }

  function pressToolbar(id) {
    if (id === 'sound') {
      Sound.toggle();
    } else if (id === 'home') {
      if (game.scene === 'menu') goTitle();
      else goMenu();
    } else if (id === 'restart') {
      if (!play.ending || play.ending.kind === 'fail') loadLevel(game.level);
    }
  }

  /* ------------------------ plug movement --------------------------- */
  // A faithful port of the original movement rules, run at 60 steps/sec.

  const MAP_CORNER = { '-3': 0, '3': 1, '2': 2, '-2': 3 };
  const MAP_CORNER_LEFT = { '1': 0, '-1': 1, '-2': 2, '2': 3 };

  const inside = (x, y) => x >= 0 && y >= 0 && x < play.cols && y < play.rows;
  const tileAt = (x, y) => (play.map[y] && play.map[y][x] !== undefined ? play.map[y][x] : 0);

  function plugIdle() {
    const p = play.plug;
    return p && !p.moving && p.step.x === 0 && p.step.y === 0 && p.direction >= 9;
  }

  function canTurn(dir) {
    if (!plugIdle() || play.turns <= 0 || play.ending) return false;
    const [dx, dy] = DIRS[dir];
    const x = play.plug.cell.x + dx, y = play.plug.cell.y + dy;
    return inside(x, y) && isPassable(tileAt(x, y));
  }

  function turn(dir) {
    if (!canTurn(dir)) return false;
    const p = play.plug;
    p.direction = dir;
    p.curDir = dir;
    play.turns -= 1;
    return true;
  }

  function cablePiece(p) {
    if (p.prevDir === p.curDir) return p.curDir <= 6 ? 18 : 16;
    const diff = String(p.prevDir - p.curDir);
    const idx = (p.prevDir === 6 || p.curDir === 6) ? MAP_CORNER_LEFT[diff] : MAP_CORNER[diff];
    return idx === undefined ? 17 : 12 + idx;
  }

  function updatePlug() {
    const p = play.plug;
    const still = p.step.x === 0 && p.step.y === 0;

    if (still && p.direction >= 9 && play.turns <= 0 && !p.moving) {
      if (!play.ending) {
        play.ending = { kind: 'fail', t: 0 };
        Sound.play('fail');
      }
      return;
    }

    if (DIRS[p.direction]) {
      p.step = { x: DIRS[p.direction][0], y: DIRS[p.direction][1] };
      p.curDir = p.direction;
    } else if (p.direction === TILE.RECYCLE) {
      p.step = { x: 0, y: 0 };
    }

    const tx = p.cell.x + p.step.x;
    const ty = p.cell.y + p.step.y;
    if (inside(tx, ty)) {
      if (!p.moving) {
        const t = tileAt(tx, ty);
        if (isPassable(t)) {
          p.prev = { ...p.cell };
          p.cell = { x: tx, y: ty };
          p.moving = true;
        } else {
          const moving = p.step.x !== 0 || p.step.y !== 0;
          // Red sockets and straight cable pieces short-circuit the plug;
          // cable corners are safe to bump into.
          if ((t === TILE.SHORT || t === 16 || t === 18) && moving) {
            play.turns = 0;
            play.shorted = true;
          }
          if (t === TILE.CRACKED) play.map[ty][tx] = TILE.EMPTY;
          p.step = { x: 0, y: 0 };
          p.direction = 9;
        }
      }
    } else {
      p.direction = 9;
      p.step = { x: 0, y: 0 };
    }

    if (p.moving) {
      const piece = cablePiece(p);
      play.map[p.prev.y][p.prev.x] = piece;
      p.pos.x += (p.cell.x - p.pos.x) * p.moveTimer;
      p.pos.y += (p.cell.y - p.pos.y) * p.moveTimer;
      if (p.moveTimer < 1) {
        p.moveTimer = Math.min(1, p.moveTimer + 0.1);
      } else {
        // arrived in the new cell
        p.direction = tileAt(p.cell.x, p.cell.y);
        p.prevDir = p.curDir;
        play.map[p.cell.y][p.cell.x] = piece;

        if (p.direction === TILE.RECYCLE) {
          const orig = LEVELS[game.level].map;
          play.map = orig.map((row) => row.map((v) => (v === TILE.RECYCLE ? 0 : v)));
        }
        if (p.direction === TILE.SWITCH) {
          play.map = play.map.map((row) => row.map((v) => (v === TILE.WALL ? 0 : v)));
        }
        if (p.direction === TILE.GOAL) {
          p.step = { x: 0, y: 0 };
          win();
        }
        p.moving = false;
        p.moveTimer = 0;
        p.pos = { ...p.cell };
      }
    }
  }

  function win() {
    if (play.ending) return;
    Sound.play('win');
    completed[game.level] = 1;
    store.set('progress', JSON.stringify(completed));
    play.ending = { kind: 'win', t: 0 };
    play.drag = null;
  }

  const INTRO_FRAMES = 70;
  const ENDING_FRAMES = 95;

  function updatePlay() {
    if (play.intro) {
      play.intro.t++;
      if (play.intro.t >= INTRO_FRAMES) play.intro = null;
    }
    updatePlug();
    if (play.ending) {
      play.ending.t++;
      if (play.ending.t >= ENDING_FRAMES) {
        if (play.ending.kind === 'win') {
          if (game.level + 1 >= LEVELS.length) {
            game.scene = 'end';
            game.endShown = game.frame;
          } else {
            loadLevel(game.level + 1);
          }
        } else {
          loadLevel(game.level);
        }
      }
    }
  }

  /* --------------------------- inventory ---------------------------- */

  function visibleItems() {
    const start = play.items.length > play.slots ? play.scroll : 0;
    return play.items.slice(start, start + play.slots).map((kind, i) => ({ kind, index: start + i, slot: i }));
  }

  const invRect = (cellIndex) => {
    const g = L.grid;
    return { x: L.invX + cellIndex * g, y: L.invY, w: g, h: g };
  };

  function dragTarget(d) {
    // the cell under the centre of the dragged piece (lifted above a finger)
    const cell = boardCellAt(d.x, d.y - (d.touch ? L.grid * 0.75 : 0));
    if (inside(cell.x, cell.y) && tileAt(cell.x, cell.y) === TILE.EMPTY) return cell;
    return null;
  }

  /* ------------------------------------------------------------------ */
  /*  Drawing                                                            */
  /* ------------------------------------------------------------------ */

  function drawToolbar() {
    for (const b of toolbarButtons()) {
      const hover = pointer.inside && !pointer.touch && hit(b, pointer.x, pointer.y);
      ctx.save();
      ctx.fillStyle = hover ? 'rgba(66,80,102,0.95)' : 'rgba(66,80,102,0.6)';
      roundRect(b.x, b.y, b.w, b.h, b.w * 0.22);
      ctx.fill();
      const m = b.w * 0.17;
      const icon = b.id === 'home' ? ICON.home : b.id === 'restart' ? ICON.restart : ICON.sound;
      if (b.id === 'sound' && Sound.muted) ctx.globalAlpha = 0.35;
      ctx.drawImage(icon, b.x + m, b.y + m, b.w - m * 2, b.h - m * 2);
      if (b.id === 'sound' && Sound.muted) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = COLOR.alarm;
        ctx.lineWidth = Math.max(3, b.w * 0.08);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(b.x + m, b.y + b.h - m);
        ctx.lineTo(b.x + b.w - m, b.y + m);
        ctx.stroke();
      }
      ctx.restore();
    }
    // charge indicator: grows as you finish levels
    if (game.scene !== 'title') {
      const box = L.batteryBox;
      const level = batteryLevel();
      const bh = box.w * 0.42;
      drawBattery(box.x, box.y + box.h * 0.06, box.w, bh, level, level < 30 ? COLOR.alarm : COLOR.good, '#bbbbbb');
      const label = level + '%';
      const th = Math.floor(Math.min(box.h * 0.32, (box.w * 1.1) / textWidth(label, 1)));
      drawText(label, box.x + box.w / 2, box.y + box.h * 0.06 + bh + box.h * 0.1, th);
    }
  }

  function drawPlay() {
    const g = L.grid;
    const ox = L.ox, oy = L.oy;
    const W = L.dc * g, H = L.dr * g;
    const p = play.plug;
    const blink = Math.floor(game.frame / 10) % 2 === 0;

    // board panel and faint cell grid (screen space)
    const bp = Math.max(4, g * 0.1);
    panel(ox - bp, oy - bp, W + bp * 2, H + bp * 2, g * 0.22);
    ctx.fillStyle = 'rgba(255,255,255,0.045)';
    for (let y = 0; y < L.dr; y++) {
      for (let x = 0; x < L.dc; x++) {
        const m = g * 0.06;
        roundRect(ox + x * g + m, oy + y * g + m, g - m * 2, g - m * 2, g * 0.12);
        ctx.fill();
      }
    }

    // everything on the board is drawn in board space (turned when L.rot)
    ctx.save();
    ctx.translate(ox, oy);
    if (L.rot) {
      ctx.translate(play.rows * g, 0);
      ctx.rotate(Math.PI / 2);
    }
    for (let y = 0; y < play.rows; y++) {
      for (let x = 0; x < play.cols; x++) {
        const v = play.map[y][x];
        if (v && TILES[v]) ctx.drawImage(TILES[v], x * g, y * g, g, g);
      }
    }

    // direction hints around the idle plug
    if (plugIdle() && play.turns > 0 && !play.ending) {
      const under = pointer.inside && !pointer.touch ? boardCellAt(pointer.x, pointer.y) : null;
      for (const d of [5, 6, 7, 8]) {
        if (!canTurn(d)) continue;
        const nx = p.cell.x + DIRS[d][0], ny = p.cell.y + DIRS[d][1];
        const sprites = blink ? ICON.hintB : ICON.hintA;
        const hover = under && under.x === nx && under.y === ny;
        ctx.globalAlpha = hover ? 0.75 : 0.4;
        ctx.drawImage(sprites[d - 5], nx * g, ny * g, g, g);
        ctx.globalAlpha = 1;
      }
    }

    // plug
    {
      const x = p.pos.x * g, y = p.pos.y * g;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = COLOR.board;
      ctx.fillRect(x, y, g, g);
      ctx.globalAlpha = 1;
      const sprites = blink ? ICON.plugB : ICON.plugA;
      ctx.drawImage(sprites[p.curDir - 5], x, y, g, g);
    }

    // where a dragged piece would land
    const target = play.drag ? dragTarget(play.drag) : null;
    if (target) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(TILES[play.drag.kind], target.x * g, target.y * g, g, g);
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // inventory row: [<] pieces... [>] turns left
    const canScroll = play.items.length > play.slots;
    const icon = 0.8 * g, m = 0.1 * g;
    if (canScroll) {
      ctx.globalAlpha = play.scroll > 0 ? 1 : 0.25;
      ctx.drawImage(ICON.scrollLeft, L.invX + m, L.invY + m, icon, icon);
      ctx.globalAlpha = play.scroll < play.items.length - play.slots ? 1 : 0.25;
      ctx.drawImage(ICON.scrollRight, L.invX + (play.slots + 1) * g + m, L.invY + m, icon, icon);
      ctx.globalAlpha = 1;
    }
    for (const it of visibleItems()) {
      const r = invRect(it.slot + 1);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      roundRect(r.x + m * 0.5, r.y + m * 0.5, r.w - m, r.h - m, g * 0.14);
      ctx.fill();
      if (play.drag && play.drag.index === it.index) ctx.globalAlpha = 0.3;
      drawTurned(TILES[it.kind], r.x, r.y, g);
      ctx.globalAlpha = 1;
    }
    const turns = String(Math.max(0, play.turns)).padStart(2, '0');
    const th = g * 0.8;
    drawText(turns, L.invX + (play.slots + 3) * g, L.invY + (g - th) / 2, th);

    // caption
    const caption = CAPTIONS[game.level];
    if (caption && !play.ending) {
      caption.forEach((line, i) => drawText(line, ox + W / 2, L.capY + i * L.capSize * 1.6, L.capSize));
    }

    // the dragged piece follows the pointer
    if (play.drag) {
      const d = play.drag;
      const cy = d.y - (d.touch ? g * 0.75 : 0);
      drawTurned(TILES[d.kind], d.x - g / 2, cy - g / 2, g);
    }
  }

  // Circular wipe centred on the plug (in = opening, out = closing).
  function drawWipe() {
    let progress, opening;
    if (play.ending) {
      progress = Math.min(1, play.ending.t / (ENDING_FRAMES - 15));
      opening = false;
    } else if (play.intro) {
      progress = play.intro.t / INTRO_FRAMES;
      opening = true;
    } else {
      return;
    }
    const eased = progress * (2 - progress);
    const maxR = Math.hypot(L.W, L.H);
    const r = opening ? 0.5 + eased * (maxR - 0.5) : maxR - eased * (maxR - 0.5);
    const p = play.plug;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 1;
    ctx.beginPath();
    const c = toDisplay(p.pos.x + 0.5, p.pos.y + 0.5);
    ctx.arc(L.ox + c.x * L.grid, L.oy + c.y * L.grid, Math.max(0.5, r), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (play.ending && play.ending.t > 20) {
      const msg = play.ending.kind === 'win' ? 'CHARGING...' : play.shorted ? 'SHORT CIRCUIT!' : 'OUT OF TURNS';
      const h = Math.floor(Math.min(40, (L.W * 0.85) / textWidth(msg, 1)));
      const a = Math.min(1, (play.ending.t - 20) / 15);
      drawText(msg, L.W / 2, L.H / 2 - h / 2, h, a);
    }
  }

  function drawMenu() {
    drawText('SELECT LEVEL', (L.content.x0 + L.content.x1) / 2, L.menuTitleY, L.menuTitleH);
    L.menuButtons.forEach((b, i) => {
      const hover = pointer.inside && !pointer.touch && hit(b, pointer.x, pointer.y);
      const color = hover ? COLOR.levelHover : completed[i] ? COLOR.levelDone : COLOR.board;
      panel(b.x, b.y, b.w, b.h, b.w * 0.14, color, hover ? COLOR.levelDone : COLOR.boardShadow);
      const label = String(i + 1).padStart(2, '0');
      const th = b.h * 0.34;
      drawText(label, b.x + b.w / 2, b.y + b.h * 0.2, th);
      // small icon under the number: plug for done levels, socket for the rest
      const s = b.w * 0.3;
      ctx.drawImage(completed[i] ? ICON.plugA[0] : TILES[TILE.GOAL], b.x + (b.w - s) / 2, b.y + b.h * 0.62, s, s);
    });
  }

  function drawTitle() {
    Rain.draw();
    const W = L.W, H = L.H;
    // pulsing low-battery alarm
    ctx.save();
    ctx.globalAlpha = Math.max(0, title.pulse);
    ctx.fillStyle = COLOR.alarm;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // battery, title and prompt, centred as one block
    const h = Math.floor(Math.min(64, (W * 0.88) / textWidth(TITLE, 1), H * 0.11));
    const bw = Math.min(W * 0.62, 360, H * 0.5);
    const bh = bw * 0.42;
    const tapH = Math.floor(Math.min(26, (W * 0.7) / textWidth('TAP TO START', 1), h * 0.55));
    const blockH = bh + h * 0.9 + h + h * 1.6 + tapH;
    const top = Math.max(L.inset.t + L.B + L.pad * 2, (H - blockH) / 2);
    const bx = W / 2 - bw / 2;
    const by = top;
    drawBattery(bx, by, bw, bh, 13, COLOR.charge, '#aaaaaa');
    const pctH = Math.floor(bh * 0.42);
    drawText('13%', bx + bw * 0.58, by + (bh - pctH) / 2, pctH, 0.9);

    // title letters fly into place (movement happens in update())
    const ty = by + bh + h * 0.9;
    const startX = W / 2 - textWidth(TITLE, h) / 2;
    const adv = (h * 6) / 7;
    const gw = (h * 5) / 7;
    const sh = Math.max(1, h * 0.09);
    title.letters.forEach((l, i) => {
      l.tx = startX + i * adv;
      l.ty = ty;
      const ch = TITLE[i];
      if (ch === ' ' || l.a <= 0) return;
      ctx.save();
      ctx.globalAlpha = l.a;
      ctx.drawImage(FONT_SHADOW[ch], l.x + sh, l.y + sh, gw, h);
      ctx.drawImage(FONT_MAIN[ch], l.x, l.y, gw, h);
      ctx.restore();
    });

    if (!title.leaving && Math.floor(game.frame / 35) % 2 === 0) {
      drawText('TAP TO START', W / 2, ty + h + h * 1.6, tapH);
    }
  }

  function updateTitleLetters() {
    for (const l of title.letters) {
      if (l.tx === undefined) continue;
      if (title.leaving) {
        l.x += (l.sx - l.x) * 0.04;
        l.y += (l.sy - l.y) * 0.04;
        l.a = Math.max(0, l.a - 0.025);
      } else {
        l.x += (l.tx - l.x) * 0.06;
        l.y += (l.ty - l.y) * 0.06;
      }
    }
  }


  function drawEnd() {
    const pct = batteryLevel();
    const END_LINES = pct >= 100
      ? ['FULLY CHARGED!', '100%', 'THANK YOU', 'FOR PLAYING!']
      : ['LAST MAZE DONE!', 'BATTERY ' + pct + '%', 'THANK YOU', 'FOR PLAYING!'];
    const c = L.content;
    const cw = c.x1 - c.x0, ch = c.y1 - c.y0;
    const longest = END_LINES.reduce((a, b) => (b.length > a.length ? b : a));
    const h = Math.floor(Math.min(46, (cw * 0.8) / textWidth(longest, 1), ch / (END_LINES.length * 2.2)));
    const boxW = textWidth(longest, h) + h * 2;
    const boxH = END_LINES.length * h * 1.6 + h * 1.6;
    const bx = (c.x0 + c.x1) / 2 - boxW / 2;
    const by = (c.y0 + c.y1) / 2 - boxH / 2;
    panel(bx, by, boxW, boxH, h * 0.4);
    let k = 0;
    END_LINES.forEach((line, row) => {
      const y = by + h * 0.95 + row * h * 1.6;
      let x = (c.x0 + c.x1) / 2 - textWidth(line, h) / 2;
      for (const chr of line) {
        const wave = Math.sin(game.frame * 0.08 + k * 0.7) * h * 0.12;
        if (chr !== ' ') drawText(chr, x + (h * 5) / 14, y + wave, h);
        x += (h * 6) / 7;
        k++;
      }
    });
    if (Math.floor(game.frame / 35) % 2 === 0) {
      const msg = 'TAP TO CONTINUE';
      const sh = Math.floor(Math.min(22, (cw * 0.8) / textWidth(msg, 1)));
      drawText(msg, (c.x0 + c.x1) / 2, Math.min(by + boxH + sh * 1.5, c.y1 - sh), sh);
    }
  }

  function render() {
    ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = COLOR.background;
    ctx.fillRect(0, 0, L.W, L.H);

    if (game.scene === 'title') {
      drawTitle();
    } else {
      Network.draw();
      if (game.scene === 'menu') drawMenu();
      else if (game.scene === 'play') {
        drawPlay();
        drawWipe();
      } else if (game.scene === 'end') drawEnd();
    }
    drawToolbar();
  }

  /* ------------------------------------------------------------------ */
  /*  Update loop                                                        */
  /* ------------------------------------------------------------------ */

  function update() {
    game.frame++;
    if (game.scene === 'title') {
      Rain.update();
      updateTitleLetters();
      // the alarm pulse rises to 0.7 then fades back to 0
      title.pulse += title.pulseUp ? 0.005 : -0.005;
      if (title.pulse >= 0.7) title.pulseUp = false;
      if (title.pulse <= 0) title.pulseUp = true;
      if (title.leaving) {
        title.leaving++;
        if (title.leaving > 55) {
          if (completed.some(Boolean)) goMenu();
          else loadLevel(0);
        }
      }
    } else {
      Network.update();
      if (game.scene === 'play') updatePlay();
    }
  }

  const STEP = 1000 / 60;
  let last = 0;
  let acc = 0;
  let paused = false;

  function frame(now) {
    requestAnimationFrame(frame);
    if (paused) return;
    if (!last) last = now;
    acc += Math.min(250, now - last);
    last = now;
    while (acc >= STEP) {
      update();
      acc -= STEP;
    }
    render();
  }

  /* ------------------------------------------------------------------ */
  /*  Input                                                              */
  /* ------------------------------------------------------------------ */

  const pointer = { x: -1, y: -1, inside: false, touch: false };
  const hit = (r, x, y) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;

  function localPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startTitle() {
    if (!title.leaving) title.leaving = 1;
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    Sound.start();
    const { x, y } = localPoint(e);
    pointer.x = x; pointer.y = y; pointer.inside = true;
    pointer.touch = e.pointerType !== 'mouse';
    if (e.button > 0) return;

    for (const b of toolbarButtons()) {
      if (hit(b, x, y)) { pressToolbar(b.id); return; }
    }

    if (game.scene === 'title') {
      startTitle();
    } else if (game.scene === 'menu') {
      L.menuButtons.forEach((b, i) => { if (hit(b, x, y)) loadLevel(i); });
    } else if (game.scene === 'end') {
      if (game.frame - (game.endShown || 0) > 30) goMenu();
    } else if (game.scene === 'play') {
      pointerPlay(e, x, y);
    }
  });

  function pointerPlay(e, x, y) {
    if (play.ending) return;
    // scroll buttons
    const canScroll = play.items.length > play.slots;
    if (canScroll && hit(invRect(0), x, y)) {
      play.scroll = Math.max(0, play.scroll - 1);
      return;
    }
    if (canScroll && hit(invRect(play.slots + 1), x, y)) {
      play.scroll = Math.min(play.items.length - play.slots, play.scroll + 1);
      return;
    }
    // pick up a piece
    for (const it of visibleItems()) {
      if (hit(invRect(it.slot + 1), x, y)) {
        play.drag = { kind: it.kind, index: it.index, x, y, pointerId: e.pointerId, touch: e.pointerType !== 'mouse' };
        try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        return;
      }
    }
    // choose a direction by tapping next to the plug
    const cell = boardCellAt(x, y);
    const p = play.plug;
    for (const d of [5, 6, 7, 8]) {
      if (p.cell.x + DIRS[d][0] === cell.x && p.cell.y + DIRS[d][1] === cell.y) {
        turn(d);
        return;
      }
    }
  }

  canvas.addEventListener('pointermove', (e) => {
    const { x, y } = localPoint(e);
    pointer.x = x; pointer.y = y; pointer.inside = true;
    pointer.touch = e.pointerType !== 'mouse';
    if (play.drag && play.drag.pointerId === e.pointerId) {
      play.drag.x = x;
      play.drag.y = y;
    }
  });

  function endDrag(e, cancelled) {
    const d = play.drag;
    if (!d || d.pointerId !== e.pointerId) return;
    play.drag = null;
    if (cancelled || game.scene !== 'play' || play.ending) return;
    const target = dragTarget(d);
    if (target) {
      play.map[target.y][target.x] = d.kind;
      play.items.splice(d.index, 1);
      play.scroll = Math.max(0, Math.min(play.scroll, play.items.length - play.slots));
    }
  }

  canvas.addEventListener('pointerup', (e) => {
    Sound.start();
    endDrag(e, false);
  });
  canvas.addEventListener('pointercancel', (e) => endDrag(e, true));
  canvas.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') pointer.inside = false;
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  const KEY_DIRS = {
    ArrowRight: 5, KeyD: 5, ArrowLeft: 6, KeyA: 6, ArrowUp: 7, KeyW: 7, ArrowDown: 8, KeyS: 8,
  };

  window.addEventListener('keydown', (e) => {
    if (e.repeat && !KEY_DIRS[e.code]) return;
    Sound.start();
    pointer.inside = false;
    if (e.code === 'KeyM') { Sound.toggle(); return; }
    if (game.scene === 'title') {
      if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); startTitle(); }
    } else if (game.scene === 'menu') {
      if (e.code === 'Escape') goTitle();
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const next = completed.findIndex((c) => !c);
        loadLevel(next < 0 ? 0 : next);
      }
    } else if (game.scene === 'end') {
      if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Escape') { e.preventDefault(); goMenu(); }
    } else if (game.scene === 'play') {
      if (KEY_DIRS[e.code]) {
        e.preventDefault();
        // on a turned board, screen directions map to different board directions
        const dir = KEY_DIRS[e.code];
        turn(L.rot ? { 5: 7, 6: 8, 7: 6, 8: 5 }[dir] : dir);
      }
      else if (e.code === 'KeyR') pressToolbar('restart');
      else if (e.code === 'Escape') goMenu();
    }
  });

  /* ------------------------------------------------------------------ */
  /*  Lifecycle                                                          */
  /* ------------------------------------------------------------------ */

  function onResize() {
    const oldW = L.W, oldH = L.H;
    computeLayout();
    if (oldW && (Math.abs(oldW - L.W) > 80 || Math.abs(oldH - L.H) > 80)) {
      Network.reset();
      Rain.drops = [];
    }
    if (!paused) render();
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', () => setTimeout(onResize, 50));

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    last = 0;
    acc = 0;
    if (paused) Sound.pause();
    else Sound.resume();
  });

  // Small read-only hook used by automated tests and screenshots.
  window.LowBattery = {
    get scene() { return game.scene; },
    get level() { return game.level; },
    get turns() { return play.turns; },
    get audio() { return Sound.state; },
    get ending() { return play.ending ? play.ending.kind : null; },
    get idle() { return game.scene === 'play' && plugIdle() && !play.ending && !play.intro; },
    get plug() { return play.plug ? { ...play.plug.cell } : null; },
    get items() { return play.items.slice(); },
    get map() { return play.map.map((r) => r.slice()); },
    cellCenter(x, y) { const c = toDisplay(x + 0.5, y + 0.5); return { x: L.ox + c.x * L.grid, y: L.oy + c.y * L.grid }; },
    slotCenter(slot) { return { x: L.invX + (slot + 1.5) * L.grid, y: L.invY + L.grid / 2 }; },
    get rotated() { return !!L.rot; },
    get slots() { return play.slots; },
    get scroll() { return play.scroll; },
    get grid() { return L.grid; },
    menuCenter(i) { const b = L.menuButtons[i]; return { x: b.x + b.w / 2, y: b.y + b.h / 2 }; },
  };

  computeLayout();
  resetTitle();
  requestAnimationFrame(frame);
})();
