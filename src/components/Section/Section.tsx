import styles from './Section.module.css';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'default' | 'large' | 'compact';
}

export function Section({ children, className = '', spacing = 'default' }: SectionProps) {
  return (
    <section className={`${styles.section} ${styles[spacing]} ${className}`.trim()}>
      {children}
    </section>
  );
}
