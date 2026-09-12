#!/usr/bin/env python3
"""Генерация station.sqlite для STATION ECHO-7.

Запускается один раз оффлайн:  python3 data/generate_db.py
Создаёт data/station.sqlite с таблицами employees (150) и notes (150).
"""

import base64
import os
import random
import sqlite3

random.seed(7)

HERE = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(HERE, "station.sqlite")

TARGET = {
    "id": 87,
    "name": "Viktor Orel",
    "password": "bKlb85kA",
    "hiring_from": "2016-04-02",
    "role": "Scout",
    "sector": "Lambda",
    "clearance": "Omega",
    "status": "missing",
}

DIARY_PATH = "diary-vorel-087.html"
DIARY_ENCODE_LAYERS = 2

ROLES = [
    "Station Commander", "Scientist", "Engineer", "Security Guard", "Medic",
    "Technician", "Communications Operator", "Scout", "Laboratory Technician",
    "Quartermaster",
]
SECTORS = [
    "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta",
    "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omicron",
]
FIRST = [
    "Anna", "Boris", "Clara", "Daniel", "Elena", "Felix", "Greta", "Henrik",
    "Irina", "Jonas", "Karin", "Lukas", "Marta", "Niklas", "Olga", "Pavel",
    "Quentin", "Rita", "Stefan", "Tomas", "Ulrika", "Viktor", "Wanda",
    "Xenia", "Yuri", "Zoya", "Adam", "Bianca", "Cyrus", "Dora",
]
LAST = [
    "Adler", "Brandt", "Cross", "Dahl", "Ecker", "Falk", "Groth", "Halvorsen",
    "Ivanov", "Jansen", "Kovacs", "Lindqvist", "Maurer", "Novak", "Orel",
    "Petrov", "Quist", "Rask", "Stern", "Tamm", "Ulriksen", "Vogel",
    "Wessel", "Yakovlev", "Zeller", "Berg", "Holm", "Marek", "Strand", "Vidmar",
]

NOTE_TEXTS = [
    "Обновил инвентарь сектора Beta.",
    "Запрошен отпуск на 3 дня.",
    "Прошёл плановый медосмотр.",
    "Заменил фильтры в вентиляции южного крыла.",
    "Сдал отчёт по расходу топлива.",
    "Проверка огнетушителей выполнена.",
    "Перенёс смену на вторник.",
    "Получил новый комплект полевой формы.",
    "Калибровка датчиков давления завершена.",
    "Жалоба на шум генератора, передана техотделу.",
    "Обход периметра без замечаний.",
    "Заказал запасные аккумуляторы для раций.",
    "Продлил допуск к складу химикатов.",
    "Провёл инструктаж для новой смены.",
    "Восстановил журнал учёта после сбоя питания.",
    "Осмотр катера завершён, замечаний нет.",
    "Передал ключи от лаборатории сменщику.",
    "Обновил список контактов дежурной службы.",
    "Зафиксировал перепад температуры в холодильной камере.",
    "Отправил заявку на ремонт двери ангара.",
]

DECOY_NOTES = [
    "Резервная копия журнала перенесена в архив.",
    "Смена пароля запланирована на следующий квартал.",
    "Перечень запчастей уточняется у поставщика.",
    "Протокол связи обновлён до версии 2.4.",
    "Заявка на перевод в сектор Delta отклонена.",
    "Учебная тревога проведена по графику.",
    "Комплект аптечки пополнен.",
]


def rand_password() -> str:
    alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "".join(random.choice(alphabet) for _ in range(random.randint(8, 12)))


def rand_date() -> str:
    year = random.randint(1996, 2018)
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{year:04d}-{month:02d}-{day:02d}"


def weighted(options):
    values, weights = zip(*options)
    return random.choices(values, weights=weights, k=1)[0]


def encode(text: str, layers: int = 1) -> str:
    data = text.encode("utf-8")
    for _ in range(layers):
        data = base64.b64encode(data)
    return data.decode("ascii")


def build_employees():
    rows = []
    used_names = {TARGET["name"]}
    for emp_id in range(1, 151):
        if emp_id == TARGET["id"]:
            rows.append(TARGET.copy())
            continue
        while True:
            name = f"{random.choice(FIRST)} {random.choice(LAST)}"
            if name not in used_names:
                used_names.add(name)
                break
        sector = random.choice(SECTORS)
        clearance = weighted([("Basic", 70), ("Advanced", 25), ("Omega", 5)])
        # Критично: пара Lambda + Omega должна быть уникальной
        while sector == TARGET["sector"] and clearance == TARGET["clearance"]:
            sector = random.choice(SECTORS)
        rows.append({
            "id": emp_id,
            "name": name,
            "password": rand_password(),
            "hiring_from": rand_date(),
            "role": random.choice(ROLES),
            "sector": sector,
            "clearance": clearance,
            "status": weighted([("active", 90), ("missing", 7), ("deceased", 3)]),
        })
    return rows


def build_notes():
    decoy_ids = random.sample([i for i in range(1, 151) if i != TARGET["id"]], len(DECOY_NOTES))
    decoys = dict(zip(decoy_ids, DECOY_NOTES))
    rows = []
    for note_id in range(1, 151):
        if note_id == TARGET["id"]:
            note = encode(DIARY_PATH, DIARY_ENCODE_LAYERS)
        elif note_id in decoys:
            note = encode(decoys[note_id], 1)
        else:
            note = random.choice(NOTE_TEXTS)
        rows.append((note_id, note))
    return rows


def main():
    employees = build_employees()
    lambda_omega = [e for e in employees
                    if e["sector"] == TARGET["sector"] and e["clearance"] == TARGET["clearance"]]
    assert len(lambda_omega) == 1 and lambda_omega[0]["id"] == TARGET["id"], lambda_omega

    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """CREATE TABLE employees (
               id INTEGER PRIMARY KEY,
               name TEXT,
               password TEXT,
               hiring_from TEXT,
               role TEXT,
               sector TEXT,
               clearance TEXT,
               status TEXT)"""
    )
    cur.executemany(
        "INSERT INTO employees VALUES (:id, :name, :password, :hiring_from, :role, :sector, :clearance, :status)",
        employees,
    )
    cur.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, note TEXT)")
    cur.executemany("INSERT INTO notes VALUES (?, ?)", build_notes())
    conn.commit()
    conn.close()
    print(f"created {DB_PATH}")
    print("notes[087] =", encode(DIARY_PATH, DIARY_ENCODE_LAYERS))


if __name__ == "__main__":
    main()
