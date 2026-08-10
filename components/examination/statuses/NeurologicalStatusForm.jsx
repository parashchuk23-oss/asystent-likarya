import { PresetField } from './StatusPresetFields';

const neuroOptions = {
  consciousness: ['свідомість ясна', 'оглушення', 'сопор', 'кома', 'свідомість сплутана'],
  orientation: [
    'орієнтований у місці, часі та власній особі',
    'дезорієнтований у часі',
    'дезорієнтований у місці',
    'дезорієнтований у власній особі',
  ],
  speech: ['мова збережена', 'дизартрія', 'афазія', 'мова сповільнена', 'мовний контакт утруднений'],
  pupils: [
    'зіниці рівні, реакція на світло збережена',
    'зіниці рівні, реакція на світло знижена',
    'анізокорія',
    'фотореакція відсутня',
  ],
  cranialNerves: [
    'без грубої вогнищевої симптоматики',
    'асиметрія обличчя',
    'згладжена носогубна складка справа',
    'згладжена носогубна складка зліва',
    'девіація язика',
  ],
  motor: [
    'сила в кінцівках збережена',
    'зниження сили у правій руці',
    'зниження сили у лівій руці',
    'зниження сили у правій нозі',
    'зниження сили у лівій нозі',
    'правобічний геміпарез',
    'лівобічний геміпарез',
  ],
  sensory: [
    'чутливість без грубих порушень',
    'гіпестезія справа',
    'гіпестезія зліва',
    'парестезії у верхніх кінцівках',
    'парестезії у нижніх кінцівках',
  ],
  coordination: [
    'координаційні проби виконує задовільно',
    'пальце-носова проба з інтенційним тремором',
    'пальце-носова проба виконується неточно справа',
    'пальце-носова проба виконується неточно зліва',
    'поза Ромберга нестійка',
  ],
  meningeal: [
    'менінгеальні знаки негативні',
    'ригідність потиличних м’язів',
    'симптом Керніга позитивний',
    'симптоми подразнення мозкових оболонок',
  ],
  pathologicalReflexes: [
    'патологічні рефлекси не викликаються',
    'симптом Бабінського справа',
    'симптом Бабінського зліва',
    'двобічний симптом Бабінського',
  ],
  gait: ['хода без грубих порушень', 'хода нестійка', 'атаксична хода', 'паретична хода', 'самостійно не ходить'],
};

export default function NeurologicalStatusForm({ formData, onChange, mode }) {
  return (
    <div className="space-y-1">
      <div className="grid gap-3 md:grid-cols-3">
        <PresetField
          label="Свідомість"
          value={formData.neuroConsciousness}
          options={neuroOptions.consciousness}
          onChange={(value) => onChange('neuroConsciousness', value)}
        />

        <PresetField
          label="Орієнтація"
          value={formData.neuroOrientation}
          options={neuroOptions.orientation}
          onChange={(value) => onChange('neuroOrientation', value)}
        />

        <PresetField
          label="Мова"
          value={formData.neuroSpeech}
          options={neuroOptions.speech}
          onChange={(value) => onChange('neuroSpeech', value)}
        />
      </div>

      {mode !== 'short' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Зіниці"
            value={formData.neuroPupils}
            options={neuroOptions.pupils}
            onChange={(value) => onChange('neuroPupils', value)}
          />

          <PresetField
            label="Черепні нерви"
            value={formData.neuroCranialNerves}
            options={neuroOptions.cranialNerves}
            onChange={(value) => onChange('neuroCranialNerves', value)}
          />
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <PresetField
          label="Рухова сфера"
          value={formData.neuroMotorStrength}
          options={neuroOptions.motor}
          onChange={(value) => onChange('neuroMotorStrength', value)}
        />

        {mode !== 'short' ? (
          <PresetField
            label="Чутливість"
            value={formData.neuroSensory}
            options={neuroOptions.sensory}
            onChange={(value) => onChange('neuroSensory', value)}
          />
        ) : null}
      </div>

      {mode !== 'short' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Координація"
            value={formData.neuroCoordination}
            options={neuroOptions.coordination}
            onChange={(value) => onChange('neuroCoordination', value)}
          />

          <PresetField
            label="Менінгеальні знаки"
            value={formData.neuroMeningealSigns}
            options={neuroOptions.meningeal}
            onChange={(value) => onChange('neuroMeningealSigns', value)}
          />
        </div>
      ) : (
        <PresetField
          label="Менінгеальні знаки"
          value={formData.neuroMeningealSigns}
          options={neuroOptions.meningeal}
          onChange={(value) => onChange('neuroMeningealSigns', value)}
        />
      )}

      {mode === 'expanded' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <PresetField
            label="Патологічні рефлекси"
            value={formData.neuroPathologicalReflexes}
            options={neuroOptions.pathologicalReflexes}
            onChange={(value) => onChange('neuroPathologicalReflexes', value)}
          />

          <PresetField
            label="Хода"
            value={formData.neuroGait}
            options={neuroOptions.gait}
            onChange={(value) => onChange('neuroGait', value)}
          />
        </div>
      ) : null}
    </div>
  );
}
