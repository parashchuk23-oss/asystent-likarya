import { echoOptions } from '../../../data/ultrasound/echoOptions';
import { echoReferenceRanges } from '../../../data/ultrasound/echoReferenceRanges';
import { DerivedValue, EchoNumberField, EchoReadonlyField, EchoSelectField, EchoTextareaField } from './EchoFormControls';

function Grid({ children }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function update(section, data, onChange, field, value) {
  onChange(section, { ...data, [field]: value });
}

export function EchoBasicDataSection({ data, onChange, derived }) {
  return (
    <div className="space-y-4">
      <Grid>
        <EchoSelectField label="Режим" value={data.mode} onChange={(value) => onChange('basic', { ...data, mode: value })} options={echoOptions.mode} />
        <EchoSelectField label="Стать" value={data.sex} onChange={(value) => onChange('basic', { ...data, sex: value })} options={[{ value: 'male', label: 'чоловіча' }, { value: 'female', label: 'жіноча' }]} />
        <EchoNumberField label="Зріст" unit="см" value={data.height} onChange={(value) => update('basic', data, onChange, 'height', value)} />
        <EchoNumberField label="Маса" unit="кг" value={data.weight} onChange={(value) => update('basic', data, onChange, 'weight', value)} />
        <EchoReadonlyField label="BSA" value={derived.bsa} unit=" м²" />
      </Grid>
    </div>
  );
}

export function EchoFocusedSection({ data, onChange, derived }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-teal-700">Лінійні розміри ЛШ / Teichholz</p>
        <Grid>
          <EchoNumberField label="КДР / LVIDd" unit="мм" norm={echoReferenceRanges.lvidd} value={data.lvidd} onChange={(value) => update('focused', data, onChange, 'lvidd', value)} />
          <EchoNumberField label="КСР / LVIDs" unit="мм" norm={echoReferenceRanges.lvids} value={data.lvids} onChange={(value) => update('focused', data, onChange, 'lvids', value)} />
          <EchoNumberField label="МШП / IVSd" unit="мм" norm={echoReferenceRanges.ivsd} value={data.ivsd} onChange={(value) => update('focused', data, onChange, 'ivsd', value)} />
          <EchoNumberField label="ЗСЛШ / LVPWd" unit="мм" norm={echoReferenceRanges.lvpwd} value={data.lvpwd} onChange={(value) => update('focused', data, onChange, 'lvpwd', value)} />
          <EchoNumberField label="ЧСС" unit="/хв" value={data.heartRate} onChange={(value) => update('focused', data, onChange, 'heartRate', value)} step="1" />
          <EchoSelectField label="Візуальна функція ЛШ" value={data.lvFunction} onChange={(value) => update('focused', data, onChange, 'lvFunction', value)} options={echoOptions.visualFunction} />
        </Grid>
      </div>

      <Grid>
        <DerivedValue label="КДО Teichholz" value={derived.focusedLinear.teichholzEdv} unit=" мл" />
        <DerivedValue label="КСО Teichholz" value={derived.focusedLinear.teichholzEsv} unit=" мл" />
        <DerivedValue label="ФВ Teichholz" value={derived.focusedLinear.teichholzEf} unit="%" note="Допоміжний розрахунок із лінійних розмірів ЛШ." />
        <DerivedValue label="FS" value={derived.focusedLinear.fs} unit="%" note={echoReferenceRanges.fs} />
        <DerivedValue label="УО" value={derived.focusedLinear.strokeVolume} unit=" мл" />
        <DerivedValue label="ХОК" value={derived.focusedLinear.cardiacOutput} unit=" л/хв" />
        <DerivedValue label="КДІ" value={derived.focusedLinear.edvi} unit=" мл/м²" />
        <DerivedValue label="КСІ" value={derived.focusedLinear.esvi} unit=" мл/м²" />
        <DerivedValue label="Маса ЛШ" value={derived.focusedLinear.lvMass} unit=" г" />
        <DerivedValue label="LVMI" value={derived.focusedLinear.lvMassIndex} unit=" г/м²" note={echoReferenceRanges.lvmi} />
        <DerivedValue label="RWT" value={derived.focusedLinear.rwt} note={echoReferenceRanges.rwt} />
        <DerivedValue label="Геометрія" value={derived.focusedLinear.lvGeometry} />
      </Grid>

      <Grid>
        <EchoSelectField label="Дилатація ПШ" value={data.rvDilation} onChange={(value) => update('focused', data, onChange, 'rvDilation', value)} options={echoOptions.chamberSize} />
        <EchoSelectField label="Перикардіальна рідина" value={data.pericardialFluid} onChange={(value) => update('focused', data, onChange, 'pericardialFluid', value)} options={echoOptions.pericardialFluid} />
        <EchoTextareaField label="НПВ" value={data.ivcComment} onChange={(value) => update('focused', data, onChange, 'ivcComment', value)} placeholder="Наприклад: не розширена, колабує на вдиху" />
        <EchoTextareaField label="Груба клапанна патологія" value={data.valveComment} onChange={(value) => update('focused', data, onChange, 'valveComment', value)} />
        <EchoTextareaField label="Інші суттєві знахідки" value={data.otherFindings} onChange={(value) => update('focused', data, onChange, 'otherFindings', value)} />
      </Grid>
    </div>
  );
}

