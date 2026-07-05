import { useParams } from 'react-router-dom';
import { useGetPerson } from '../api/people/useGetPerson.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';
import styles from './Person.module.css';

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: person, isLoading, error } = useGetPerson({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !person) return <div>Person not found</div>;

  const { alternate_name, bio, website_url, photo } = person.person_data;
  const name = decodeHtmlEntities(person.title.rendered);

  return (
    <main className={styles.page}>
      <div className={styles.profile}>
        {photo && (
          <img src={photo[0]} alt={name} className={styles.photo} />
        )}
        <div className={styles.meta}>
          <p className={styles.eyebrow}>Author</p>
          <h1 className={styles.name}>{name}</h1>
          {alternate_name && <p className={styles.alternateName}>{alternate_name}</p>}
          {bio && <p className={styles.bio}>{bio}</p>}
          {website_url && (
            <a href={website_url} className={styles.websiteLink}>
              Visit website →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
