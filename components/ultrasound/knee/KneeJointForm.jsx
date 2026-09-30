'use client';

import { NumberField, SelectField, TextareaField, TextField } from '../abdomen/AbdomenFormControls';
import { kneeSelectOptions } from '../../../data/ultrasound/kneeProtocol';

function Grid({ children }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function Details({ value, onChange, placeholder = 'Уточнення (необов’язково)' }) {
  return <TextField label="Додатковий опис" value={value} onChange={onChange} placeholder={placeholder} />;
}

function TendonFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  const altered = value.status !== 'normal' || value.enthesis !== 'normal';
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <Grid>
        <SelectField label="Сухожилок" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.tendon} />
        <SelectField label="Зона ентезу" value={value.enthesis} onChange={(next) => update('enthesis', next)} options={kneeSelectOptions.enthesis} />
        {altered ? <NumberField label="Товщина" value={value.thickness} onChange={(next) => update('thickness', next)} /> : null}
        {altered ? <SelectField label="Power Doppler" value={value.pd} onChange={(next) => update('pd', next)} options={kneeSelectOptions.pd} /> : null}
      </Grid>
      {altered ? <Details value={value.details} onChange={(next) => update('details', next)} /> : null}
    </div>
  );
}

function LigamentFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <SelectField label="Стан" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.ligament} />
      {value.status !== 'normal' ? <Details value={value.details} onChange={(next) => update('details', next)} /> : null}
    </div>
  );
}

function BursaFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <Grid>
        <SelectField label="Стан" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.simpleStatus} />
        {value.status !== 'normal' ? <NumberField label="Передньозадній розмір" value={value.depth} onChange={(next) => update('depth', next)} /> : null}
      </Grid>
      {value.status !== 'normal' ? <Details value={value.details} onChange={(next) => update('details', next)} placeholder="Вміст, синовія, васкуляризація" /> : null}
    </div>
  );
}

function MeniscusFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <Grid>
        <SelectField label="Доступні периферичні відділи" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.meniscus} />
        {value.status === 'extrusion' ? <NumberField label="Екструзія" value={value.extrusionMm} onChange={(next) => update('extrusionMm', next)} /> : null}
      </Grid>
      {value.status !== 'normal' ? <Details value={value.details} onChange={(next) => update('details', next)} /> : null}
      <p className="mt-1 text-xs leading-5 text-slate-500">УЗД оцінює переважно доступні периферичні відділи меніска; за підозри на розрив може знадобитися МРТ.</p>
    </div>
  );
}

function CruciateFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <Grid>
        <SelectField label="Візуалізація" value={value.visualization} onChange={(next) => update('visualization', next)} options={kneeSelectOptions.cruciateVisualization} />
        {value.visualization !== 'notVisualized' ? <SelectField label="Стан доступних відділів" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.cruciateStatus} /> : null}
      </Grid>
      {(value.status !== 'noVisibleChanges' || value.visualization === 'notVisualized') ? <Details value={value.details} onChange={(next) => update('details', next)} /> : null}
      <p className="mt-1 text-xs leading-5 text-slate-500">УЗ-оцінка хрестоподібних зв’язок має технічні обмеження і не замінює МРТ.</p>
    </div>
  );
}

function BoneContourFields({ title, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <h5 className="mb-3 text-sm font-bold text-slate-900">{title}</h5>
      <SelectField label="Контур" value={value.status} onChange={(next) => update('status', next)} options={kneeSelectOptions.boneContour} />
      {value.status !== 'normal' ? <Details value={value.details} onChange={(next) => update('details', next)} placeholder="Локалізація та вираженість" /> : null}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-teal-800">{title}</h4>
      {children}
    </section>
  );
}

