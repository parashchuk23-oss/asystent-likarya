'use client';

import { useMemo, useState } from 'react';

const impairmentOptions = [
  'відсутність кінцівок',
  'інші вади опорно-рухового апарату',
  'вади зору',
  'вади слуху',
  'інтелектуальні порушення',
  'порушення мови',
];

const selfCareTasks = [
  'самостійне пересування',
  'прийом їжі',
  'особиста гігієна',
  'одягання',
  'користування туалетом',
  'прийом ліків',
];

const emptyForm = {
  facility: '',
  patientName: '',
  birthDate: '',
  residence: '',
  disabilityGroup: '',
  impairments: [],
  impairmentOther: '',
  selfCareStatus: 'частково не здатний',
  limitedTasks: [],
  contraindications: 'немає',
  contraindicationDetails: '',
  collectiveStay: 'так',
  conclusionDate: '',
  chiefName: '',
  doctorName: '',
};

const copyToClipboard = async (text) => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  await navigator.clipboard.writeText(text);
  return true;
};

function formatDate(value) {
  if (!value) return '____ __________ 20___ року';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return '____ __________ 20___ року';

  const months = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  return `${Number(day)} ${months[Number(month) - 1]} ${year} року`;
}

function joinSelected(items, fallback) {
  return items.length ? items.join(', ') : fallback;
}

function getSelfCareHint(limitedTasks) {
  if (limitedTasks.length === 0) return 'За чек-листом не позначено обмежень самообслуговування.';
  if (limitedTasks.length <= 2) return 'Позначені окремі обмеження; часто це відповідає частковому обмеженню самообслуговування.';
  if (limitedTasks.length <= 4) return 'Позначено кілька базових обмежень; варто розглянути формулювання “частково не здатний”.';
  return 'Позначено більшість базових обмежень; варто розглянути формулювання “не здатний”.';
}

function buildConclusionText(form) {
  const impairmentText = [
    ...form.impairments,
    form.impairmentOther.trim(),
  ].filter(Boolean);
  const contraindicationLine =
    form.contraindications === 'є'
      ? `протипоказання для надання соціальних послуг у територіальному центрі соціального обслуговування є${form.contraindicationDetails.trim() ? `: ${form.contraindicationDetails.trim()}` : ''};`
      : 'протипоказань для надання соціальних послуг у територіальному центрі соціального обслуговування немає;';

  return [
    'МЕДИЧНИЙ ВИСНОВОК',
    'про здатність до самообслуговування та потребу в сторонній допомозі',
    '',
    `Заклад охорони здоров’я: ${form.facility || '____________________________________________'}`,
    `Пацієнт: ${form.patientName || '____________________________________________'}`,
    `Дата народження, місце проживання/перебування: ${[form.birthDate, form.residence].filter(Boolean).join(', ') || '____________________________________________'}`,
    `Група інвалідності: ${form.disabilityGroup || 'не зазначено'}`,
    '',
    `1. Наявність вад, що перешкоджають самообслуговуванню: ${joinSelected(impairmentText, 'не зазначено')}.`,
    `2. Здатність до самообслуговування: ${form.selfCareStatus}.`,
    '',
    '3. Висновок:',
    contraindicationLine,
    `може перебувати в колективі: ${form.collectiveStay}.`,
    '',
    `Дата оформлення: ${formatDate(form.conclusionDate)}`,
    '',
    `Керівник медичного закладу: ____________ ${form.chiefName || '________________'}`,
    `Лікар загальної практики - сімейний лікар: ____________ ${form.doctorName || '________________'}`,
  ].join('\n');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildPrintHtml(text) {
  const paragraphs = text
    .split('\n')
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : '<br />'))
    .join('');

  return `<!doctype html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>Медичний висновок</title>
  <style>
    @page { margin: 14mm; }
    body {
      color: #111827;
      font-family: "Times New Roman", Times, serif;
      font-size: 12px;
      line-height: 1.35;
    }
    h1 {
      margin: 18px 0 0;
      text-align: center;
      font-size: 16px;
      letter-spacing: 0.02em;
    }
    h2 {
      margin: 4px 0 14px;
      text-align: center;
      font-size: 12px;
    }
    p { margin: 7px 0; }
    .approval {
      margin-left: auto;
      width: 290px;
      font-size: 11px;
      line-height: 1.25;
    }
    .note {
      border-top: 1px solid #d1d5db;
      margin-top: 18px;
      padding-top: 8px;
      color: #374151;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="approval">
    <p>ЗАТВЕРДЖЕНО</p>
    <p>Наказ Міністерства соціальної політики України</p>
    <p>14.07.2016 № 762</p>
  </div>
  ${paragraphs}
  <p class="note">Примітка. Висновок формується як шаблон для перевірки та редагування лікарем перед друком.</p>
  <script>
    window.addEventListener('load', () => {
      window.print();
    });
  </script>
</body>
</html>`;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function SelectField({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    >
      {children}
    </select>
  );
}

function CheckboxCard({ checked, onChange, children }) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </label>
  );
}

