import BmiCalculator from './calculators/BmiCalculator';
import Cha2ds2VascCalculator from './calculators/Cha2ds2VascCalculator';
import HasBledCalculator from './calculators/HasBledCalculator';

export default function CalculatorsTab() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <BmiCalculator />
      <Cha2ds2VascCalculator />
      <HasBledCalculator />
    </div>
  );
}
