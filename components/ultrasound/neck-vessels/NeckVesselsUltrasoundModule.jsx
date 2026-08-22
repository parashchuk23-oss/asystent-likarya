'use client';

import { useEffect, useMemo, useState } from 'react';
import AccordionSection from '../../AccordionSection';
import { inputClass, textareaClass } from '../../formStyles';
import { buildNeckVesselsReport, calculateNascetStenosis } from '../../../utils/ultrasound/neck-vessels/neckVesselsReportGenerator';
import NeckVesselsReportPreview from './NeckVesselsReportPreview';

const options = {
  indication: [
    { value: 'screening', label: 'профілактичний огляд' },
    { value: 'dizziness', label: 'запаморочення' },
    { value: 'headache', label: 'головний біль' },
    { value: 'bruit', label: 'судинний шум' },
    { value: 'tiaStroke', label: 'після ТІА / інсульту' },
    { value: 'followUp', label: 'контроль у динаміці' },
  ],
  visualization: [
    { value: 'good', label: 'достатня' },
    { value: 'limited', label: 'частково обмежена' },
    { value: 'difficult', label: 'утруднена' },
  ],
  course: [
    { value: 'straight', label: 'прямолінійний' },
    { value: 'tortuous', label: 'звивистий' },
    { value: 'kink', label: 'kink-деформація' },
    { value: 'coil', label: 'coil-деформація' },
  ],
  intima: [
    { value: 'clear', label: 'чітко диференціюється' },
    { value: 'thickened', label: 'КІМ потовщений' },
    { value: 'irregular', label: 'нерівномірно потовщена' },
  ],
  bifurcation: [
    { value: 'normal', label: 'без локального потовщення' },
    { value: 'thickened', label: 'локально потовщена' },
    { value: 'plaque', label: 'атеросклеротична бляшка' },
  ],
  flow: [
    { value: 'normal', label: 'збережений' },
    { value: 'disturbed', label: 'прискорення / турбулентність' },
    { value: 'reduced', label: 'знижений' },
  ],
  vertebralDirection: [
    { value: 'antegrade', label: 'антеградний' },
    { value: 'bidirectional', label: 'двонаправлений' },
    { value: 'retrograde', label: 'ретроградний' },
    { value: 'notVisualized', label: 'не візуалізується' },
  ],
  veinState: [
    { value: 'normal', label: 'не розширені' },
    { value: 'dilated', label: 'розширені' },
    { value: 'thrombosis', label: 'ознаки тромбозу' },
  ],
  veinPatency: [
    { value: 'patent', label: 'прохідні' },
    { value: 'partial', label: 'частково прохідні' },
    { value: 'occluded', label: 'непрохідні' },
  ],
  veinCompression: [
    { value: 'full', label: 'стискаються повністю' },
    { value: 'partial', label: 'стискаються частково' },
    { value: 'absent', label: 'не стискаються' },
  ],
  plaqueSide: [
    { value: 'праворуч', label: 'праворуч' },
    { value: 'ліворуч', label: 'ліворуч' },
  ],
  plaqueLocation: [
    { value: 'ЗСА', label: 'ЗСА' },
    { value: 'біфуркація', label: 'біфуркація' },
    { value: 'ВСА', label: 'ВСА' },
    { value: 'ЗовСА', label: 'ЗовСА' },
  ],
  plaqueStructure: [
    { value: 'homogeneous', label: 'гомогенна' },
    { value: 'heterogeneous', label: 'гетерогенна' },
    { value: 'calcified', label: 'кальцинована' },
    { value: 'soft', label: 'м’яка / гіпоехогенна' },
  ],
  plaqueSurface: [
    { value: 'smooth', label: 'рівна' },
    { value: 'irregular', label: 'нерівна' },
    { value: 'ulcerated', label: 'виразкування' },
  ],
};

function createCarotidSide(imt = '0.7') {
  return {
    course: 'straight',
    intima: 'clear',
    imt,
    bifurcation: 'normal',
    ccaFlow: 'normal',
    ccaPsv: '',
    ccaEdv: '',
    icaFlow: 'normal',
    icaPsv: '',
    icaEdv: '',
    icaMinimalLumen: '',
    icaDistalLumen: '',
    ecaFlow: 'normal',
    ecaPsv: '',
    notes: '',
  };
}

function createVertebralSide() {
  return {
    diameter: '3.5',
    direction: 'antegrade',
    psv: '',
    notes: '',
  };
}

