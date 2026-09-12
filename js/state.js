/*
  Прогресс операции. Всё хранится в localStorage браузера Агента.
  Флаги: q0..q8 (+ промежуточный q2a — фото найдено).
*/

const QUESTS = ['q0', 'q2a', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

function isDone(q) {
  return localStorage.getItem(q) === 'true';
}

function markDone(q) {
  localStorage.setItem(q, 'true');
}

function requireDone(q, redirectTo = 'dashboard.html') {
  if (CONFIG.openAccess) return true;
  if (!isDone(q)) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

function setData(key, value) {
  localStorage.setItem('data_' + key, value);
}

function getData(key) {
  return localStorage.getItem('data_' + key);
}

function resetProgress() {
  Object.keys(localStorage)
    .filter(k => QUESTS.includes(k) || k.startsWith('data_') || k.startsWith('notif_'))
    .forEach(k => localStorage.removeItem(k));
}
