import json
import re
import sys

import pdfplumber


def clean(value):
    return re.sub(r"\s+", " ", str(value or "").replace("\u00a0", " ")).strip()


def parse_number(value):
    text = clean(value).replace(" ", "").replace(",", ".")
    if not re.fullmatch(r"-?\d+(?:\.\d+)?", text):
        return None
    number = float(text)
    return int(number) if number.is_integer() else number


def looks_like_active_ingredient(value):
    text = clean(value)
    if not text or text.isdigit():
        return False
    lowered = text.lower()
    return "(" in text or "інсулін" in lowered or "кислота" in lowered


def parse_table_row(row):
    cells = [clean(cell) for cell in row or []]
    candidates = []

    if len(cells) >= 9:
        candidates.append(cells[:9])
    if len(cells) >= 10:
        # Some pages include the page number as the first table column.
        candidates.append(cells[1:10])

    for candidate in candidates:
        active_ingredient, trade_name = candidate[0], candidate[1]
        copayment = parse_number(candidate[8])

        if not looks_like_active_ingredient(active_ingredient):
            continue
        if not trade_name or trade_name.isdigit():
            continue
        if copayment is None:
            continue

        return candidate, copayment

    return None, None


def extract_records(pdf_path):
    records = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            # Pages 1-2 are title/content. The last pages contain medical devices, not medicines.
            if page_number < 3 or page_number > 82:
                continue

            for table in page.extract_tables() or []:
                for row in table:
                    parsed_row, copayment = parse_table_row(row)
                    if not parsed_row:
                        continue

                    record = {
                        "sourceRow": f"pdf-page-{page_number}",
                        "activeIngredient": parsed_row[0],
                        "tradeName": parsed_row[1],
                        "manufacturer": parsed_row[6],
                        "form": parsed_row[2],
                        "dosage": parsed_row[3],
                        "package": parsed_row[4],
                        "copayment": str(copayment),
                    }
                    records.append(record)

    return records


def main():
    if len(sys.argv) < 2:
        raise SystemExit("Usage: parsePdf.py <pdf-path>")

    print(json.dumps(extract_records(sys.argv[1]), ensure_ascii=False))


if __name__ == "__main__":
    main()
