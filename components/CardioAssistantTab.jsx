'use client';

import { useState } from 'react';
import ConclusionEditor from './ConclusionEditor';
import PatientForm from './PatientForm';

const initialForm = {
  age: '',
  visitDate: new Date().toISOString().slice(0, 10),
  complaints: '',
  generalCondition: 'задовільний',
  skinCondition: 'чисті, блідо-рожеві',
  bodyType: 'нормостенічний',
  lymphNodes: 'без особливостей',
  thyroid: 'не збільшена, безболісна при пальпації',
  oralCavity: 'зів рожевий, мигдалики чисті',
  systolicBP: '',
  diastolicBP: '',
  heartRate: '',
  height: '',
  weight: '',
  heartAuscultation: '',
  lungAuscultation: '',
  abdomen: "живіт м'який, безболісний",
  defecation: 'без особливостей',
  urination: 'без особливостей',
  cvsSymptom: 'негативні',
  edema: '',
  diagnosis: '',
  recommendations: '',
};

export default function CardioAssistantTab() {
  const [formData, setFormData] = useState(initialForm);
  const [conclusion, setConclusion] = useState('');

  function handleChange(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <PatientForm formData={formData} onChange={handleChange} />
      <ConclusionEditor conclusion={conclusion} onChange={setConclusion} />
    </div>
  );
}
