export const pediatricBloodPressureScreening = {
  source:
    'AAP 2017 Clinical Practice Guideline, simplified screening table for children and adolescents',
  note:
    'Скринінгова таблиця призначена для первинного виявлення показників АТ, які потребують повторного вимірювання та подальшої оцінки. Вона не встановлює діагноз артеріальної гіпертензії.',
  ageRangeYears: {
    min: 1,
    max: 17,
  },
  childrenUnder13: {
    1: { male: { systolic: 98, diastolic: 52 }, female: { systolic: 98, diastolic: 54 } },
    2: { male: { systolic: 100, diastolic: 55 }, female: { systolic: 101, diastolic: 58 } },
    3: { male: { systolic: 101, diastolic: 58 }, female: { systolic: 102, diastolic: 60 } },
    4: { male: { systolic: 102, diastolic: 60 }, female: { systolic: 103, diastolic: 62 } },
    5: { male: { systolic: 103, diastolic: 63 }, female: { systolic: 104, diastolic: 64 } },
    6: { male: { systolic: 105, diastolic: 66 }, female: { systolic: 105, diastolic: 67 } },
    7: { male: { systolic: 106, diastolic: 68 }, female: { systolic: 106, diastolic: 68 } },
    8: { male: { systolic: 107, diastolic: 69 }, female: { systolic: 107, diastolic: 69 } },
    9: { male: { systolic: 107, diastolic: 70 }, female: { systolic: 108, diastolic: 71 } },
    10: { male: { systolic: 108, diastolic: 72 }, female: { systolic: 109, diastolic: 72 } },
    11: { male: { systolic: 110, diastolic: 74 }, female: { systolic: 111, diastolic: 74 } },
    12: { male: { systolic: 113, diastolic: 75 }, female: { systolic: 114, diastolic: 75 } },
  },
  adolescents13AndOlder: {
    normal: { systolicMax: 119, diastolicMax: 79 },
    elevated: { systolicMin: 120, systolicMax: 129, diastolicMax: 79 },
    stage1: { systolicMin: 130, systolicMax: 139, diastolicMin: 80, diastolicMax: 89 },
    stage2: { systolicMin: 140, diastolicMin: 90 },
  },
};
