/*
  Навигация станции. При CONFIG.openAccess все пункты видны сразу,
  иначе пункт появляется после закрытия соответствующего квеста.
  Скрытая страница дневника в меню не значится.
*/

const MENU_ITEMS = [
  { label: 'Терминал SQL', href: 'staff-db.html', after: 'q0' },
  { label: 'Архивы — Фотоархив', href: 'photos.html', after: 'q1' },
  { label: 'Анализ метаданных', href: 'exif-tool.html', after: 'q1' },
  { label: 'Карта', href: 'map.html', after: 'q2' },
  { label: 'Архивы — Радиозаписи', href: 'radio-archive.html', after: 'q3' },
  { label: 'Позывные', href: 'nicknames.html', after: 'q4' },
  { label: 'Логи активности', href: 'logs.html', after: 'q5' },
  { label: 'Видеонаблюдение', href: 'cameras.html', after: 'q6' }
];

function isUnlocked(item) {
  return CONFIG.openAccess || isDone(item.after);
}

function renderHeader() {
  if (!CONFIG.openAccess && !isDone('q0')) return;
  const links = MENU_ITEMS
    .filter(isUnlocked)
    .map(i => `<a href="${i.href}">${i.label}</a>`)
    .join('');
  const header = document.createElement('header');
  header.className = 'topbar';
  header.innerHTML = `
    <a class="brand" href="dashboard.html">ECHO-7</a>
    <nav>${links}</nav>
    <span class="spacer"></span>
    <button class="envelope" type="button" title="Входящие">&#9993;</button>`;
  document.body.prepend(header);
  header.querySelector('.envelope').addEventListener('click', showInbox);
  renderEnvelopeState();
}

document.addEventListener('DOMContentLoaded', renderHeader);
