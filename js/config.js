/*
  STATION ECHO-7 — единая точка настройки игры.
  Меняйте значения здесь, не трогая логику страниц.
*/

const CONFIG = {
  // true — все разделы станции открыты сразу (сайт работает как обычный).
  // false — разделы открываются по мере прохождения квестов.
  openAccess: true,

  // Квест 0 — учётные данные входа. Логин совпадает с именем сотрудника из employees.
  login: {
    employeeId: 87,
    name: 'Viktor Orel',
    password: 'bKlb85kA'
  },

  // Квест 1 — искомый сотрудник
  target: {
    id: 87,
    name: 'Viktor Orel',
    sector: 'Lambda',
    clearance: 'Omega',
    role: 'Scout',
    status: 'missing',
    hiringFrom: '2016-04-02'
  },

  // Квест 2 — файл фото и координаты
  photoFile: 'field_photo_087.jpg',
  coords: { lat: 45.8923, lng: 13.0642 },

  // Квест 3 — точки карты
  mapPoints: [
    { code: 'AP-03', x: 610, y: 420 },
    { code: 'AP-07', x: 640, y: 455 },
    { code: 'AP-11', x: 655, y: 470 }
  ],
  correctPoint: 'AP-07',

  // Квест 4 — аудиоархив
  audioDir: 'audio/AP-07/',
  audioFiles: [
    'rec_38.6.wav', 'rec_47.2.wav', 'rec_59.4.wav', 'rec_71.9.wav',
    'rec_88.3.wav', 'rec_96.5.wav', 'rec_104.8.wav', 'rec_117.2.wav',
    'rec_128.0.wav', 'rec_142.7.wav', 'rec_166.4.wav', 'rec_181.3.wav',
    'rec_205.1.wav', 'rec_219.6.wav'
  ],
  correctAudio: 'rec_142.7.wav',
  spectrogramMark: 'SHADOW-01',

  // Квест 5 — позывные и мини-игра
  callsign: 'SHADOW-01',
  callsigns: [
    'ALPHA-30', 'BETA-12', 'GAMMA-24', 'DELTA-06', 'EPSILON-19',
    'ZETA-41', 'SHADOW-01', 'THETA-08', 'IOTA-33', 'KAPPA-15',
    'LAMBDA-27', 'SIGMA-02'
  ],
  wiring: { red: 3, blue: 1, yellow: 4, green: 2 },

  // Квест 6/7 — терминал и камера
  cameraId: 'GAMMA-CAM-04',
  logPlain: 'Терминал GAMMA-CAM-04, несанкционированный доступ',

  // Квест 8 — скрытая страница
  diaryPath: 'diary-vorel-087.html',
  // Сколько раз применяется base64 к адресу дневника в таблице notes
  diaryEncodeLayers: 2
};
