/*
  STATION ECHO-7 — единая точка настройки игры.
  Меняйте значения здесь, не трогая логику страниц.
*/

const CONFIG = {
  // true — все разделы станции открыты сразу (сайт работает как обычный).
  // false — разделы открываются по мере прохождения квестов.
  openAccess: true,

  // true — на карте в точках показываются снимки фотоархива, сделанные там.
  // false — точки остаются без снимков.
  mapPhotos: true,

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
  // x, y — пиксели карты img/island.jpg (1500 × 1000), отсчёт y снизу.
  // photos — снимки фотоархива, сделанные в этой точке.
  mapPoints: [
    { code: 'AP-01', x: 470, y: 122, place: 'Галечный пляж', photos: ['149'] },
    { code: 'AP-02', x: 615, y: 228, place: 'Разрушенная теплица', photos: ['031'] },
    { code: 'AP-03', x: 488, y: 307, place: 'Заброшенная ферма', photos: ['052'] },
    { code: 'AP-04', x: 830, y: 316, place: 'Кирпичный склад', photos: ['128'] },
    { code: 'AP-05', x: 586, y: 365, place: 'Поля', photos: ['097', '140'] },
    { code: 'AP-06', x: 391, y: 824, place: 'Хвойный лес', photos: ['084'] },
    { code: 'AP-07', x: 127, y: 629, place: 'Западные обрывы, мачта', photos: ['023'] },
    { code: 'AP-08', x: 1250, y: 531, place: 'Затопленный карьер', photos: ['044'] },
    { code: 'AP-09', x: 781, y: 883, place: 'Березняк', photos: ['038'] },
    { code: 'AP-10', x: 503, y: 624, place: 'Бетонный бункер', photos: ['012', '075'] },
    { code: 'AP-11', x: 791, y: 570, place: 'Озеро, старый причал', photos: ['066'] },
    { code: 'AP-12', x: 1123, y: 805, place: 'Болото', photos: ['111'] },
    { code: 'AP-13', x: 1055, y: 434, place: 'Река', photos: ['008', '103'] },
    { code: 'AP-14', x: 576, y: 522, place: 'Линия электропередач', photos: ['061', '019'] },
    { code: 'AP-15', x: 977, y: 375, place: 'Луга у реки', photos: ['005'] }
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
