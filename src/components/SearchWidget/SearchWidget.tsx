import { useRef, useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useSearchWP, resultToPath } from '../../api/search/useSearchWP';
import { decodeHtmlEntities } from '../../utils/decodeHtmlEntities';
import styles from './SearchWidget.module.css';

export function SearchWidget() {
  const intl = useIntl();
  const navigate = useNavigate();
  const listboxId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching } = useSearchWP(debouncedQuery);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      setQuery('');
      setDebouncedQuery('');
      setActiveIndex(-1);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      navigate(resultToPath(results[activeIndex]));
      setOpen(false);
    }
  }

  const showDropdown = open && debouncedQuery.trim().length >= 2;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {!open ? (
        <button
          className={styles.iconButton}
          aria-label={intl.formatMessage({ id: 'nav.search.label' })}
          onClick={() => setOpen(true)}
        >
          <SearchIcon />
        </button>
      ) : (
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIconInline} />
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={intl.formatMessage({ id: 'nav.search.placeholder' })}
            aria-label={intl.formatMessage({ id: 'nav.search.label' })}
            aria-autocomplete="list"
            aria-controls={showDropdown ? listboxId : undefined}
            aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
            autoComplete="off"
          />
          <button
            className={styles.closeButton}
            aria-label={intl.formatMessage({ id: 'nav.search.close' })}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          {showDropdown && (
            <ul
              id={listboxId}
              role="listbox"
              className={styles.dropdown}
              aria-label={intl.formatMessage({ id: 'nav.search.label' })}
            >
              {isFetching && <li className={styles.status} role="status">…</li>}
              {!isFetching && results.length === 0 && (
                <li className={styles.status}>{intl.formatMessage({ id: 'nav.search.noResults' })}</li>
              )}
              {results.map((result, i) => (
                <li
                  key={result.id}
                  id={`search-result-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={`${styles.result} ${i === activeIndex ? styles.resultActive : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    navigate(resultToPath(result));
                    setOpen(false);
                  }}
                >
                  <span className={styles.resultTitle}>{decodeHtmlEntities(result.title)}</span>
                  <span className={styles.resultType}>{result.subtype}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
