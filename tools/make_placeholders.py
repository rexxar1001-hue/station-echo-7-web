#!/usr/bin/env python3
"""Генерация ВРЕМЕННЫХ медиа-заглушек для STATION ECHO-7.

Запуск:  python3 tools/make_placeholders.py
Требует: pillow, piexif  (pip install pillow piexif)

Все созданные файлы — плейсхолдеры; их нужно заменить настоящими материалами,
сохранив имена (см. ASSETS.md). Исключение: EXIF-теги в field_photo_087.jpg
обязаны остаться такими же, как здесь (см. ASSETS.md).
"""

import math
import os
import random
import struct
import wave

import piexif
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "img")
AUDIO = os.path.join(ROOT, "audio", "AP-07")
SPEAKER_AUDIO = os.path.join(ROOT, "audio")

PHOTO_IDS = ["012", "031", "044", "087", "019", "103", "066", "128", "075", "008",
             "140", "052", "097", "023", "111", "038", "084", "149", "061", "005"]

AUDIO_FILES = ["rec_38.6.wav", "rec_47.2.wav", "rec_59.4.wav", "rec_71.9.wav",
               "rec_88.3.wav", "rec_96.5.wav", "rec_104.8.wav", "rec_117.2.wav",
               "rec_128.0.wav", "rec_142.7.wav", "rec_166.4.wav", "rec_181.3.wav",
               "rec_205.1.wav", "rec_219.6.wav"]

CAMERAS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]

GPS = {
    "lat": (45, 53, 32.28), "lat_ref": "N",
    "lng": (13, 3, 51.12), "lng_ref": "E",
    "dest_lat": (45, 54, 8.40), "dest_lat_ref": "N",
    "dest_lng": (13, 1, 12.00), "dest_lng_ref": "E",
}


def placeholder_image(path, size, text, bg=(18, 26, 30), fg=(120, 200, 170)):
    img = Image.new("RGB", size, bg)
    d = ImageDraw.Draw(img)
    d.rectangle([2, 2, size[0] - 3, size[1] - 3], outline=fg)
    d.text((12, 12), text, fill=fg)
    d.text((12, 28), "PLACEHOLDER", fill=(90, 110, 110))
    return img, d


def dms(value):
    deg, minute, sec = value
    return ((int(deg), 1), (int(minute), 1), (int(round(sec * 100)), 100))


def make_photos():
    for pid in PHOTO_IDS:
        name = f"field_photo_{pid}.jpg"
        path = os.path.join(IMG, name)
        img, _ = placeholder_image(path, (480, 320), name)
        if pid == "087":
            exif = {
                "0th": {
                    piexif.ImageIFD.Make: b"ECHO-7 Field Unit",
                    piexif.ImageIFD.Model: b"FC-2 Recorder",
                    piexif.ImageIFD.DateTime: b"2024:08:29 16:41:05",
                },
                "Exif": {
                    piexif.ExifIFD.DateTimeOriginal: b"2024:08:29 16:41:05",
                },
                "GPS": {
                    piexif.GPSIFD.GPSLatitudeRef: GPS["lat_ref"],
                    piexif.GPSIFD.GPSLatitude: dms(GPS["lat"]),
                    piexif.GPSIFD.GPSLongitudeRef: GPS["lng_ref"],
                    piexif.GPSIFD.GPSLongitude: dms(GPS["lng"]),
                    piexif.GPSIFD.GPSDestLatitudeRef: GPS["dest_lat_ref"],
                    piexif.GPSIFD.GPSDestLatitude: dms(GPS["dest_lat"]),
                    piexif.GPSIFD.GPSDestLongitudeRef: GPS["dest_lng_ref"],
                    piexif.GPSIFD.GPSDestLongitude: dms(GPS["dest_lng"]),
                },
                "1st": {}, "thumbnail": None, "Interop": {},
            }
            img.save(path, "JPEG", quality=80, exif=piexif.dump(exif))
        else:
            img.save(path, "JPEG", quality=80)


def make_island():
    w, h = 1500, 1000
    img = Image.new("RGB", (w, h), (8, 14, 18))
    d = ImageDraw.Draw(img)
    random.seed(11)
    # грубый контур «острова»
    points = []
    for i in range(36):
        a = i / 36 * 2 * math.pi
        r = 380 + random.randint(-70, 90)
        points.append((w / 2 + r * 1.5 * math.cos(a) / 1.4, h / 2 + r * math.sin(a)))
    d.polygon(points, fill=(20, 40, 36), outline=(90, 170, 150))
    for x in range(0, w, 100):
        d.line([(x, 0), (x, h)], fill=(16, 26, 30))
    for y in range(0, h, 100):
        d.line([(0, y), (w, y)], fill=(16, 26, 30))
    d.text((20, 20), "ISLAND MAP PLACEHOLDER 1500x1000", fill=(120, 200, 170))
    img.save(os.path.join(IMG, "island.jpg"))


def make_spectrograms():
    for f in AUDIO_FILES:
        name = "spectrogram_" + f.replace(".wav", "") + ".png"
        mark = "SHADOW-01" if f == "rec_142.7.wav" else ""
        img, d = placeholder_image(os.path.join(IMG, name), (800, 300), name)
        random.seed(hash(f) % 1000)
        for x in range(10, 790, 3):
            height = random.randint(10, 240)
            d.line([(x, 290), (x, 290 - height)], fill=(40 + height // 3, 90, 80))
        if mark:
            d.text((330, 140), mark, fill=(200, 255, 220))
        img.save(os.path.join(IMG, name))
    img, d = placeholder_image(os.path.join(IMG, "spectrogram_noise.png"), (800, 300), "spectrogram_noise.png")
    img.save(os.path.join(IMG, "spectrogram_noise.png"))


def make_cameras():
    for cam in CAMERAS:
        img, d = placeholder_image(os.path.join(IMG, f"camera_{cam}_empty.jpg"), (320, 180),
                                   f"camera_{cam}_empty")
        img.save(os.path.join(IMG, f"camera_{cam}_empty.jpg"), "JPEG", quality=75)
    img, d = placeholder_image(os.path.join(IMG, "camera_04_figure.jpg"), (320, 180), "camera_04_figure")
    d.ellipse([150, 60, 175, 85], fill=(200, 230, 220))
    d.rectangle([152, 85, 173, 150], fill=(200, 230, 220))
    img.save(os.path.join(IMG, "camera_04_figure.jpg"), "JPEG", quality=75)


def write_wav(path, seconds=2.0, rate=16000, tone=None):
    frames = int(seconds * rate)
    random.seed(hash(path) % 10000)
    data = bytearray()
    for i in range(frames):
        noise = random.uniform(-0.25, 0.25)
        value = noise
        if tone:
            value += 0.2 * math.sin(2 * math.pi * tone * i / rate)
        data += struct.pack("<h", int(max(-1, min(1, value)) * 32767))
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(bytes(data))


def make_audio():
    for f in AUDIO_FILES:
        freq = float(f.replace("rec_", "").replace(".wav", ""))
        write_wav(os.path.join(AUDIO, f), tone=freq * 3)
    write_wav(os.path.join(SPEAKER_AUDIO, "speaker_gamma_cam_04.wav"), seconds=3.0, tone=180)


def main():
    os.makedirs(IMG, exist_ok=True)
    os.makedirs(AUDIO, exist_ok=True)
    make_photos()
    make_island()
    make_spectrograms()
    make_cameras()
    make_audio()
    print("placeholders created in img/ and audio/")


if __name__ == "__main__":
    main()
