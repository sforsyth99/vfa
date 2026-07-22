import { Component } from 'react';
import type { ReactNode } from 'react';
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
          <h1>Oops — something went wrong.</h1>
          <p>
            Try refreshing the page. If the problem persists, please{' '}
          <a href="mailto:webmaster@victoriafestivalofauthors.ca">contact us</a>.
          </p>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
