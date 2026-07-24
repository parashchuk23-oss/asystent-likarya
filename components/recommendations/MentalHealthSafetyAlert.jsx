'use client';

export default function MentalHealthSafetyAlert({ show }) {
  if (!show) return null;

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
      <p className="font-semibold">Окрема клінічна оцінка безпеки</p>
      <p className="mt-1">
        Позитивна відповідь на пункт 9 PHQ-9 потребує окремої клінічної оцінки безпеки пацієнта.
        Загальний бал PHQ-9 не замінює такої оцінки.
      </p>
      <p className="mt-1">
        Навички самодопомоги можна переглядати та редагувати, але вони не є достатньою тактикою
        при позитивній відповіді на це питання.
      </p>
    </div>
  );
}
