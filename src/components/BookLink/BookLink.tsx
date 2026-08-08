import { Link } from 'react-router-dom';
import { track } from '../../utils/analytics';

interface Props {
  slug: string;
  munrosUrl?: string;
  bookTitle?: string;
  className?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}

export function BookLink({ slug, munrosUrl, bookTitle, className, 'aria-label': ariaLabel, children }: Props) {
  if (munrosUrl) {
    return (
      <a
        href={munrosUrl}
        className={className}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track({ name: 'munros_click', event_label: bookTitle ?? slug })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={`/books/${slug}`} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
