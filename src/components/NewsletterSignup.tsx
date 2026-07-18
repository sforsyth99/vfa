import { useState } from 'react';
import styles from './NewsletterSignup.module.css';

const MAILCHIMP_URL =
  'https://victoriafestivalofauthors.us9.list-manage.com/subscribe/post-json?u=fbfc40b39233dc1e19afef78d&id=e836a773c9&f_id=0076e8e3f0';

function NewsletterSignup() {
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
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        // Mailchimp error messages sometimes start with a number + " - "
        setMessage(data.msg?.replace(/^\d+ - /, '') || 'Something went wrong. Please try again.');
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
      <p className={styles.title}>Stay in the loop</p>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Mailchimp honeypot — must stay empty */}
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
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
          placeholder="Your email address"
          required
          className={styles.input}
          disabled={status === 'loading' || status === 'success'}
          aria-label="Email address"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && <p className={styles.success}>{message}</p>}
      {status === 'error' && <p className={styles.error}>{message}</p>}
    </div>
  );
}

export default NewsletterSignup;