export function EchoViewsSection({ data, onChange }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {[
        ['plax', 'PLAX', 'Корінь аорти, ЛП, МШП, ЗСЛШ, КДР/КСР, АК, МК, ВТПШ, перикард'],
        ['psax', 'PSAX', 'Рівні АК, МК, папілярних мʼязів і верхівки, форма ЛШ, ПШ, перикард'],
        ['a4c', 'A4C', 'ЛШ, ПШ, ЛП, ПП, МК, ТК, TAPSE, скоротливість, перикард'],
        ['a2c', 'A2C', 'ЛШ, ЛП, передня/нижня стінки, обʼєми для Simpson за можливості'],
        ['a3c', 'A3C', 'ЛШ, АК, МК, ВТЛШ, локальна скоротливість'],
        ['subcostal', 'Субкостальна', 'Перикард, ПП, ПШ, МПП, НПВ'],
      ].map(([key, title, placeholder]) => (
        <EchoTextareaField
          key={key}
          label={title}
          value={data[key]}
          onChange={(value) => update('views', data, onChange, key, value)}
          placeholder={placeholder}
        />
      ))}
    </div>
  );
}

export function EchoLeftVentricleSection({ data, onChange, derived }) {
  return (
    <div className="space-y-4">
      <Grid>
        <EchoNumberField label="КДР / LVIDd" unit="мм" norm={echoReferenceRanges.lvidd} value={data.lvidd} onChange={(value) => update('leftVentricle', data, onChange, 'lvidd', value)} />
        <EchoNumberField label="КСР / LVIDs" unit="мм" norm={echoReferenceRanges.lvids} value={data.lvids} onChange={(value) => update('leftVentricle', data, onChange, 'lvids', value)} />
        <EchoNumberField label="МШП / IVSd" unit="мм" norm={echoReferenceRanges.ivsd} value={data.ivsd} onChange={(value) => update('leftVentricle', data, onChange, 'ivsd', value)} />
        <EchoNumberField label="ЗСЛШ / LVPWd" unit="мм" norm={echoReferenceRanges.lvpwd} value={data.lvpwd} onChange={(value) => update('leftVentricle', data, onChange, 'lvpwd', value)} />
        <EchoSelectField label="Візуальна ФВ" value={data.visualEf} onChange={(value) => update('leftVentricle', data, onChange, 'visualEf', value)} options={echoOptions.visualFunction} />
        <EchoNumberField label="ФВ вручну" unit="%" norm={echoReferenceRanges.manualEf} value={data.manualEf} onChange={(value) => update('leftVentricle', data, onChange, 'manualEf', value)} />
      </Grid>
      <Grid>
        <EchoNumberField label="EDV Simpson" unit="мл" norm={echoReferenceRanges.edv} value={data.edv} onChange={(value) => update('leftVentricle', data, onChange, 'edv', value)} />
        <EchoNumberField label="ESV Simpson" unit="мл" norm={echoReferenceRanges.esv} value={data.esv} onChange={(value) => update('leftVentricle', data, onChange, 'esv', value)} />
        <DerivedValue label="EF Simpson" value={derived.simpsonEf} unit="%" note={echoReferenceRanges.ef} />
        <EchoNumberField label="EDV Teichholz" unit="мл" norm={echoReferenceRanges.edv} value={data.teichholzEdv} onChange={(value) => update('leftVentricle', data, onChange, 'teichholzEdv', value)} />
        <EchoNumberField label="ESV Teichholz" unit="мл" norm={echoReferenceRanges.esv} value={data.teichholzEsv} onChange={(value) => update('leftVentricle', data, onChange, 'teichholzEsv', value)} />
        <DerivedValue label="EF Teichholz" value={derived.teichholzEf} unit="%" note="Не основний метод при зміненій геометрії або регіональних порушеннях." />
      </Grid>
      <Grid>
        <DerivedValue label="FS" value={derived.fs} unit="%" note={echoReferenceRanges.fs} />
        <DerivedValue label="Маса ЛШ" value={derived.lvMass} unit=" г" />
        <DerivedValue label="LVMI" value={derived.lvMassIndex} unit=" г/м²" note={echoReferenceRanges.lvmi} />
        <DerivedValue label="RWT" value={derived.rwt} note={echoReferenceRanges.rwt} />
        <DerivedValue label="Геометрія" value={derived.lvGeometry} />
      </Grid>
      <Grid>
        <EchoSelectField label="Регіональна скоротливість" value={data.regionalMotion} onChange={(value) => update('leftVentricle', data, onChange, 'regionalMotion', value)} options={echoOptions.wallMotion} />
        <EchoTextareaField label="Деталі сегментів" value={data.regionalDetails} onChange={(value) => update('leftVentricle', data, onChange, 'regionalDetails', value)} placeholder="Наприклад: гіпокінез нижньої стінки" />
      </Grid>
    </div>
  );
}

