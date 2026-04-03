import React from 'react';
import { useGetMedia } from '../api/media/useGetMedia';
import type { Media } from '../api/media/mediaTypes.ts';

const MediaPage: React.FC = () => {
  const { data, isLoading, error } = useGetMedia();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading media.</div>;
  if (!data || data.length === 0) return <div>No media found.</div>;

  return (
    <div>
      <h1>Media</h1>
      <ul>
        {data.slice(0, 5).map((media: Media) => (
          <li key={media.id} style={{ marginBottom: 24 }}>
            <strong>{media.title.rendered}</strong>
            <div>
              <img
                src={media.source_url}
                alt={media.alt_text || media.title.rendered}
                style={{ maxWidth: 200, height: 'auto' }}
              />
            </div>
            <div>{media.caption.rendered && <span dangerouslySetInnerHTML={{ __html: media.caption.rendered }} />}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MediaPage;
