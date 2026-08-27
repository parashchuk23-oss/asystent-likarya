export const vaccinationRiskFactors = [
  { id: 'pregnancy', label: 'Вагітність', vaccines: ['influenza', 'covid'], appliesTo: 'female' },
  { id: 'immunosuppression', label: 'Імуносупресія', vaccines: ['influenza', 'covid', 'pneumococcal'], warning: 'Живі вакцини потребують окремої оцінки.' },
  { id: 'asplenia', label: 'Аспленія / функціональна аспленія', vaccines: ['pneumococcal', 'meningococcal', 'influenza'] },
  { id: 'cvd', label: 'Хронічні серцево-судинні захворювання', vaccines: ['influenza', 'covid', 'pneumococcal'] },
  { id: 'lung', label: 'Хронічні захворювання легень', vaccines: ['influenza', 'covid', 'pneumococcal'] },
  { id: 'diabetes', label: 'Цукровий діабет', vaccines: ['influenza', 'covid', 'pneumococcal', 'hepb'] },
  { id: 'ckd', label: 'Хронічна хвороба нирок', vaccines: ['influenza', 'covid', 'pneumococcal', 'hepb'] },
  { id: 'liver', label: 'Хронічні захворювання печінки', vaccines: ['influenza', 'covid', 'pneumococcal', 'hepa', 'hepb'] },
  { id: 'professional', label: 'Професійні ризики', vaccines: ['influenza', 'covid', 'hepb'] },
  { id: 'collective', label: 'Організовані колективи', vaccines: ['influenza', 'covid', 'mmr'] },
  { id: 'travel', label: 'Подорожі', vaccines: ['hepa', 'meningococcal', 'influenza', 'covid'] },
];