export function EchoDiastolicSection({ data, onChange, derived }) {
  return (
    <div className="space-y-4">
      <Grid>
        <EchoNumberField label="E" unit="см/с" norm={echoReferenceRanges.e} value={data.e} onChange={(value) => update('diastolic', data, onChange, 'e', value)} />
        <EchoNumberField label="A" unit="см/с" norm={echoReferenceRanges.a} value={data.a} onChange={(value) => update('diastolic', data, onChange, 'a', value)} />
        <DerivedValue label="E/A" value={derived.eA} note={echoReferenceRanges.ea} />
        <EchoNumberField label="DT" unit="мс" norm={echoReferenceRanges.dt} value={data.dt} onChange={(value) => update('diastolic', data, onChange, 'dt', value)} />
        <EchoNumberField label="eʼ septal" unit="см/с" norm={echoReferenceRanges.ePrimeSeptal} value={data.ePrimeSeptal} onChange={(value) => update('diastolic', data, onChange, 'ePrimeSeptal', value)} />
        <EchoNumberField label="eʼ lateral" unit="см/с" norm={echoReferenceRanges.ePrimeLateral} value={data.ePrimeLateral} onChange={(value) => update('diastolic', data, onChange, 'ePrimeLateral', value)} />
        <DerivedValue label="Середнє eʼ" value={derived.avgEPrime} unit=" см/с" />
        <DerivedValue label="E/eʼ" value={derived.eOverEPrime} note={echoReferenceRanges.eE} />
        <EchoNumberField label="TR Vmax" unit="м/с" norm={echoReferenceRanges.trVmax} value={data.trVmax} onChange={(value) => update('diastolic', data, onChange, 'trVmax', value)} />
      </Grid>
      <EchoTextareaField label="Коментар до діастолічної функції" value={data.comment} onChange={(value) => update('diastolic', data, onChange, 'comment', value)} placeholder="Якщо даних недостатньо: недостатньо даних для класифікації діастолічної функції" />
    </div>
  );
}

