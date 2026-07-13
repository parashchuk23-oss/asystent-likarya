function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(String(value).replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function calculateRrFromHeartRate(heartRate) {
  const hr = toNumber(heartRate);
  if (!hr) return null;
  return 60 / hr;
}

export function normalizeRrSeconds({ rr, heartRate }) {
  const rrValue = toNumber(rr);
  if (rrValue) {
    return rrValue > 10 ? rrValue / 1000 : rrValue;
  }
  return calculateRrFromHeartRate(heartRate);
}

export function calculateQtMetrics({ qt, rr, heartRate, sex }) {
  const qtMs = toNumber(qt);
  const rrSeconds = normalizeRrSeconds({ rr, heartRate });

  if (!qtMs || !rrSeconds) {
    return null;
  }

  const qtSeconds = qtMs / 1000;
  const qtcBazett = (qtSeconds / Math.sqrt(rrSeconds)) * 1000;
  const qtcFridericia = (qtSeconds / Math.cbrt(rrSeconds)) * 1000;
  const qtcFramingham = (qtSeconds + 0.154 * (1 - rrSeconds)) * 1000;
  const heartRateValue = toNumber(heartRate) || 60 / rrSeconds;
  const qtcHodges = qtMs + 1.75 * (heartRateValue - 60);

  return {
    qt: Math.round(qtMs),
    rr: Number(rrSeconds.toFixed(2)),
    qtcBazett: Math.round(qtcBazett),
    qtcFridericia: Math.round(qtcFridericia),
    qtcFramingham: Math.round(qtcFramingham),
    qtcHodges: Math.round(qtcHodges),
    interpretation: interpretQtc(qtcFridericia, sex),
  };
}

export function interpretQtc(qtc, sex) {
  if (qtc < 350) {
    return {
      status: 'short',
      label: 'Короткий QTc',
      tone: 'warning',
      text: 'QTc виглядає коротким. Доцільно перевірити вимірювання, електроліти та клінічний контекст.',
    };
  }

  const prolongedThreshold = sex === 'female' ? 470 : 450;
  const markedlyProlongedThreshold = 500;

  if (qtc >= markedlyProlongedThreshold) {
    return {
      status: 'markedlyProlonged',
      label: 'Значно подовжений QTc',
      tone: 'danger',
      text: 'QTc ≥500 мс асоціюється з підвищеним ризиком шлуночкових аритмій. Потрібна клінічна оцінка причин і ризиків.',
    };
  }

  if (qtc > prolongedThreshold) {
    return {
      status: 'prolonged',
      label: 'Подовжений QTc',
      tone: 'warning',
      text: 'QTc перевищує орієнтовну межу для статі. Варто оцінити ліки, електроліти, ЧСС і супутні стани.',
    };
  }

  return {
    status: 'normal',
    label: 'QTc у межах орієнтовної норми',
    tone: 'success',
    text: 'QTc не виглядає подовженим за обраними орієнтирами. Інтерпретувати разом із клінікою та якістю вимірювання.',
  };
}

export function getQtClinicalNextSteps(metrics) {
  if (!metrics) return [];

  if (metrics.interpretation.status === 'markedlyProlonged') {
    return [
      'Перевірити коректність вимірювання QT і RR.',
      'Оцінити калій, магній, кальцій, функцію нирок і список препаратів.',
      'Розглянути невідкладну оцінку, якщо є синкопе, шлуночкові аритмії або QTc ≥500 мс.',
    ];
  }

  if (metrics.interpretation.status === 'prolonged') {
    return [
      'Перевірити препарати, що можуть подовжувати QT.',
      'Оцінити електроліти та клінічний контекст.',
      'За потреби повторити ЕКГ після корекції потенційних причин.',
    ];
  }

  if (metrics.interpretation.status === 'short') {
    return [
      'Перевірити вимірювання QT при достатній якості ЕКГ.',
      'Оцінити електролітні порушення та сімейний / синкопальний анамнез.',
    ];
  }

  return ['Документувати QTc разом із формулою, яку лікар вважає найбільш доречною для ситуації.'];
}
