'use client';

import { useEffect, useRef } from 'react';

export default function AccordionSection({ id, title, subtitle, isOpen, onToggle, children }) {
  const panelId = `${id}-panel`;
  const buttonRef = useRef(null);
  const shouldScrollAfterToggleRef = useRef(false);

  useEffect(() => {
    if (!isOpen || !shouldScrollAfterToggleRef.current) return;

    shouldScrollAfterToggleRef.current = false;
    window.requestAnimationFrame(() => {
      buttonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      shouldScrollAfterToggleRef.current = true;
    }
    onToggle();
  };

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white transition ${
        isOpen
          ? 'border-teal-300 bg-teal-50/20 shadow-sm shadow-teal-100/70'
          : 'border-teal-200/80 shadow-sm shadow-slate-200/60 hover:border-teal-300 hover:shadow-md hover:shadow-teal-100/60'
      }`}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="scroll-mt-4 flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
      >
        <span className="min-w-0">
          <span className={`block text-base font-semibold ${isOpen ? 'text-teal-900' : 'text-slate-950'}`}>{title}</span>
          {subtitle ? (
            <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-2xl leading-none transition ${
            isOpen ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'
          }`}
          aria-hidden="true"
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} className="border-t border-teal-200/80 bg-white p-4 sm:p-5">
          {children}
        </div>
      ) : null}
    </article>
  );
}
