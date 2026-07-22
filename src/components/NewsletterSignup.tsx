import { useState } from 'react';
import { useIntl } from 'react-intl';
import styles from './NewsletterSignup.module.css';

const MAILCHIMP_URL =
  'https://victoriafestivalofauthors.us9.list-manage.com/subscribe/post-json?u=fbfc40b39233dc1e19afef78d&id=e836a773c9&f_id=0076e8e3f0';

function NewsletterSignup() {
  const intl = useIntl();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');

    const callbackName = `mc_cb_${Date.now()}`;
    (window as unknown as Record<string, unknown>)[callbackName] = (data: { result: string; msg: string }) => {
      if (data.result === 'success') {
        setStatus('success');
        setMessage(intl.formatMessage({ id: 'newsletter.success' }));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.msg?.replace(/^\d+ - /, '') || intl.formatMessage({ id: 'newsletter.errorFallback' }));
      }
      delete (window as unknown as Record<string, unknown>)[callbackName];
      document.getElementById(callbackName)?.remove();
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = `${MAILCHIMP_URL}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;
    document.body.appendChild(script);
  };

  return (
    <div className={styles.newsletter}>
      <p className={styles.title}>{intl.formatMessage({ id: 'newsletter.title' })}</p>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Mailchimp honeypot — must stay empty */}
        <div className={styles.honeypot} aria-hidden="true">
          <input
            type="text"
            name="b_fbfc40b39233dc1e19afef78d_e836a773c9"
            tabIndex={-1}
            defaultValue=""
          />
        </div>
        <input
          type="email"
          name="EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={intl.formatMessage({ id: 'newsletter.emailPlaceholder' })}
          required
          className={styles.input}
          disabled={status === 'loading' || status === 'success'}
          aria-label={intl.formatMessage({ id: 'newsletter.emailLabel' })}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading'
            ? intl.formatMessage({ id: 'newsletter.submitting' })
            : intl.formatMessage({ id: 'newsletter.submit' })}
        </button>
      </form>
      {status === 'success' && <p className={styles.success}>{message}</p>}
      {status === 'error' && <p className={styles.error}>{message}</p>}
    </div>
  );
}

export default NewsletterSignup;
