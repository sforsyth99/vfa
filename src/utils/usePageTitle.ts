import { useEffect } from 'react';

const SITE = 'Victoria Festival of Authors';

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `VFA — ${title}` : SITE;
    return () => { document.title = SITE; };
  }, [title]);
}