export default function SocialCareMedicalConclusionForm() {
  const [form, setForm] = useState(emptyForm);
  const [copied, setCopied] = useState(false);

  const conclusionText = useMemo(() => buildConclusionText(form), [form]);
  const selfCareHint = useMemo(() => getSelfCareHint(form.limitedTasks), [form.limitedTasks]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleArrayValue = (key, value) => {
    setForm((current) => {
      const list = current[key];
      return {
        ...current,
        [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
      };
    });
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(conclusionText);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(buildPrintHtml(conclusionText));
    printWindow.document.close();
  };

  return (
    <section className="space-y-4 rounded-lg border border-teal-300 bg-white p-5 shadow-sm shadow-slate-200/60">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">Шаблон</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">Медичний висновок для соціальних послуг</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Швидке заповнення висновку про здатність до самообслуговування та потребу в сторонній допомозі.
            Формується локально в браузері, без збереження даних на сервері.
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 ring-1 ring-teal-200">
          Мінсоцполітики №762
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-bold text-slate-950">1. Дані</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Заклад охорони здоров’я">
                <TextInput value={form.facility} onChange={(value) => update('facility', value)} placeholder="Назва закладу" />
              </Field>
              <Field label="ПІБ пацієнта">
                <TextInput value={form.patientName} onChange={(value) => update('patientName', value)} placeholder="Прізвище, ім’я, по батькові" />
              </Field>
              <Field label="Дата народження">
                <TextInput type="date" value={form.birthDate} onChange={(value) => update('birthDate', value)} />
              </Field>
              <Field label="Місце проживання / перебування">
                <TextInput value={form.residence} onChange={(value) => update('residence', value)} placeholder="Адреса" />
              </Field>
              <Field label="Група інвалідності">
                <TextInput value={form.disabilityGroup} onChange={(value) => update('disabilityGroup', value)} placeholder="Наприклад: II група / не встановлена" />
              </Field>
              <Field label="Дата оформлення">
                <TextInput type="date" value={form.conclusionDate} onChange={(value) => update('conclusionDate', value)} />
              </Field>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-bold text-slate-950">2. Вади, що перешкоджають самообслуговуванню</h4>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {impairmentOptions.map((option) => (
                <CheckboxCard
                  key={option}
                  checked={form.impairments.includes(option)}
                  onChange={() => toggleArrayValue('impairments', option)}
                >
                  {option}
                </CheckboxCard>
              ))}
            </div>
            <div className="mt-3">
              <Field label="Інше">
                <TextInput value={form.impairmentOther} onChange={(value) => update('impairmentOther', value)} placeholder="Додатковий опис за потреби" />
              </Field>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-bold text-slate-950">3. Самообслуговування</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Здатність до самообслуговування">
                <SelectField value={form.selfCareStatus} onChange={(value) => update('selfCareStatus', value)}>
                  <option value="здатний">здатний</option>
                  <option value="частково не здатний">частково не здатний</option>
                  <option value="не здатний">не здатний</option>
                </SelectField>
              </Field>
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-900">
                <span className="font-bold">Підказка:</span> {selfCareHint}
              </div>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {selfCareTasks.map((task) => (
                <CheckboxCard
                  key={task}
                  checked={form.limitedTasks.includes(task)}
                  onChange={() => toggleArrayValue('limitedTasks', task)}
                >
                  Обмеження: {task}
                </CheckboxCard>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-base font-bold text-slate-950">4. Висновок і підписанти</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Field label="Протипоказання до соціальних послуг">
                <SelectField value={form.contraindications} onChange={(value) => update('contraindications', value)}>
                  <option value="немає">немає</option>
                  <option value="є">є</option>
                </SelectField>
              </Field>
              <Field label="Може перебувати в колективі">
                <SelectField value={form.collectiveStay} onChange={(value) => update('collectiveStay', value)}>
                  <option value="так">так</option>
                  <option value="ні">ні</option>
                </SelectField>
              </Field>
              {form.contraindications === 'є' && (
                <div className="md:col-span-2">
                  <Field label="Які саме протипоказання">
                    <TextInput
                      value={form.contraindicationDetails}
                      onChange={(value) => update('contraindicationDetails', value)}
                      placeholder="Коротко уточніть"
                    />
                  </Field>
                </div>
              )}
              <Field label="Керівник медичного закладу">
                <TextInput value={form.chiefName} onChange={(value) => update('chiefName', value)} placeholder="Прізвище, ініціали" />
              </Field>
              <Field label="Сімейний лікар">
                <TextInput value={form.doctorName} onChange={(value) => update('doctorName', value)} placeholder="Прізвище, ініціали" />
              </Field>
            </div>
          </div>
        </div>

        <aside className="xl:sticky xl:top-4 xl:self-start">
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Попередній текст</p>
            <textarea
              value={conclusionText}
              readOnly
              rows={20}
              className="mt-3 w-full rounded-md border border-blue-100 bg-white px-3 py-2 text-sm leading-6 text-slate-800"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {copied ? 'Скопійовано' : 'Копіювати'}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-md border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
              >
                Друкувати
              </button>
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Очистити
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Підказка самообслуговування не переноситься автоматично в офіційний висновок. Лікар сам обирає фінальне формулювання.
            </p>
          </div>
        </aside>
      </div>

    </section>
  );
}