export function EchoRightVentricleSection({ data, onChange }) {
  return (
    <Grid>
      <EchoNumberField label="Базальний діаметр ПШ" unit="мм" norm={echoReferenceRanges.rvBasal} value={data.basalDiameter} onChange={(value) => update('rightVentricle', data, onChange, 'basalDiameter', value)} />
      <EchoNumberField label="TAPSE" unit="мм" norm={echoReferenceRanges.tapse} value={data.tapse} onChange={(value) => update('rightVentricle', data, onChange, 'tapse', value)} />
      <EchoNumberField label="FAC" unit="%" norm={echoReferenceRanges.fac} value={data.fac} onChange={(value) => update('rightVentricle', data, onChange, 'fac', value)} />
      <EchoNumberField label="TDI Sʼ" unit="см/с" norm={echoReferenceRanges.sPrime} value={data.sPrime} onChange={(value) => update('rightVentricle', data, onChange, 'sPrime', value)} />
      <EchoSelectField label="Візуальна функція ПШ" value={data.visualFunction} onChange={(value) => update('rightVentricle', data, onChange, 'visualFunction', value)} options={echoOptions.visualFunction} />
      <EchoTextareaField label="Коментар" value={data.comment} onChange={(value) => update('rightVentricle', data, onChange, 'comment', value)} />
    </Grid>
  );
}

export function EchoAtriaAortaSection({ data, onChange, derived }) {
  return (
    <div className="space-y-4">
      <Grid>
        <EchoNumberField label="ЛП передньо-задній розмір" unit="мм" norm={echoReferenceRanges.laAp} value={data.leftAtrium.apSize} onChange={(value) => onChange('leftAtrium', { ...data.leftAtrium, apSize: value })} />
        <EchoNumberField label="ЛП обʼєм" unit="мл" norm={echoReferenceRanges.laVolume} value={data.leftAtrium.volume} onChange={(value) => onChange('leftAtrium', { ...data.leftAtrium, volume: value })} />
        <DerivedValue label="LAVI" value={derived.lavi} unit=" мл/м²" note={echoReferenceRanges.lavi} />
        <EchoNumberField label="ПП площа" unit="см²" norm={echoReferenceRanges.raArea} value={data.rightAtrium.area} onChange={(value) => onChange('rightAtrium', { ...data.rightAtrium, area: value })} />
        <EchoSelectField label="ПП візуально" value={data.rightAtrium.visualDilation} onChange={(value) => onChange('rightAtrium', { ...data.rightAtrium, visualDilation: value })} options={echoOptions.chamberSize} />
      </Grid>
      <Grid>
        <EchoNumberField label="Кільце АК" unit="мм" norm={echoReferenceRanges.aorticAnnulus} value={data.aorta.annulus} onChange={(value) => onChange('aorta', { ...data.aorta, annulus: value })} />
        <EchoNumberField label="Синуси Вальсальви" unit="мм" norm={echoReferenceRanges.aorticSinuses} value={data.aorta.sinuses} onChange={(value) => onChange('aorta', { ...data.aorta, sinuses: value })} />
        <EchoNumberField label="Синотубулярне зʼєднання" unit="мм" norm={echoReferenceRanges.aorticStj} value={data.aorta.stj} onChange={(value) => onChange('aorta', { ...data.aorta, stj: value })} />
        <EchoNumberField label="Висхідна аорта" unit="мм" norm={echoReferenceRanges.ascendingAorta} value={data.aorta.ascending} onChange={(value) => onChange('aorta', { ...data.aorta, ascending: value })} />
      </Grid>
    </div>
  );
}

