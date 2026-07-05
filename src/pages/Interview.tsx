import { useParams } from 'react-router-dom';
import { useGetInterview } from '../api/interviews/useGetInterview.ts';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities.ts';

export default function InterviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: interview, isLoading, error } = useGetInterview({ slug: slug! });

  if (isLoading) return <div>Loading...</div>;
  if (error || !interview) return <div>Interview not found</div>;

  const { author_name, interviewer_name, author_bio_url, intro, author_photo, question, answer } =
    interview.interview_data;

  return (
    <main>
      <h1>{decodeHtmlEntities(interview.title.rendered)}</h1>

      {author_photo && (
        <img src={author_photo[0]} alt={author_name} width={author_photo[1]} height={author_photo[2]} />
      )}

      {author_name && <p>{author_name}</p>}
      {interviewer_name && <p>Interviewed by {interviewer_name}</p>}

      {author_bio_url && <a href={author_bio_url}>Author Bio</a>}

      {intro && <p>{intro}</p>}

      {question.map((q, i) => (
        <div key={i}>
          <p>
            <strong>Q{i + 1}: {q}</strong>
          </p>
          <p>{answer[i]}</p>
        </div>
      ))}
    </main>
  );
}
