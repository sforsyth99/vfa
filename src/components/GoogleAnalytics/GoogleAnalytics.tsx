import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../utils/analytics';

export function GoogleAnalytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.gtag?.('event', 'page_view', { page_path: pathname });
  }, [pathname]);
  return null;
}
