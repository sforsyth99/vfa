import styles from './BlurImageCard.module.css';

interface Props {
  src: string;
  alt: string;
  contain?: boolean;
}

export function BlurImageCard({ src, alt, contain = false }: Props) {
  return (
    <div className={styles.card}>
      <img src={src} alt="" className={styles.blurBg} aria-hidden="true" />
      <img src={src} alt={alt} className={contain ? styles.imgContain : styles.img} />
    </div>
  );
}
