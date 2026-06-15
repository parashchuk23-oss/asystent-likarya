'use client';

import { useState } from 'react';
import ConclusionEditor from './ConclusionEditor';
import PatientForm from './PatientForm';
import { buildDoctorConclusion } from '../utils/doctorConclusion';

const initialForm = {
  age: '',
  visitDate: new Date().toISOString().slice(0, 10),
  birthDate: '',
  sex: '',
  complaints: '',
  generalCondition: 'задовільний',
  generalConditionNote: '',
  skinCondition: 'чисті, блідо-рожеві',
  bodyType: 'нормостенічний',
  lymphNodes: 'без особливостей',
  thyroid: 'не збільшена, безболісна при пальпації',
  oralCavity: 'зів рожевий, мигдалики чисті',
  bloodPressure: '',
  systolicBP: '',
  diastolicBP: '',
  heartRate: '',
  height: '',
  weight: '',
  bmi: '',
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

function parseDateValue(value) {
  if (!value) return null;

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const ukrainianDateMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (ukrainianDateMatch) {
    const [, day, month, year] = ukrainianDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}

function formatBirthDate(value) {
  let digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length === 1 && Number(digits) > 3) {
    digits = `0${digits}`;
  }

  if (digits.length === 3 && Number(digits.slice(2, 3)) > 1) {
    digits = `${digits.slice(0, 2)}0${digits.slice(2)}`;
  }

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join('.');
}

function calculateAge(birthDate, visitDate) {
  if (!birthDate || !visitDate) return '';

  const birth = parseDateValue(birthDate);
  const visit = parseDateValue(visitDate);

  if (!birth || !visit || Number.isNaN(birth.getTime()) || Number.isNaN(visit.getTime()) || birth > visit) {
    return '';
  }

  let age = visit.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    visit.getMonth() > birth.getMonth() ||
    (visit.getMonth() === birth.getMonth() && visit.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return String(age);
}

function calculateBmi(height, weight) {
  const heightCm = Number(height);
  const weightKg = Number(weight);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return '';
  }

  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

export default function CardioAssistantTab() {
  const [formData, setFormData] = useState(initialForm);
  const [conclusion, setConclusion] = useState('');

  function handleChange(field, value) {
    setFormData((current) => {
      const nextValue = field === 'birthDate' ? formatBirthDate(value) : value;
      const nextForm = {
        ...current,
        [field]: nextValue,
      };

      if (field === 'birthDate' || field === 'visitDate') {
        nextForm.age = calculateAge(nextForm.birthDate, nextForm.visitDate);
      }

      if (field === 'height' || field === 'weight') {
        nextForm.bmi = calculateBmi(nextForm.height, nextForm.weight);
      }

      return nextForm;
    });
  }

  function handleGenerateConclusion() {
    setConclusion(buildDoctorConclusion(formData));
  }

  function handleClearConclusion() {
    setConclusion('');
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(26rem,0.92fr)]">
      <PatientForm
        formData={formData}
        onChange={handleChange}
        onGenerateConclusion={handleGenerateConclusion}
        onClearConclusion={handleClearConclusion}
      />
      <ConclusionEditor conclusion={conclusion} onChange={setConclusion} />
    </div>
  );
}
