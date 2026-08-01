import { describe, it, expect } from 'vitest';
import { decodeHtmlEntities } from './decodeHtmlEntities';

describe('decodeHtmlEntities', () => {
  it('decodes &amp; to &', () => {
    expect(decodeHtmlEntities('Q&amp;A')).toBe('Q&A');
  });

  it('decodes &lt; and &gt; to < and >', () => {
    expect(decodeHtmlEntities('&lt;div&gt;')).toBe('<div>');
  });

  it('decodes &quot; to "', () => {
    expect(decodeHtmlEntities('&quot;hello&quot;')).toBe('"hello"');
  });

  it('decodes &#39; to apostrophe', () => {
    expect(decodeHtmlEntities('it&#39;s')).toBe("it's");
  });

  it('decodes multiple entities in a single string', () => {
    expect(decodeHtmlEntities('&lt;b&gt;Bold &amp; Beautiful&lt;/b&gt;')).toBe(
      '<b>Bold & Beautiful</b>'
    );
  });

  it('passes through plain text unchanged', () => {
    expect(decodeHtmlEntities('Hello World')).toBe('Hello World');
  });

  it('returns an empty string for empty input', () => {
    expect(decodeHtmlEntities('')).toBe('');
  });
});
