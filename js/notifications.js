/*
  Уведомления станции. Показываются на dashboard.html при первом заходе
  после закрытия очередного квеста; все полученные уведомления доступны
  по иконке «конверт» в шапке.
*/

const NOTIFICATIONS = [
  {
    id: 'n1',
    after: 'q0',
    title: 'КАДРОВАЯ БАЗА',
    text: 'Кадровая база станции содержит сведения о персонале, задействованном в последней операции сектора GAMMA. Открой Терминал — SQL.',
    linkText: 'Терминал — SQL',
    linkHref: 'staff-db.html'
  },
  {
    id: 'n2',
    after: 'q1',
    title: 'ФОТОАРХИВ',
    text: 'В последний раз его видели в поле — он успел загрузить фото, после чего сигнал исчез. Проверь фотоархив.',
    linkText: 'Архивы — Фотоархив',
    linkHref: 'photos.html'
  },
  {
    id: 'n3',
    after: 'q2',
    title: 'КАРТА',
    text: 'Координаты определены. Открой Карту.',
    linkText: 'Карта',
    linkHref: 'map.html'
  },
  {
    id: 'n4',
    after: 'q3',
    title: 'РАДИОАРХИВ AP-07',
    text: 'Архив точки AP-07 содержит несколько повреждённых записей. Определи нужную по техническому журналу.',
    linkText: 'Архивы — Радиозаписи',
    linkHref: 'radio-archive.html'
  },
  {
    id: 'n5',
    after: 'q4',
    title: 'МЕТКА SHADOW-01',
    text: 'Обнаружена метка SHADOW-01. Требуется сверка с личным делом.',
    linkText: 'База сотрудников — Позывные',
    linkHref: 'nicknames.html'
  },
  {
    id: 'n6',
    after: 'q5',
    title: 'СИГНАЛ ВОССТАНОВЛЕН',
    text: 'Сигнал восстановлен. Проверь логи активности терминала.',
    linkText: 'Логи активности',
    linkHref: 'logs.html'
  },
  {
    id: 'n7',
    after: 'q6',
    title: 'АКТИВНОСТЬ В СЕКТОРЕ GAMMA',
    text: 'Обнаружена активность в секторе GAMMA. Проверь систему видеонаблюдения.',
    linkText: 'Видеонаблюдение',
    linkHref: 'cameras.html'
  },
  {
    id: 'n8',
    after: 'q7',
    title: 'ЛИЧНЫЙ ДНЕВНИК',
    text: 'Он упомянул личный дневник. Возможно, о нём есть служебные записи.',
    linkText: 'Терминал SQL',
    linkHref: 'staff-db.html'
  },
  {
    id: 'n9',
    after: 'q8',
    title: 'ОПЕРАЦИЯ ЗАВЕРШЕНА',
    text: 'Канал связи закрыт. Дальнейшие действия — вне станции.',
    linkText: '',
    linkHref: ''
  }
];

// Строгий порядок: уведомление доступно, только если пройден его квест
// И все предыдущие. Цепочка обрывается на первом непройденном квесте,
// поэтому прохождение «из середины» не открывает последующие сообщения.
function availableNotifications() {
  const list = [];
  for (const n of NOTIFICATIONS) {
    if (!isDone(n.after)) break;
    list.push(n);
  }
  return list;
}

// Время получения: фиксируется один раз, в момент, когда уведомление становится доступным
// (вызывается из markDone() и при загрузке страниц). Хранится в notif_time_<id>.
function stampNotifications() {
  availableNotifications().forEach(n => {
    const key = 'notif_time_' + n.id;
    try {
      if (!localStorage.getItem(key)) localStorage.setItem(key, String(Date.now()));
    } catch (e) { /* localStorage недоступен — дата подставится текущая */ }
  });
}

function notificationTime(n) {
  let raw = null;
  try { raw = Number(localStorage.getItem('notif_time_' + n.id)); } catch (e) { /* см. выше */ }
  return new Date(raw || Date.now()).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function pendingNotification() {
  stampNotifications();
  return availableNotifications().find(n => localStorage.getItem('notif_' + n.id) !== 'shown');
}

function showNotification(n, onClose) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const link = n.linkHref
    ? `<a class="btn" href="${n.linkHref}">${n.linkText}</a>`
    : '';
  backdrop.innerHTML = `
    <div class="modal">
      <h3>ВХОДЯЩЕЕ СООБЩЕНИЕ — ${n.title}</h3>
      <p class="note-time">${notificationTime(n)}</p>
      <p>${n.text}</p>
      <div class="modal-actions">
        ${link}
        <button type="button" data-close>Понятно</button>
      </div>
    </div>`;
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop || e.target.hasAttribute('data-close')) {
      backdrop.remove();
      if (onClose) onClose();
    }
  });
  document.body.appendChild(backdrop);
}

// true — во «Входящих» открыто только самое новое сообщение, старые свёрнуты (раскрываются кликом);
// false — все сообщения раскрыты, свернуть можно вручную.
const INBOX_COLLAPSE_OLD = true;

function showInbox() {
  stampNotifications();
  const list = availableNotifications();
  list.forEach(n => localStorage.setItem('notif_' + n.id, 'shown'));
  const newestId = list.length ? list[list.length - 1].id : null;
  // Новые сверху; самое новое подсвечено яркой рамкой. Блок сворачивается по клику на заголовок.
  const items = list.length
    ? list.slice().reverse().map(n => {
        const isNewest = n.id === newestId;
        const open = isNewest || !INBOX_COLLAPSE_OLD;
        return `<details class="panel note${isNewest ? ' newest' : ''}"${open ? ' open' : ''}>
          <summary><span class="note-title">${n.title}</span>${isNewest ? '<span class="badge">НОВОЕ</span>' : ''}<span class="note-date">${notificationTime(n)}</span></summary>
          <p>${n.text}</p>${n.linkHref ? `<p><a href="${n.linkHref}">${n.linkText}</a></p>` : ''}
        </details>`;
      }).join('')
    : '<p class="muted">Входящих сообщений нет.</p>';
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <h3>ВХОДЯЩИЕ</h3>
      ${items}
      <div class="modal-actions"><button type="button" data-close>Закрыть</button></div>
    </div>`;
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop || e.target.hasAttribute('data-close')) {
      backdrop.remove();
      renderEnvelopeState();
    }
  });
  document.body.appendChild(backdrop);
}

function renderEnvelopeState() {
  const btn = document.querySelector('.envelope');
  if (btn) btn.classList.toggle('has-new', Boolean(pendingNotification()));
}

// Показ нового уведомления при заходе на дашборд
function processPendingNotification() {
  const n = pendingNotification();
  if (!n) return;
  localStorage.setItem('notif_' + n.id, 'shown');
  showNotification(n, renderEnvelopeState);
}
