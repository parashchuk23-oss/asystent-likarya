import { PresetField } from './StatusPresetFields';

const lungAuscultationOptions = [
  'Дихання везикулярне, проводиться з обох боків. Хрипи не вислуховуються.',
  'Дихання жорстке, проводиться з обох боків. Хрипи не вислуховуються.',
  'Дихання ослаблене з обох боків. Хрипи не вислуховуються.',
  'Дихання ослаблене справа. Хрипи не вислуховуються.',
  'Дихання ослаблене зліва. Хрипи не вислуховуються.',
  'Дихання везикулярне. Сухі хрипи вислуховуються.',
  'Дихання везикулярне. Вологі хрипи вислуховуються.',
  'Дихання ослаблене в нижніх відділах. Вологі хрипи вислуховуються.',
];

export default function RespiratoryStatusForm({ formData, onChange }) {
  return (
    <PresetField
      label="Аускультація легень"
      hint="дихання, хрипи"
      value={formData.lungAuscultation}
      options={lungAuscultationOptions}
      onChange={(value) => onChange('lungAuscultation', value)}
      placeholder="Наприклад: дихання ослаблене справа в нижніх відділах, крепітація"
    />
  );
}
