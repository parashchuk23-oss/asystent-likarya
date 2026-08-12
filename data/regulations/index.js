import kmu1303DiseaseCategories from './kmu-1303-1998/diseaseCategories.json';
import kmu1303Metadata from './kmu-1303-1998/metadata.json';
import kmu1303PopulationGroups from './kmu-1303-1998/populationGroups.json';
import moz1044Criteria from './moz-1044-2026/criteria.json';
import moz1044Metadata from './moz-1044-2026/metadata.json';
import moz1044Sections from './moz-1044-2026/sections.json';

export const regulations = [
  {
    ...moz1044Metadata,
    sections: moz1044Sections,
    criteria: moz1044Criteria,
  },
  {
    ...kmu1303Metadata,
    populationGroups: kmu1303PopulationGroups,
    diseaseCategories: kmu1303DiseaseCategories,
  },
];

export const getRegulationById = (id) => regulations.find((regulation) => regulation.id === id);
