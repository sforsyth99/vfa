import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styles from './KidsFestPromo.module.css';
import posterSrc from '../../assets/VFA_KidsFest.jpg';

export function KidsFestPromo() {
  const intl = useIntl();

  return (
    <section className={styles.section} aria-labelledby="kidsfest-heading">
      <div className={styles.inner}>
        <img
          src={posterSrc}
          alt={intl.formatMessage({ id: 'kidsfest.posterAlt' })}
          className={styles.poster}
          loading="lazy"
        />
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            {intl.formatMessage({ id: 'kidsfest.eyebrow' })}
          </p>
          <h2 id="kidsfest-heading" className={styles.heading}>
            {intl.formatMessage({ id: 'kidsfest.heading' })}
          </h2>
          <p className={styles.tagline}>
            {intl.formatMessage({ id: 'kidsfest.tagline' })}
          </p>
          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt className={styles.detailLabel}>Date</dt>
              <dd className={styles.detailValue}>
                {intl.formatMessage({ id: 'kidsfest.date' })}
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailLabel}>Time</dt>
              <dd className={styles.detailValue}>
                {intl.formatMessage({ id: 'kidsfest.time' })}
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt className={styles.detailLabel}>Where</dt>
              <dd className={styles.detailValue}>
                {intl.formatMessage({ id: 'kidsfest.venue' })}
                <span className={styles.address}>
                  {intl.formatMessage({ id: 'kidsfest.address' })}
                </span>
              </dd>
            </div>
          </dl>
          <Link to="/kidsfest2026" className={styles.cta}>
            {intl.formatMessage({ id: 'kidsfest.cta' })}
          </Link>
        </div>
      </div>
    </section>
  );
}