export default function KneeJointForm({ sideLabel, value, onChange }) {
  const update = (field, next) => onChange({ ...value, [field]: next });
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-slate-700">{sideLabel}</p>
      <Section title="Передній доступ">
        <TendonFields title="Сухожилок чотириголового м’яза стегна" value={value.quadriceps} onChange={(next) => update('quadriceps', next)} />
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h5 className="mb-3 text-sm font-bold text-slate-900">Верхній заворот і синовія</h5>
          <Grid>
            <SelectField label="Випіт" value={value.suprapatellar.effusion} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, effusion: next })} options={kneeSelectOptions.nonePresent} />
            {value.suprapatellar.effusion === 'present' ? <NumberField label="ПЗР випоту" value={value.suprapatellar.depth} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, depth: next })} /> : null}
            <SelectField label="Синовіальна оболонка" value={value.suprapatellar.synovium} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, synovium: next })} options={kneeSelectOptions.synovium} />
            {value.suprapatellar.synovium !== 'normal' ? <NumberField label="Товщина синовії" value={value.suprapatellar.synoviumThickness} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, synoviumThickness: next })} /> : null}
            {value.suprapatellar.synovium !== 'normal' ? <SelectField label="Power Doppler" value={value.suprapatellar.pd} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, pd: next })} options={kneeSelectOptions.pd} /> : null}
          </Grid>
          {(value.suprapatellar.effusion === 'present' || value.suprapatellar.synovium !== 'normal') ? <Details value={value.suprapatellar.details} onChange={(next) => update('suprapatellar', { ...value.suprapatellar, details: next })} placeholder="Характер рідини, вільні тіла, інші зміни" /> : null}
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h5 className="mb-3 text-sm font-bold text-slate-900">Надколінок</h5>
          <SelectField label="Контури" value={value.patellaContour.status} onChange={(next) => update('patellaContour', { ...value.patellaContour, status: next })} options={kneeSelectOptions.simpleStatus} />
          {value.patellaContour.status !== 'normal' ? <Details value={value.patellaContour.details} onChange={(next) => update('patellaContour', { ...value.patellaContour, details: next })} placeholder="Остеофіти, ерозії, нерівність" /> : null}
        </div>
        <TendonFields title="Сухожилок надколінка" value={value.patellarTendon} onChange={(next) => update('patellarTendon', next)} />
        <Grid>
          <BursaFields title="Препателярна бурса" value={value.prepatellarBursa} onChange={(next) => update('prepatellarBursa', next)} />
          <BursaFields title="Поверхнева інфрапателярна бурса" value={value.superficialInfrapatellarBursa} onChange={(next) => update('superficialInfrapatellarBursa', next)} />
          <BursaFields title="Глибока інфрапателярна бурса" value={value.deepInfrapatellarBursa} onChange={(next) => update('deepInfrapatellarBursa', next)} />
          <div className="rounded-md border border-slate-200 bg-white p-3">
            <h5 className="mb-3 text-sm font-bold text-slate-900">Жирове тіло Гоффа</h5>
            <SelectField label="Стан" value={value.hoffa.status} onChange={(next) => update('hoffa', { ...value.hoffa, status: next })} options={kneeSelectOptions.simpleStatus} />
            {value.hoffa.status !== 'normal' ? <Details value={value.hoffa.details} onChange={(next) => update('hoffa', { ...value.hoffa, details: next })} /> : null}
          </div>
        </Grid>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h5 className="mb-3 text-sm font-bold text-slate-900">Гіаліновий хрящ</h5>
          <Grid>
            <SelectField label="Стан" value={value.cartilage.status} onChange={(next) => update('cartilage', { ...value.cartilage, status: next })} options={kneeSelectOptions.cartilage} />
            {value.cartilage.status !== 'normal' ? <NumberField label="Товщина" value={value.cartilage.thickness} onChange={(next) => update('cartilage', { ...value.cartilage, thickness: next })} /> : null}
            {value.cartilage.status !== 'normal' ? <TextField label="Локалізація" value={value.cartilage.location} onChange={(next) => update('cartilage', { ...value.cartilage, location: next })} /> : null}
          </Grid>
          {value.cartilage.status !== 'normal' ? <Details value={value.cartilage.details} onChange={(next) => update('cartilage', { ...value.cartilage, details: next })} /> : null}
        </div>
        <Grid>
          <LigamentFields title="Медіальна пателофеморальна зв’язка" value={value.mpfl} onChange={(next) => update('mpfl', next)} />
          <LigamentFields title="Латеральний ретинакулюм" value={value.lateralRetinaculum} onChange={(next) => update('lateralRetinaculum', next)} />
        </Grid>
      </Section>

      <Section title="Медіальний і латеральний доступи">
        <Grid>
          <BoneContourFields title="Медіальні кісткові контури" value={value.medialBoneContour} onChange={(next) => update('medialBoneContour', next)} />
          <BoneContourFields title="Латеральні кісткові контури" value={value.lateralBoneContour} onChange={(next) => update('lateralBoneContour', next)} />
          <LigamentFields title="Медіальна колатеральна зв’язка" value={value.mcl} onChange={(next) => update('mcl', next)} />
          <LigamentFields title="Латеральна колатеральна зв’язка" value={value.lcl} onChange={(next) => update('lcl', next)} />
        </Grid>
        <MeniscusFields title="Медіальний меніск" value={value.medialMeniscus} onChange={(next) => update('medialMeniscus', next)} />
        <MeniscusFields title="Латеральний меніск" value={value.lateralMeniscus} onChange={(next) => update('lateralMeniscus', next)} />
        <Grid>
          <TendonFields title="Сухожилок підколінного м’яза" value={value.popliteus} onChange={(next) => update('popliteus', next)} />
          <TendonFields title="Сухожилок двоголового м’яза стегна" value={value.bicepsFemoris} onChange={(next) => update('bicepsFemoris', next)} />
        </Grid>
        <BursaFields title="Бурса «гусячої лапки»" value={value.pesAnserine} onChange={(next) => update('pesAnserine', next)} />
      </Section>

      <Section title="Задній і центральний доступи">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <h5 className="mb-3 text-sm font-bold text-slate-900">Кіста Бейкера</h5>
          <Grid>
            <SelectField label="Стан" value={value.baker.status} onChange={(next) => update('baker', { ...value.baker, status: next })} options={kneeSelectOptions.baker} />
            {value.baker.status !== 'absent' ? <NumberField label="Довжина" value={value.baker.length} onChange={(next) => update('baker', { ...value.baker, length: next })} /> : null}
            {value.baker.status !== 'absent' ? <NumberField label="Ширина" value={value.baker.width} onChange={(next) => update('baker', { ...value.baker, width: next })} /> : null}
            {value.baker.status !== 'absent' ? <NumberField label="ПЗР" value={value.baker.depth} onChange={(next) => update('baker', { ...value.baker, depth: next })} /> : null}
          </Grid>
          {value.baker.status !== 'absent' ? <Details value={value.baker.details} onChange={(next) => update('baker', { ...value.baker, details: next })} placeholder="Перетинки, синовія, кровоплин, сполучення із суглобом" /> : null}
        </div>
        <Grid>
          <CruciateFields title="Передня хрестоподібна зв’язка" value={value.acl} onChange={(next) => update('acl', next)} />
          <CruciateFields title="Задня хрестоподібна зв’язка" value={value.pcl} onChange={(next) => update('pcl', next)} />
        </Grid>
        <TextareaField label="Додаткові знахідки" value={value.additional} onChange={(next) => update('additional', next)} placeholder="За потреби додайте інші дані дослідження" />
      </Section>
    </div>
  );
}
