import styles from './Eyebrow.module.css';

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Eyebrow({ children, className = '', as: Tag = 'p' }: EyebrowProps) {
  return <Tag className={`${styles.eyebrow} ${className}`.trim()}>{children}</Tag>;
}
