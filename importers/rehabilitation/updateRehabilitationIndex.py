#!/usr/bin/env python3
"""Build a local search index from the table in joint order No. 774/2691."""

import argparse
import json
import re
from pathlib import Path

import pdfplumber


DEFAULT_COLUMN_LIMITS = (68, 169, 310, 422)
ROW_NUMBER_RE = re.compile(r"^\d+$")
ICD_RE = re.compile(r"\b([A-ZА-ЯІЇЄ]\d{2}(?:\.\d{1,2})?)\b")
ICD_RANGE_RE = re.compile(r"\b([A-Z])\s?(\d{2})\s*[-–]\s*([A-Z])?\s?(\d{2})\b")


def clean_text(value):
    value = str(value or "").replace("\u00ad", "").replace("", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip(" \n")


def group_lines(words, tolerance=2.2):
    lines = []
    for word in sorted(words, key=lambda item: (item["top"], item["x0"])):
        line = next((item for item in reversed(lines[-3:]) if abs(item["top"] - word["top"]) <= tolerance), None)
        if line is None:
            line = {"top": word["top"], "words": []}
            lines.append(line)
        line["words"].append(word)
    for line in lines:
        line["words"].sort(key=lambda item: item["x0"])
    return lines


def column_for_x(x0, limits):
    if x0 < limits[0]:
        return 0
    if x0 < limits[1]:
        return 1
    if x0 < limits[2]:
        return 2
    if x0 < limits[3]:
        return 3
    return 4


def line_columns(line, limits):
    columns = [[] for _ in range(5)]
    for word in line["words"]:
        columns[column_for_x(word["x0"], limits)].append(word["text"])
    return [clean_text(" ".join(items)) for items in columns]


def page_column_segments(page):
    """Return table boundaries for each vertical segment on a PDF page."""
    groups = {}
    for rect in page.rects:
        if rect["width"] >= 1.2 or rect["height"] <= 100:
            continue
        key = (round(rect["top"], 1), round(rect["bottom"], 1))
        groups.setdefault(key, []).append(round(rect["x0"], 1))

    segments = []
    for (top, bottom), positions in groups.items():
        positions = sorted(set(positions))
        if len(positions) < 6:
            continue
        positions = positions[-6:]
        segments.append({
            "top": top,
            "bottom": bottom,
            "limits": tuple(positions[1:5]),
        })
    return segments


def limits_for_line(line_top, segments, fallback):
    matches = [
        segment
        for segment in segments
        if segment["top"] - 3 <= line_top <= segment["bottom"] + 3
    ]
    if not matches:
        return fallback
    segment = min(matches, key=lambda item: item["bottom"] - item["top"])
    return segment["limits"]


def is_row_start(columns):
    return bool(
        ROW_NUMBER_RE.fullmatch(columns[0])
        and columns[1]
        and not ROW_NUMBER_RE.fullmatch(columns[1])
        and (columns[2] or columns[3] or columns[4])
    )


def extract_icd_patterns(text):
    patterns = []
    for match in ICD_RANGE_RE.finditer(text):
        start_letter, start_number, end_letter, end_number = match.groups()
        if end_letter and end_letter != start_letter:
            patterns.extend([f"{start_letter}{start_number}", f"{end_letter}{end_number}"])
            continue
        start, end = int(start_number), int(end_number)
        if 0 <= end - start <= 20:
            patterns.extend(f"{start_letter}{number:02d}" for number in range(start, end + 1))
    patterns.extend(match.group(1) for match in ICD_RE.finditer(text))
    return list(dict.fromkeys(patterns))


def append_columns(entry, columns):
    keys = ("rowNumber", "productName", "indications", "contraindications", "diagnosisText")
    for key, value in zip(keys, columns):
        if not value or key == "rowNumber":
            continue
        entry[key] = clean_text(f"{entry.get(key, '')} {value}")


def parse_pdf(pdf_path):
    entries = []
    current = None
    section = ""
    classification = ""
    limits = DEFAULT_COLUMN_LIMITS
    classification_pending = False

    with pdfplumber.open(pdf_path) as document:
        for page_number, page in enumerate(document.pages, start=1):
            segments = page_column_segments(page)
            lines = group_lines(page.extract_words(use_text_flow=False, keep_blank_chars=False))
            for line in lines:
                full_line = clean_text(" ".join(word["text"] for word in line["words"]))
                if full_line.startswith("Розділ "):
                    if current:
                        current["pageEnd"] = page_number
                        entries.append(current)
                        current = None
                    section = full_line
                    classification_pending = False
                    continue
                if re.match(r"^\d+\.\s", full_line):
                    if current:
                        current["pageEnd"] = page_number
                        entries.append(current)
                        current = None
                    classification = full_line
                    classification_pending = "ISO 9999" not in full_line
                    continue
                if classification_pending:
                    classification = clean_text(f"{classification} {full_line}")
                    classification_pending = "ISO 9999" not in classification
                    continue
                if "ISO 9999" in full_line:
                    if current:
                        current["pageEnd"] = page_number
                        entries.append(current)
                        current = None
                    classification = full_line
                    continue
                if (
                    "Найменування" in full_line
                    or "Показання щодо" in full_line
                    or "Протипоказання" in full_line
                    or full_line in {"1 2 3 4 5", "N з/п"}
                ):
                    continue

                limits = limits_for_line(line["top"], segments, limits)
                columns = line_columns(line, limits)
                if is_row_start(columns):
                    if current:
                        current["pageEnd"] = page_number
                        entries.append(current)
                    current = {
                        "id": "",
                        "section": section,
                        "classification": classification,
                        "rowNumber": columns[0],
                        "productName": columns[1],
                        "indications": columns[2],
                        "contraindications": columns[3],
                        "diagnosisText": columns[4],
                        "icdPatterns": [],
                        "pageStart": page_number,
                        "pageEnd": page_number,
                    }
                elif current:
                    if full_line.startswith("Генеральний директор"):
                        current["pageEnd"] = page_number
                        entries.append(current)
                        current = None
                        continue
                    append_columns(current, columns)

        if current:
            current["pageEnd"] = len(document.pages)
            entries.append(current)

    cleaned = []
    for index, entry in enumerate(entries, start=1):
        entry["id"] = f"order-774-2691-{index:03d}"
        entry["icdPatterns"] = extract_icd_patterns(entry["diagnosisText"])
        if entry["productName"] and entry["icdPatterns"]:
            cleaned.append(entry)
    return cleaned


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    entries = parse_pdf(args.source)
    payload = {
        "source": {
            "title": "Наказ Мінсоцполітики України та МОЗ України № 774/2691",
            "date": "2020-11-20",
            "officialUrl": "https://zakon.rada.gov.ua/laws/show/z0074-21",
            "registration": "№ 74/35696 від 18.01.2021",
        },
        "entryCount": len(entries),
        "entries": entries,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {args.output} with {len(entries)} searchable rows")


if __name__ == "__main__":
    main()
