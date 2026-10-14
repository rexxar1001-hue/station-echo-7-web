/*
  Всплывающее окно «Аварийное подключение монитора пульса» (квест 5).
  Закрыть окно можно только после правильной схемы. Вызов: openWiringModal(onSolved),
  onSolved выполняется при закрытии окна после успешного подключения.
*/
const WIRING_COLORS = [
  { key: 'red', label: 'Красный', css: '#e0473c' },
  { key: 'blue', label: 'Синий', css: '#4a7de0' },
  { key: 'yellow', label: 'Жёлтый', css: '#e0c33c' },
  { key: 'green', label: 'Зелёный', css: '#4ce06a' }
];

function openWiringModal(onSolved) {
  let selected = null, linked = {}, solved = false;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h3>АВАРИЙНОЕ ПОДКЛЮЧЕНИЕ МОНИТОРА ПУЛЬСА</h3>
      <p>Соедините контакты с разъёмами согласно монтажной схеме. Схема выдана Аналитику в печатном виде.</p>
      <p class="muted">Выберите контакт слева, затем разъём справа.</p>
      <div class="wire-board">
        <div class="wire-col" data-role="contacts"></div>
        <div class="wire-col" data-role="sockets"></div>
      </div>
      <p class="muted" data-role="msg"></p>
      <div class="modal-actions">
        <button type="button" data-role="reset">Сбросить попытку</button>
        <button type="button" data-role="close" style="display:none">Закрыть</button>
      </div>
    </div>`;
  const q = r => backdrop.querySelector(`[data-role="${r}"]`);

  function render() {
    q('contacts').innerHTML = WIRING_COLORS.map(c =>
      `<div class="contact ${selected === c.key ? 'selected' : ''} ${linked[c.key] ? 'linked' : ''}" data-color="${c.key}">
         <span class="dot" style="background:${c.css}"></span>${c.label}${linked[c.key] ? ' → ' + linked[c.key] : ''}
       </div>`).join('');
    const taken = Object.values(linked);
    q('sockets').innerHTML = [1, 2, 3, 4].map(n =>
      `<div class="socket ${taken.includes(n) ? 'linked' : ''}" data-socket="${n}">Разъём ${n}</div>`).join('');
  }

  function check() {
    if (Object.keys(linked).length < 4) return;
    if (WIRING_COLORS.every(c => linked[c.key] === CONFIG.wiring[c.key])) {
      solved = true;
      markDone('q5');
      q('msg').innerHTML = '<span class="status-bad">Критическая ошибка. Проверьте логи</span>';
      q('reset').style.display = 'none';
      q('close').style.display = '';
    } else {
      linked = {}; selected = null; render();
      q('msg').innerHTML = '<span class="status-bad">Неверная схема. Соединения сброшены, попробуйте снова.</span>';
    }
  }

  backdrop.addEventListener('click', e => {
    const contact = e.target.closest('[data-color]');
    if (contact && !solved) {
      if (!linked[contact.dataset.color]) { selected = contact.dataset.color; render(); }
      return;
    }
    const socketEl = e.target.closest('[data-socket]');
    if (socketEl && !solved) {
      const n = Number(socketEl.dataset.socket);
      if (!selected || Object.values(linked).includes(n)) return;
      linked[selected] = n; selected = null; render(); check();
      return;
    }
    if (e.target.closest('[data-role="reset"]') && !solved) {
      linked = {}; selected = null; q('msg').textContent = ''; render();
      return;
    }
    if (e.target.closest('[data-role="close"]') && solved) {
      backdrop.remove();
      if (onSolved) onSolved();
    }
    // клик по фону окно не закрывает — только кнопка после успеха
  });

  render();
  document.body.appendChild(backdrop);
}
