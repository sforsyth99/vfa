import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className = '' }: SectionTitleProps) {
  return <h2 className={`${styles.sectionTitle} ${className}`.trim()}>{children}</h2>;
}
