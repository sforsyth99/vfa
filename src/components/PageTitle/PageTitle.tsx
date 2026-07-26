import styles from './PageTitle.module.css';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className = '' }: PageTitleProps) {
  return <h1 className={`${styles.pageTitle} ${className}`.trim()}>{children}</h1>;
}
