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


def parse_table_row(row):
    cells = [clean(cell) for cell in row or []]
    if len(cells) not in (15, 16):
        return None

    row_number = cells[0]
    active_ingredient = cells[1]
    trade_name = cells[2]
    copayment_index = 13 if len(cells) == 15 else 15
    copayment = parse_number(cells[copayment_index])

    if not row_number.isdigit():
        return None
    if not active_ingredient or active_ingredient.isdigit():
        return None
    if not trade_name or trade_name.isdigit():
        return None
    if copayment is None:
        return None

    return {
        "rowNumber": row_number,
        "activeIngredient": active_ingredient,
        "tradeName": trade_name,
        "form": cells[3],
        "dosage": cells[4],
        "package": cells[5],
        "manufacturer": cells[7],
        "copayment": str(copayment),
    }


def parse_page_leading_record(page, parsed_row_numbers):
    """Recover a record split by a PDF page break.

    In the NSZU source, the first medicine on most pages starts above the
    horizontal table grid. pdfplumber therefore sees only one continuation
    cell in the line-based table. The text itself is still positioned in the
    same fixed columns, so it can be reconstructed from word coordinates.
    """
    words = page.extract_words() or []
    starts = [
        word
        for word in words
        if word["x0"] < 75 and re.fullmatch(r"\d+", word["text"])
    ]
    if not starts:
        return None

    start = starts[0]
    row_number = start["text"]
    if row_number in parsed_row_numbers:
        return None

    end_top = starts[1]["top"] if len(starts) > 1 else page.height
    boundaries = [50, 80, 145, 210, 247, 277, 298, 321, 469, 505, 540, 568, 598, 624, 652, 680, 703]
    columns = []

    for left, right in zip(boundaries, boundaries[1:]):
        column_words = [
            word
            for word in words
            if word["top"] >= start["top"] - 0.5
            and word["top"] < end_top - 0.5
            and left <= (word["x0"] + word["x1"]) / 2 < right
        ]
        column_words.sort(key=lambda word: (round(word["top"], 1), word["x0"]))
        columns.append(clean(" ".join(word["text"] for word in column_words)))

    copayment = parse_number(columns[15])
    if not columns[1] or not columns[2] or copayment is None:
        return None

    return {
        "rowNumber": columns[0],
        "activeIngredient": columns[1],
        "tradeName": columns[2],
        "form": columns[3],
        "dosage": columns[4],
        "package": columns[5],
        "manufacturer": columns[7],
        "copayment": str(copayment),
    }


def extract_records(pdf_path):
    records = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_number, page in enumerate(pdf.pages, start=1):
            page_records = []
            tables = page.extract_tables() or []
            for table in tables:
                for row in table:
                    parsed_row = parse_table_row(row)
                    if not parsed_row:
                        continue

                    page_records.append(parsed_row)

            medicine_table_present = any(table and len(table[0]) in (15, 16) for table in tables)
            leading_record = (
                parse_page_leading_record(
                    page,
                    {record["rowNumber"] for record in page_records},
                )
                if medicine_table_present
                else None
            )
            if leading_record:
                page_records.insert(0, leading_record)

            for parsed_row in page_records:
                record = {
                    "sourceRow": f"pdf-page-{page_number}-row-{parsed_row['rowNumber']}",
                    "activeIngredient": parsed_row["activeIngredient"],
                    "tradeName": parsed_row["tradeName"],
                    "manufacturer": parsed_row["manufacturer"],
                    "form": parsed_row["form"],
                    "dosage": parsed_row["dosage"],
                    "package": parsed_row["package"],
                    "copayment": parsed_row["copayment"],
                }
                records.append(record)

    return records


def main():
    if len(sys.argv) < 2:
        raise SystemExit("Usage: parsePdf.py <pdf-path>")

    print(json.dumps(extract_records(sys.argv[1]), ensure_ascii=False))


if __name__ == "__main__":
    main()
