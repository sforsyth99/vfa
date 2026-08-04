function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?(?:[^"#]*&)*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

export function injectYouTubeEmbeds(html: string): string {
  return html.replace(
    /<a\b[^>]*\bhref="(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)[^"]*)"[^>]*>[\s\S]*?<\/a>/gi,
    (match, url) => {
      const videoId = extractVideoId(url);
      if (!videoId) return match;
      return `<iframe class="yt-embed" src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
    },
  );
}
