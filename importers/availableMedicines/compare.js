const fs = require('fs');

function readPreviousMedicines(filePath) {
  if (!fs.existsSync(filePath)) return [];

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function compareRecordOrder(first, second) {
  return (
    first.id.localeCompare(second.id) ||
    Number(first.copayment || 0) - Number(second.copayment || 0) ||
    String(first.tradeName || '').localeCompare(String(second.tradeName || ''), 'uk-UA')
  );
}

function indexByStableOccurrence(records) {
  const counters = new Map();
  const indexedRecords = [...records].sort(compareRecordOrder).map((record) => {
    const count = (counters.get(record.id) || 0) + 1;
    counters.set(record.id, count);

    return {
      key: `${record.id}#${count}`,
      record,
    };
  });

  return new Map(indexedRecords.map((item) => [item.key, item.record]));
}

function compareMedicines(previousRecords, nextRecords) {
  const previousById = indexByStableOccurrence(previousRecords);
  const nextById = indexByStableOccurrence(nextRecords);
  const previousItems = [...previousById.entries()].map(([key, record]) => ({ key, record }));
  const nextItems = [...nextById.entries()].map(([key, record]) => ({ key, record }));

  const added = nextItems.filter((item) => !previousById.has(item.key)).map((item) => item.record);
  const removed = previousItems.filter((item) => !nextById.has(item.key)).map((item) => item.record);
  const changedCopayments = nextItems
    .filter((item) => previousById.has(item.key))
    .filter((item) => previousById.get(item.key).copayment !== item.record.copayment)
    .map((item) => ({
      id: item.record.id,
      activeIngredient: item.record.activeIngredient,
      tradeName: item.record.tradeName,
      previousCopayment: previousById.get(item.key).copayment,
      nextCopayment: item.record.copayment,
    }));

  const previousManufacturers = new Set(previousRecords.map((record) => record.manufacturer).filter(Boolean));
  const newManufacturers = [
    ...new Set(
      nextRecords
        .map((record) => record.manufacturer)
        .filter(Boolean)
        .filter((manufacturer) => !previousManufacturers.has(manufacturer)),
    ),
  ];

  return {
    added,
    removed,
    changedCopayments,
    newManufacturers,
  };
}

module.exports = {
  readPreviousMedicines,
  compareMedicines,
};
