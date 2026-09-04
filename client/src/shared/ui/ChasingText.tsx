const ACCENT_HOVER = ['group-hover:text-primary', 'group-hover:text-acid', 'group-hover:text-love'] as const;

interface ChasingTextProps {
  text: string;
  stepMs?: number;
}

export function ChasingText({ text, stepMs = 30 }: ChasingTextProps) {
  return (
    <>
      <span aria-hidden="true">
        {[...text].map((char, index) => (
          <span
            key={index}
            className={`transition-colors duration-300 ${ACCENT_HOVER[index % ACCENT_HOVER.length]}`}
            style={{ transitionDelay: `${index * stepMs}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}
