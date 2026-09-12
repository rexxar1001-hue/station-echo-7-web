#!/usr/bin/env python3
"""Вшивает в JPEG нужные GPS-теги для квеста 2.

Использование:  python3 tools/embed_exif.py img/field_photo_087.jpg
Требует:        pip install piexif
"""

import sys

import piexif

GPS_LAT = (45, 53, 32.28)
GPS_LNG = (13, 3, 51.12)
GPS_DEST_LAT = (45, 54, 8.40)
GPS_DEST_LNG = (13, 1, 12.00)


def dms(value):
    deg, minute, sec = value
    return ((int(deg), 1), (int(minute), 1), (int(round(sec * 100)), 100))


def main(path):
    try:
        exif = piexif.load(path)
    except Exception:
        exif = {"0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": None, "Interop": {}}
    exif["GPS"] = {
        piexif.GPSIFD.GPSLatitudeRef: "N",
        piexif.GPSIFD.GPSLatitude: dms(GPS_LAT),
        piexif.GPSIFD.GPSLongitudeRef: "E",
        piexif.GPSIFD.GPSLongitude: dms(GPS_LNG),
        piexif.GPSIFD.GPSDestLatitudeRef: "N",
        piexif.GPSIFD.GPSDestLatitude: dms(GPS_DEST_LAT),
        piexif.GPSIFD.GPSDestLongitudeRef: "E",
        piexif.GPSIFD.GPSDestLongitude: dms(GPS_DEST_LNG),
    }
    exif["0th"][piexif.ImageIFD.Make] = b"ECHO-7 Field Unit"
    exif["0th"][piexif.ImageIFD.Model] = b"FC-2 Recorder"
    exif["thumbnail"] = None
    piexif.insert(piexif.dump(exif), path)
    print("EXIF записан в", path)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
