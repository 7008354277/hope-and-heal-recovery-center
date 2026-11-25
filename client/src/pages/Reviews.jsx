import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/Bits.jsx';
import { RatingSummary, ReviewCard, ReviewForm, useReviews } from '../components/Reviews.jsx';

export default function Reviews() {
  const data = useReviews(50);
  return (
    <>
      <PageHero title="Reviews and ratings" text="Honest feedback helps families choose with confidence, and helps us keep improving. Anyone can leave a review." />
      <section className="section">
        <div className="wrap split">
          <div>
            {!data ? <p className="muted">Loading…</p> : (
              <>
                <RatingSummary summary={data.summary} />
                <div className="review-list">
                  {data.reviews.length === 0 && <p className="muted">No reviews yet. Be the first to share your experience.</p>}
                  {data.reviews.map((r, i) => <ReviewCard key={r._id} r={r} delay={(i % 5) * 60} />)}
                </div>
              </>
            )}
          </div>
          <Reveal className="sticky" delay={120}><ReviewForm /></Reveal>
        </div>
      </section>
    </>
  );
}
