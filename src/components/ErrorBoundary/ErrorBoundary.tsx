import { Component } from 'react';
import type { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { WEBMASTER_EMAIL } from '../../config/festival';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className={styles.errorPage}>
          <h1><FormattedMessage id="errorBoundary.heading" /></h1>
          <p>
            <FormattedMessage
              id="errorBoundary.body"
              values={{
                contactLink: (chunks) => (
                  <a href={`mailto:${WEBMASTER_EMAIL}`}>{chunks}</a>
                ),
              }}
            />
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