function createInitialData() {
  return {
    general: {
      indication: 'screening',
      visualization: 'good',
      notes: '',
    },
    rightCarotid: createCarotidSide('0.7'),
    leftCarotid: createCarotidSide('0.7'),
    plaques: [],
    rightVertebral: createVertebralSide(),
    leftVertebral: createVertebralSide(),
    jugularVeins: {
      rightDiameter: '',
      leftDiameter: '',
      state: 'normal',
      patency: 'patent',
      compression: 'full',
      notes: '',
    },
  };
}

function createPlaque() {
  return {
    id: crypto.randomUUID(),
    side: 'праворуч',
    location: 'біфуркація',
    size: '',
    structure: 'heterogeneous',
    surface: 'smooth',
    minimalLumen: '',
    distalLumen: '',
  };
}

function SelectField({ label, value, onChange, items }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder = '', hint = '' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

function CarotidForm({ title, data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const icaStenosis = calculateNascetStenosis(data.icaMinimalLumen, data.icaDistalLumen);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <SelectField label="Хід судини" value={data.course} onChange={(value) => update('course', value)} items={options.course} />
        <SelectField label="Інтима / КІМ" value={data.intima} onChange={(value) => update('intima', value)} items={options.intima} />
        <TextField label="КІМ, мм" value={data.imt} onChange={(value) => update('imt', value)} hint="Орієнтир: до 0,9 мм" />
      </div>
      <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-slate-700">
        <span className="font-semibold text-slate-900">Деформації:</span> звивистість — плавні вигини без гострого кута; kink — кутовий перегин судини; coil — петлеподібний хід. Гемодинамічне значення оцінюється за кровотоком і клінічним контекстом.
      </div>
      <SelectField label="Біфуркація" value={data.bifurcation} onChange={(value) => update('bifurcation', value)} items={options.bifurcation} />

      <div className="grid gap-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-3 text-sm font-bold text-slate-950">{title}: загальна сонна артерія</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField label="Кровотік" value={data.ccaFlow} onChange={(value) => update('ccaFlow', value)} items={options.flow} />
            <TextField label="PSV, см/с" value={data.ccaPsv} onChange={(value) => update('ccaPsv', value)} />
            <TextField label="EDV, см/с" value={data.ccaEdv} onChange={(value) => update('ccaEdv', value)} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-3 text-sm font-bold text-slate-950">{title}: внутрішня сонна артерія</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            <SelectField label="Кровотік" value={data.icaFlow} onChange={(value) => update('icaFlow', value)} items={options.flow} />
            <TextField label="PSV, см/с" value={data.icaPsv} onChange={(value) => update('icaPsv', value)} />
            <TextField label="EDV, см/с" value={data.icaEdv} onChange={(value) => update('icaEdv', value)} />
            <TextField label="Мінімальний просвіт, мм" value={data.icaMinimalLumen} onChange={(value) => update('icaMinimalLumen', value)} />
            <TextField label="Дистальний нормальний просвіт, мм" value={data.icaDistalLumen} onChange={(value) => update('icaDistalLumen', value)} />
            <div className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2">
              <span className="block text-xs font-bold uppercase tracking-[0.14em] text-teal-700">NASCET</span>
              <span className="mt-1 block text-sm font-bold text-slate-950">
                {icaStenosis === null ? 'введіть 2 діаметри' : `${icaStenosis}%`}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            NASCET: (1 - мінімальний просвіт у стенозі / нормальний дистальний просвіт ВСА) x 100%.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-3 text-sm font-bold text-slate-950">{title}: зовнішня сонна артерія</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="Кровотік" value={data.ecaFlow} onChange={(value) => update('ecaFlow', value)} items={options.flow} />
            <TextField label="PSV, см/с" value={data.ecaPsv} onChange={(value) => update('ecaPsv', value)} />
          </div>
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-slate-700">Додатково вручну</span>
        <textarea value={data.notes} onChange={(event) => update('notes', event.target.value)} rows={3} className={textareaClass} />
      </label>
    </div>
  );
}

function PlaquesForm({ plaques, onChange }) {
  const addPlaque = () => onChange([...plaques, createPlaque()]);
  const updatePlaque = (id, field, value) => {
    onChange(plaques.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const removePlaque = (id) => onChange(plaques.filter((item) => item.id !== id));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-950">Атеросклеротичні бляшки</h4>
          <p className="text-xs text-slate-500">Якщо бляшок немає, нічого додавати не потрібно.</p>
        </div>
        <button type="button" onClick={addPlaque} className="rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white">
          Додати бляшку
        </button>
      </div>

      {plaques.length ? (
        plaques.map((plaque, index) => (
          <div key={plaque.id} className="rounded-lg border border-teal-200 bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <h5 className="text-sm font-bold text-slate-900">Бляшка {index + 1}</h5>
              <button type="button" onClick={() => removePlaque(plaque.id)} className="text-xs font-semibold text-red-600">
                Видалити
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <SelectField label="Сторона" value={plaque.side} onChange={(value) => updatePlaque(plaque.id, 'side', value)} items={options.plaqueSide} />
              <SelectField label="Локалізація" value={plaque.location} onChange={(value) => updatePlaque(plaque.id, 'location', value)} items={options.plaqueLocation} />
              <TextField label="Розмір, мм" value={plaque.size} onChange={(value) => updatePlaque(plaque.id, 'size', value)} />
              <SelectField label="Структура" value={plaque.structure} onChange={(value) => updatePlaque(plaque.id, 'structure', value)} items={options.plaqueStructure} />
              <SelectField label="Поверхня" value={plaque.surface} onChange={(value) => updatePlaque(plaque.id, 'surface', value)} items={options.plaqueSurface} />
              <TextField label="Мінімальний просвіт, мм" value={plaque.minimalLumen} onChange={(value) => updatePlaque(plaque.id, 'minimalLumen', value)} />
              <TextField label="Дистальний нормальний просвіт, мм" value={plaque.distalLumen} onChange={(value) => updatePlaque(plaque.id, 'distalLumen', value)} />
              <div className="rounded-md border border-teal-200 bg-teal-50 px-3 py-2">
                <span className="block text-xs font-bold uppercase tracking-[0.14em] text-teal-700">NASCET</span>
                <span className="mt-1 block text-sm font-bold text-slate-950">
                  {calculateNascetStenosis(plaque.minimalLumen, plaque.distalLumen) === null
                    ? 'введіть 2 діаметри'
                    : `${calculateNascetStenosis(plaque.minimalLumen, plaque.distalLumen)}%`}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Бляшки не додані. У протоколі буде сформовано: «Атеросклеротичні бляшки не виявлені».
        </div>
      )}
    </div>
  );
}

function VertebralForm({ right, left, onRightChange, onLeftChange }) {
  const updateRight = (field, value) => onRightChange({ ...right, [field]: value });
  const updateLeft = (field, value) => onLeftChange({ ...left, [field]: value });

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {[
        ['Права хребтова артерія', right, updateRight],
        ['Ліва хребтова артерія', left, updateLeft],
      ].map(([title, data, update]) => (
        <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-3 text-sm font-bold text-slate-950">{title}</h4>
          <div className="grid gap-3">
            <TextField label="Діаметр, мм" value={data.diameter} onChange={(value) => update('diameter', value)} hint="Орієнтир: приблизно 3-4 мм; асиметрію оцінює лікар" />
            <SelectField label="Напрямок кровотоку" value={data.direction} onChange={(value) => update('direction', value)} items={options.vertebralDirection} />
            <TextField label="PSV, см/с" value={data.psv} onChange={(value) => update('psv', value)} />
            <TextField label="Додатково" value={data.notes} onChange={(value) => update('notes', value)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NeckVesselsUltrasoundModule() {
  const [data, setData] = useState(createInitialData);
  const [openSection, setOpenSection] = useState('general');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const generatedReport = useMemo(() => buildNeckVesselsReport(data), [data]);
  const [report, setReport] = useState(generatedReport);

  useEffect(() => {
    if (autoUpdate) setReport(generatedReport);
  }, [autoUpdate, generatedReport]);

  const updateData = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const toggleSection = (sectionId) => setOpenSection((current) => (current === sectionId ? null : sectionId));
  const regenerate = () => setReport(generatedReport);
  const fillNormal = () => {
    const nextData = createInitialData();
    setData(nextData);
    setReport(buildNeckVesselsReport(nextData));
    setAutoUpdate(true);
  };
  const clear = () => {
    fillNormal();
    setOpenSection('general');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Протокол УЗД судин шиї</h3>
              <p className="mt-1 text-sm text-slate-600">
                Конструктор опису сонних артерій, хребтових артерій, яремних вен, бляшок і стенозів.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={fillNormal} className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                Заповнити як норму
              </button>
              <button type="button" onClick={regenerate} className="rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white">
                Сформувати протокол
              </button>
            </div>
          </div>
        </div>

        <AccordionSection id="neck-general" title="1. Загальні дані" subtitle="Причина дослідження, якість візуалізації" isOpen={openSection === 'general'} onToggle={() => toggleSection('general')}>
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField label="Показання / причина" value={data.general.indication} onChange={(value) => updateData('general', { ...data.general, indication: value })} items={options.indication} />
            <SelectField label="Якість візуалізації" value={data.general.visualization} onChange={(value) => updateData('general', { ...data.general, visualization: value })} items={options.visualization} />
          </div>
          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Додатково</span>
            <textarea value={data.general.notes} onChange={(event) => updateData('general', { ...data.general, notes: event.target.value })} rows={3} className={textareaClass} />
          </label>
        </AccordionSection>

        <AccordionSection id="neck-right-carotid" title="2. Праві сонні артерії" subtitle="Загальна, внутрішня і зовнішня сонна артерія, КІМ, біфуркація, швидкості" isOpen={openSection === 'rightCarotid'} onToggle={() => toggleSection('rightCarotid')}>
          <CarotidForm title="Права" data={data.rightCarotid} onChange={(value) => updateData('rightCarotid', value)} />
        </AccordionSection>

        <AccordionSection id="neck-left-carotid" title="3. Ліві сонні артерії" subtitle="Загальна, внутрішня і зовнішня сонна артерія, КІМ, біфуркація, швидкості" isOpen={openSection === 'leftCarotid'} onToggle={() => toggleSection('leftCarotid')}>
          <CarotidForm title="Ліва" data={data.leftCarotid} onChange={(value) => updateData('leftCarotid', value)} />
        </AccordionSection>

        <AccordionSection id="neck-plaques" title="4. Бляшки та стеноз" subtitle="Додати тільки якщо є атеросклеротична бляшка" isOpen={openSection === 'plaques'} onToggle={() => toggleSection('plaques')}>
          <PlaquesForm plaques={data.plaques} onChange={(value) => updateData('plaques', value)} />
        </AccordionSection>

        <AccordionSection id="neck-vertebral" title="5. Хребтові артерії" subtitle="Діаметр, напрямок кровотоку, швидкість" isOpen={openSection === 'vertebral'} onToggle={() => toggleSection('vertebral')}>
          <VertebralForm
            right={data.rightVertebral}
            left={data.leftVertebral}
            onRightChange={(value) => updateData('rightVertebral', value)}
            onLeftChange={(value) => updateData('leftVertebral', value)}
          />
        </AccordionSection>

        <AccordionSection id="neck-jugular" title="6. Внутрішні яремні вени" subtitle="Прохідність, компресія, тромбоз" isOpen={openSection === 'jugular'} onToggle={() => toggleSection('jugular')}>
          <div className="grid gap-3 md:grid-cols-3">
            <TextField label="Праворуч, мм" value={data.jugularVeins.rightDiameter} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, rightDiameter: value })} />
            <TextField label="Ліворуч, мм" value={data.jugularVeins.leftDiameter} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, leftDiameter: value })} />
            <SelectField label="Стан" value={data.jugularVeins.state} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, state: value })} items={options.veinState} />
            <SelectField label="Прохідність" value={data.jugularVeins.patency} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, patency: value })} items={options.veinPatency} />
            <SelectField label="Компресія" value={data.jugularVeins.compression} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, compression: value })} items={options.veinCompression} />
            <TextField label="Додатково" value={data.jugularVeins.notes} onChange={(value) => updateData('jugularVeins', { ...data.jugularVeins, notes: value })} />
          </div>
        </AccordionSection>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
          Модуль формує чернетку протоколу. Відсоток стенозу, гемодинамічну значущість і фінальний висновок перевіряє лікар УЗД.
        </div>
      </div>

      <NeckVesselsReportPreview
        overview={report.overview}
        conclusion={report.conclusion}
        recommendations={report.recommendations}
        onOverviewChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, overview: value }));
        }}
        onConclusionChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, conclusion: value }));
        }}
        onRecommendationsChange={(value) => {
          setAutoUpdate(false);
          setReport((current) => ({ ...current, recommendations: value }));
        }}
        autoUpdate={autoUpdate}
        onAutoUpdateChange={setAutoUpdate}
        onRegenerate={regenerate}
        onClear={clear}
      />
    </div>
  );
}
