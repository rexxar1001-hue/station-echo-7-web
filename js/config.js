/*
  STATION ECHO-7 — единая точка настройки игры.
  Меняйте значения здесь, не трогая логику страниц.
*/

const CONFIG = {
  // true — все разделы станции открыты сразу (сайт работает как обычный).
  // false — разделы открываются по мере прохождения квестов.
  openAccess: true,

  // true — работают уведомления: всплывающее окно на дашборде и значок-конверт «Входящие» в шапке.
  // false — окно и конверт скрыты (внутренняя логика уведомлений сохраняется, включая даты получения).
  showNotifications: false,

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
    id: 3,
    name: 'Daniel Stern',
    sector: 'Epsilon',
    clearance: 'Basic',
    role: 'Quartermaster',
    status: 'missing',
    hiringFrom: '1998-10-02'
  },

  // Квест 2 — файл фото и координаты
  photoFile: 'field_photo_003.jpg',
  coords: { lat: 45.8923, lng: 13.0642 },

  // Квест 3 — точки карты
  // x, y — пиксели карты img/island.jpg (1500 × 1000), отсчёт y снизу.
  // photos — снимки фотоархива, сделанные в этой точке.
  mapPoints: [
    { code: 'AP-01', x: 470, y: 122, place: 'Галечный пляж', photos: ['149'] },
    { code: 'AP-02', x: 615, y: 228, place: 'Разрушенная теплица', photos: ['031'] },
    // AP-03, AP-07 и AP-11 образуют кластер на западе острова (см. clusterPoints ниже).
    { code: 'AP-03', x: 391, y: 824, place: 'Хвойный лес', photos: ['084'] },
    { code: 'AP-04', x: 830, y: 316, place: 'Кирпичный склад', photos: ['128'] },
    { code: 'AP-05', x: 586, y: 365, place: 'Поля', photos: ['097', '140'] },
    { code: 'AP-06', x: 488, y: 307, place: 'Заброшенная ферма', photos: ['052'] },
    { code: 'AP-07', x: 127, y: 629, place: 'Западные обрывы, мачта', photos: ['003'] },
    { code: 'AP-08', x: 1250, y: 531, place: 'Затопленный карьер', photos: ['044'] },
    { code: 'AP-09', x: 781, y: 883, place: 'Березняк', photos: ['038'] },
    { code: 'AP-10', x: 791, y: 570, place: 'Озеро, старый причал', photos: ['066'] },
    { code: 'AP-11', x: 503, y: 624, place: 'Бетонный бункер', photos: ['012', '075'] },
    { code: 'AP-12', x: 1123, y: 805, place: 'Болото', photos: ['111'] },
    { code: 'AP-13', x: 1055, y: 434, place: 'Река', photos: ['008', '103'] },
    { code: 'AP-14', x: 576, y: 522, place: 'Линия электропередач', photos: ['061', '019'] },
    { code: 'AP-15', x: 977, y: 375, place: 'Луга у реки', photos: ['005'] }
  ],
  correctPoint: 'AP-07',
  // Точки, которые показываются вместе после ввода координат из квеста 2.
  clusterPoints: ['AP-03', 'AP-07', 'AP-11'],

  // Квест 4 — аудиоархив
  // Для каждой точки AP-NN своя папка audio/AP-NN/ с теми же 14 файлами; верная запись — только в correctPoint.
  audioRoot: 'audio/',
  // Готовые записи: records_v2/AP01-rec_47_2.mp3 (точка без дефиса, точка в частоте заменена на «_»).
  // Если такого файла нет, радиоархив использует заглушку из audio/AP-NN/.
  recordsRoot: 'records_v2/',
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

  // Личные дела остальных позывных (из таблицы employees; декорация) и пульс, уд/мин.
  // Для SHADOW-01 берётся CONFIG.target; его пульс — shadowPulse.
  shadowPulse: 180,
  staff: {
    'ALPHA-30':   { id: 37,  name: 'Adam Berg',        role: 'Scout',                 sector: 'Alpha',   clearance: 'Advanced', status: 'active', pulse: 94 },
    'BETA-12':    { id: 138, name: 'Felix Maurer',     role: 'Scientist',             sector: 'Beta',    clearance: 'Basic',    status: 'active', pulse: 88 },
    'GAMMA-24':   { id: 80,  name: 'Dora Berg',        role: 'Medic',                 sector: 'Gamma',   clearance: 'Basic',    status: 'active', pulse: 102 },
    'DELTA-06':   { id: 43,  name: 'Wanda Lindqvist',  role: 'Technician',            sector: 'Delta',   clearance: 'Basic',    status: 'active', pulse: 79 },
    'EPSILON-19': { id: 41,  name: 'Viktor Petrov',    role: 'Scientist',             sector: 'Epsilon', clearance: 'Advanced', status: 'active', pulse: 91 },
    'ZETA-41':    { id: 47,  name: 'Pavel Novak',      role: 'Engineer',              sector: 'Zeta',    clearance: 'Basic',    status: 'active', pulse: 97 },
    'THETA-08':   { id: 13,  name: 'Olga Petrov',      role: 'Laboratory Technician', sector: 'Theta',   clearance: 'Basic',    status: 'active', pulse: 84 },
    'IOTA-33':    { id: 28,  name: 'Rita Vidmar',      role: 'Medic',                 sector: 'Iota',    clearance: 'Basic',    status: 'active', pulse: 100 },
    'KAPPA-15':   { id: 99,  name: 'Quentin Ivanov',   role: 'Scientist',             sector: 'Kappa',   clearance: 'Advanced', status: 'active', pulse: 77 },
    'LAMBDA-27':  { id: 11,  name: 'Daniel Petrov',    role: 'Laboratory Technician', sector: 'Lambda',  clearance: 'Basic',    status: 'active', pulse: 93 },
    'SIGMA-02':   { id: 58,  name: 'Dora Quist',       role: 'Technician',            sector: 'Mu',      clearance: 'Basic',    status: 'active', pulse: 86 }
  },

  // Квест 6/7 — терминал и камера
  cameraId: 'GAMMA-CAM-04',
  logPlain: 'Терминал GAMMA-CAM-04, несанкционированный доступ',

  // Квест 8 — скрытая страница
  diaryPath: 'diary-stern-003.html',
  // Сколько раз применяется base64 к адресу дневника в таблице notes
  diaryEncodeLayers: 2
};
