/*
  Общий SQL-терминал (квесты 1 и 8). Работает полностью в браузере
  через sql.js: файл data/station.sqlite загружается и выполняется локально.
*/

const FORBIDDEN = /pragma|sqlite_master|sqlite_sequence|\.schema|schema|attach|drop|delete|update|insert|alter|create/i;

async function initSqlTerminal(options) {
  const {
    inputId, runId, outputId, allowedTables, onResult
  } = options;

  const output = document.getElementById(outputId);
  output.innerHTML = '<p class="muted">Подключение к базе станции…</p>';

  const SQL = await initSqlJs({ locateFile: f => `https://sql.js.org/dist/${f}` });
  const buf = await (await fetch('data/station.sqlite')).arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buf));
  output.innerHTML = '<p class="muted">База подключена. Введите запрос.</p>';

  function render(res) {
    if (!res.length) {
      output.innerHTML = '<p class="muted">Запрос выполнен, строк не возвращено.</p>';
      return;
    }
    const { columns, values } = res[0];
    const head = columns.map(c => `<th>${c}</th>`).join('');
    const body = values.map(row =>
      `<tr>${row.map(v => `<td>${v === null ? '' : String(v)}</td>`).join('')}</tr>`
    ).join('');
    output.innerHTML = `<p class="muted">Строк: ${values.length}</p><table><tr>${head}</tr>${body}</table>`;
    if (onResult) onResult(columns, values);
  }

  function run() {
    const sql = document.getElementById(inputId).value;
    if (!sql.trim()) return;
    if (FORBIDDEN.test(sql)) {
      output.innerHTML = '<p class="status-bad">Доступ ограничен</p>';
      return;
    }
    if (!/^\s*select\b/i.test(sql.trim())) {
      output.innerHTML = '<p class="status-bad">Разрешены только запросы SELECT</p>';
      return;
    }
    if (allowedTables && !allowedTables.some(t => new RegExp(`\\b${t}\\b`, 'i').test(sql))) {
      output.innerHTML = `<p class="status-bad">Таблица недоступна с этого терминала</p>`;
      return;
    }
    try {
      render(db.exec(sql));
    } catch (e) {
      output.innerHTML = `<p class="status-bad">Ошибка: ${e.message}</p>`;
    }
  }

  document.getElementById(runId).addEventListener('click', run);
  document.getElementById(inputId).addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run();
  });
}