export function EchoValvesSection({ data, onChange, derived }) {
  return (
    <div className="space-y-5">
      <Grid>
        <EchoSelectField label="АК тип" value={data.aorticValve.type} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, type: value })} options={echoOptions.aorticValveType} />
        <EchoSelectField label="АК морфологія" value={data.aorticValve.morphology} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, morphology: value })} options={echoOptions.valveMorphology} />
        <EchoSelectField label="Аортальна регургітація" value={data.aorticValve.regurgitation} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, regurgitation: value })} options={echoOptions.regurgitation} />
        <EchoNumberField label="AV Vmax" unit="м/с" norm={echoReferenceRanges.avVmax} value={data.aorticValve.vmax} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, vmax: value })} />
        <DerivedValue label="Піковий градієнт АК" value={derived.avPeakGradient} unit=" мм рт. ст." note={echoReferenceRanges.avGradient} />
        <EchoNumberField label="LVOT diameter" unit="мм" norm={echoReferenceRanges.lvotDiameter} value={data.aorticValve.lvotDiameter} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, lvotDiameter: value })} />
        <EchoNumberField label="LVOT VTI" unit="см" norm={echoReferenceRanges.lvotVti} value={data.aorticValve.lvotVti} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, lvotVti: value })} />
        <EchoNumberField label="AV VTI" unit="см" norm={echoReferenceRanges.avVti} value={data.aorticValve.avVti} onChange={(value) => onChange('aorticValve', { ...data.aorticValve, avVti: value })} />
        <DerivedValue label="AVA" value={derived.ava} unit=" см²" note={`Рахується за LVOT diameter, LVOT VTI та AV VTI. ${echoReferenceRanges.ava}`} />
      </Grid>
      <Grid>
        <EchoSelectField label="МК морфологія" value={data.mitralValve.morphology} onChange={(value) => onChange('mitralValve', { ...data.mitralValve, morphology: value })} options={echoOptions.valveMorphology} />
        <EchoSelectField label="Мітральна регургітація" value={data.mitralValve.regurgitation} onChange={(value) => onChange('mitralValve', { ...data.mitralValve, regurgitation: value })} options={echoOptions.regurgitation} />
        <EchoSelectField label="Трикуспідальна регургітація" value={data.tricuspidValve.regurgitation} onChange={(value) => onChange('tricuspidValve', { ...data.tricuspidValve, regurgitation: value })} options={echoOptions.regurgitation} />
        <EchoNumberField label="TR Vmax" unit="м/с" norm={echoReferenceRanges.trVmax} value={data.tricuspidValve.trVmax} onChange={(value) => onChange('tricuspidValve', { ...data.tricuspidValve, trVmax: value })} />
        <DerivedValue label="TR gradient" value={derived.trGradient} unit=" мм рт. ст." />
        <DerivedValue label="RVSP/PASP" value={derived.rvsp} unit=" мм рт. ст." note="Потрібні TR Vmax і підтверджений RAP." />
        <EchoSelectField label="Регургітація на клапані ЛА" value={data.pulmonaryValve.regurgitation} onChange={(value) => onChange('pulmonaryValve', { ...data.pulmonaryValve, regurgitation: value })} options={echoOptions.regurgitation} />
      </Grid>
    </div>
  );
}

export function EchoPericardiumIvcSection({ data, onChange, derived }) {
  return (
    <Grid>
      <EchoSelectField label="Перикардіальна рідина" value={data.pericardium.fluid} onChange={(value) => onChange('pericardium', { ...data.pericardium, fluid: value })} options={echoOptions.pericardialFluid} />
      <EchoNumberField label="Сепарація листків" unit="мм" norm={echoReferenceRanges.pericardialSeparation} value={data.pericardium.separation} onChange={(value) => onChange('pericardium', { ...data.pericardium, separation: value })} />
      <EchoTextareaField label="Ознаки гемодинамічної значущості" value={data.pericardium.tamponadeSigns} onChange={(value) => onChange('pericardium', { ...data.pericardium, tamponadeSigns: value })} placeholder="Колапс ПП/ПШ, дилатація НПВ, респіраторні зміни потоків" />
      <EchoNumberField label="НПВ на видиху" unit="мм" norm={echoReferenceRanges.ivcMax} value={data.ivc.maxDiameter} onChange={(value) => onChange('ivc', { ...data.ivc, maxDiameter: value })} />
      <EchoNumberField label="НПВ на вдиху" unit="мм" norm={echoReferenceRanges.ivcMin} value={data.ivc.minDiameter} onChange={(value) => onChange('ivc', { ...data.ivc, minDiameter: value })} />
      <DerivedValue label="Колапс НПВ" value={derived.ivcCollapse} unit="%" note={echoReferenceRanges.ivc} />
      <EchoNumberField label="RAP, підтверджений лікарем" unit="мм рт. ст." norm={echoReferenceRanges.rap} value={data.ivc.rap} onChange={(value) => onChange('ivc', { ...data.ivc, rap: value })} />
    </Grid>
  );
}
