import { FormattedMessage } from 'react-intl';
import styles from './QueryState.module.css';

interface Props {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  loadingId: string;
  errorId?: string;
  emptyId?: string;
  emptyValues?: Record<string, string | number>;
}

export function QueryState({ isLoading, isError, isEmpty, loadingId, errorId, emptyId, emptyValues }: Props) {
  if (isLoading) {
    return (
      <p className={styles.state} role="status" aria-live="polite" aria-atomic="true">
        <FormattedMessage id={loadingId} />
      </p>
    );
  }
  if (isError && errorId) {
    return (
      <p className={styles.state} role="status" aria-live="polite" aria-atomic="true">
        <FormattedMessage id={errorId} />
      </p>
    );
  }
  if (isEmpty && emptyId) {
    return (
      <p className={styles.state}>
        <FormattedMessage id={emptyId} values={emptyValues} />
      </p>
    );
  }
  return null;
}
