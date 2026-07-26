function createIssue(type, message, record = null) {
  return {
    type,
    message,
    row: record?.sourceRow || null,
    id: record?.id || null,
  };
}

function getDuplicateKey(record) {
  return [
    record.activeIngredient,
    record.tradeName,
    record.manufacturer,
    record.dosage,
    record.packageDescription,
  ]
    .map((value) => String(value || '').toLocaleLowerCase('uk-UA'))
    .join('|');
}

function validateMedicines(records) {
  const errors = [];
  const warnings = [];
  const seen = new Map();

  records.forEach((record) => {
    if (!record.activeIngredient) {
      errors.push(createIssue('missing_active_ingredient', 'Порожня діюча речовина.', record));
    }

    if (!record.tradeName) {
      errors.push(createIssue('missing_trade_name', 'Порожня торгова назва.', record));
    }

    if (!record.manufacturer) {
      errors.push(createIssue('missing_manufacturer', 'Порожній виробник.', record));
    }

    if (record.copayment === null || record.copayment === undefined || Number.isNaN(record.copayment)) {
      errors.push(createIssue('invalid_copayment', 'Доплата не розпізнана як число.', record));
    }

    if (record.packageDescription && record.packageQuantity === null) {
      warnings.push(createIssue('package_quantity_not_numeric', 'Кількість в упаковці не розпізнана як число.', record));
    }

    const duplicateKey = getDuplicateKey(record);
    if (seen.has(duplicateKey)) {
      warnings.push(
        createIssue(
          'possible_duplicate',
          `Можливий дубль із рядком ${seen.get(duplicateKey)}.`,
          record,
        ),
      );
    } else {
      seen.set(duplicateKey, record.sourceRow);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

module.exports = {
  validateMedicines,
};
