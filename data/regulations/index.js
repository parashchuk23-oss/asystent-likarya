import moz1044Criteria from './moz-1044-2026/criteria.json';
import moz1044Metadata from './moz-1044-2026/metadata.json';
import moz1044Sections from './moz-1044-2026/sections.json';

export const regulations = [
  {
    ...moz1044Metadata,
    sections: moz1044Sections,
    criteria: moz1044Criteria,
  },
];

export const getRegulationById = (id) => regulations.find((regulation) => regulation.id === id);
