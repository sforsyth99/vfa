import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useGetFestivalEvents } from '../../api/festivalEvents/useGetFestivalEvents';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import { downloadIcs } from '../../utils/downloadIcs';
import { track } from '../../utils/analytics';
import styles from './KidsFestPromo.module.css';
import posterSrc from '../../assets/VFA_KidsFest.jpg';

export function KidsFestPromo() {
  const intl = useIntl();
  const { data: events } = useGetFestivalEvents();
  const mainEvent = (events ?? []).find(
    (e) => e.event_data.is_kidfest && e.event_data.event_type === 'author_fair',
  ) ?? null;

  const handleAddToCalendar = () => {
    if (!mainEvent) return;
    const { event_date, time_start, time_end, venue } = mainEvent.event_data;
    const title = decodeHtmlEntities(mainEvent.title?.rendered ?? '');
    const locationParts = [venue?.name, venue?.street_address, venue?.city, venue?.province].filter(Boolean);
    track({ name: 'add_to_calendar', event_label: title, event_location: 'home_promo' });
    downloadIcs({
      title,
      date: event_date,
      timeStart: time_start,
      timeEnd: time_end,
      location: locationParts.join(', '),
      description: intl.formatMessage({ id: 'kidsfest2026.mainEvent.description' }),
      filename: 'kidsfest-2026.ics',
      uid: 'kidsfest-2026-main@victoriafestivalofauthors.ca',
    });
  };

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
          <div className={styles.actions}>
            <Link to="/kidsfest2026" className={styles.cta}>
              {intl.formatMessage({ id: 'kidsfest.cta' })}
            </Link>
            {mainEvent && (
              <button
                className={styles.calendarButton}
                onClick={handleAddToCalendar}
                aria-label={intl.formatMessage({ id: 'kidsfest2026.mainEvent.addToCalendar' })}
              >
                {intl.formatMessage({ id: 'kidsfest2026.mainEvent.addToCalendar' })}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
