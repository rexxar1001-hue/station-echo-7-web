#!/usr/bin/env python3
"""Вшивает GPS-координаты во все фото фотоархива.

Координаты каждого снимка соответствуют его точке на карте острова
(js/config.js -> mapPoints) с небольшим случайным разбросом.
Файл field_photo_087.jpg не трогается: его EXIF задаёт tools/embed_exif.py.

Использование:  python3 tools/embed_photo_gps.py
Требует:        pip install piexif
"""

import json
import os
import random
import re

import piexif

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "img")
CONFIG = os.path.join(ROOT, "js", "config.js")
QUEST_PHOTO = "field_photo_087.jpg"

# Привязка пиксельной сетки карты к координатам (как в map.html -> gameToMap)
ANCHOR_CODE = "AP-07"
ANCHOR_LAT = 45.8923
ANCHOR_LNG = 13.0642
SCALE = 10000.0
JITTER = 0.0015


def read_points():
    src = open(CONFIG, encoding="utf-8").read()
    body = re.search(r"mapPoints:\s*\[(.*?)\n\s*\],", src, re.S).group(1)
    points = []
    for row in re.finditer(r"\{[^}]*\}", body):
        text = row.group(0)
        code = re.search(r"code:\s*'([^']+)'", text).group(1)
        x = int(re.search(r"x:\s*(\d+)", text).group(1))
        y = int(re.search(r"y:\s*(\d+)", text).group(1))
        photos = re.findall(r"'(\d{3})'", re.search(r"photos:\s*\[([^\]]*)\]", text).group(1))
        points.append({"code": code, "x": x, "y": y, "photos": photos})
    return points


def to_coords(point, anchor):
    lat = ANCHOR_LAT + (point["y"] - anchor["y"]) / SCALE + random.uniform(-JITTER, JITTER)
    lng = ANCHOR_LNG + (point["x"] - anchor["x"]) / SCALE + random.uniform(-JITTER, JITTER)
    return round(lat, 6), round(lng, 6)


def dms(value):
    deg = int(abs(value))
    minute_full = (abs(value) - deg) * 60
    minute = int(minute_full)
    sec = (minute_full - minute) * 60
    return ((deg, 1), (minute, 1), (int(round(sec * 100)), 100))


def main():
    random.seed(87)
    points = read_points()
    anchor = next(p for p in points if p["code"] == ANCHOR_CODE)
    written = {}
    for point in points:
        for pid in point["photos"]:
            name = f"field_photo_{pid}.jpg"
            path = os.path.join(IMG, name)
            if name == QUEST_PHOTO or not os.path.exists(path):
                continue
            lat, lng = to_coords(point, anchor)
            exif = piexif.load(path)
            exif["GPS"] = {
                piexif.GPSIFD.GPSLatitudeRef: "N",
                piexif.GPSIFD.GPSLatitude: dms(lat),
                piexif.GPSIFD.GPSLongitudeRef: "E",
                piexif.GPSIFD.GPSLongitude: dms(lng),
            }
            exif["thumbnail"] = None
            piexif.insert(piexif.dump(exif), path)
            written[name] = (point["code"], lat, lng)
    print(json.dumps(written, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
