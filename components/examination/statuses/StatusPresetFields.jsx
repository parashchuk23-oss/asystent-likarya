'use client';

import { useEffect, useState } from 'react';
import FormField from '../../FormField';
import { inputClass } from '../../formStyles';

const manualValue = '__manual__';

export function PresetField({ label, value, options, onChange, placeholder = 'Власний опис', hint }) {
  const [isManual, setIsManual] = useState(!options.includes(value));
  const selectValue = isManual ? manualValue : value;

  useEffect(() => {
    if (!options.includes(value)) {
      setIsManual(true);
    }
  }, [options, value]);

  return (
    <FormField label={label} hint={hint} className="mb-0">
      <select
        value={selectValue}
        onChange={(event) => {
          if (event.target.value === manualValue) {
            setIsManual(true);
            return;
          }

          setIsManual(false);
          onChange(event.target.value);
        }}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option || 'empty'} value={option}>
            {option || 'не вносити в текст'}
          </option>
        ))}
        <option value={manualValue}>Власний текст</option>
      </select>

      {selectValue === manualValue ? (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} mt-2`}
        />
      ) : null}
    </FormField>
  );
}
