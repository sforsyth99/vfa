import { Link } from 'react-router-dom';
import styles from './AuthorFeatureCard.module.css';

interface Props {
  photoSrc: string | null;
  photoAlt: string;
  bookCoverSrc: string | null;
  bookCoverAlt?: string;
  title: string;
  subtitleLines?: string[];
  to?: string;
  contain?: boolean;
  className?: string;
}

export function AuthorFeatureCard({
  photoSrc,
  photoAlt,
  bookCoverSrc,
  bookCoverAlt = '',
  title,
  subtitleLines = [],
  to,
  contain = false,
  className,
}: Props) {
  const rootClass = [styles.card, className].filter(Boolean).join(' ');

  const inner = (
    <>
      <div className={styles.photoSection}>
        {photoSrc && (
          <div className={styles.photoLeft}>
            <img
              src={photoSrc}
              alt={photoAlt}
              className={contain ? styles.authorPhotoContain : styles.authorPhoto}
            />
          </div>
        )}
        {bookCoverSrc && (
          <img src={bookCoverSrc} alt={bookCoverAlt} className={styles.bookCover} />
        )}
      </div>
      <div className={styles.banner}>
        <p className={styles.title}>{title}</p>
        {subtitleLines.map((line, i) => (
          <p key={i} className={styles.subtitle}>{line}</p>
        ))}
      </div>
    </>
  );

  if (to) return <Link to={to} className={rootClass}>{inner}</Link>;
  return <div className={rootClass}>{inner}</div>;
}
