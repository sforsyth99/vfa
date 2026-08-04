function toEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('podcasts.apple.com')) return null;
    parsed.hostname = 'embed.podcasts.apple.com';
    return parsed.toString();
  } catch {
    return null;
  }
}

function isEpisode(url: string): boolean {
  try {
    return new URL(url).searchParams.has('i');
  } catch {
    return false;
  }
}

export function injectApplePodcastEmbeds(html: string): string {
  return html.replace(
    /<a\b[^>]*\bhref="(https?:\/\/podcasts\.apple\.com[^"]*)"[^>]*>[\s\S]*?<\/a>/gi,
    (match, url) => {
      const embedUrl = toEmbedUrl(url);
      if (!embedUrl) return match;
      const height = isEpisode(url) ? 175 : 450;
      return `<iframe class="apple-podcast-embed" src="${embedUrl}" height="${height}" frameborder="0" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" loading="lazy" title="Apple Podcasts player"></iframe>`;
    },
  );
}
