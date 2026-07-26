import { Link } from 'react-router-dom';

interface Props {
  slug: string;
  munrosUrl?: string;
  className?: string;
  children: React.ReactNode;
}

export function BookLink({ slug, munrosUrl, className, children }: Props) {
  if (munrosUrl) {
    return (
      <a href={munrosUrl} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={`/books/${slug}`} className={className}>
      {children}
    </Link>
  );
}
