import styles from './Skeleton.module.css';

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`${styles.block} ${className ?? ''}`} aria-hidden="true" />;
}
