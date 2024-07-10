'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import {useState, useEffect} from 'react';
import useData from '@/lib/requestdata';
import ErrorPage from '@/components/error';
import {fetchReviewsBySwimmingPoolId} from '@/data/firestore';
import {PublicSwimmingPool, ReviewData} from '@/lib/types';
import {Spinner} from '@nextui-org/react';

function SwimmingPoolDetail({item}: {item: PublicSwimmingPool}) {
  return (
    <div className="py-8 flex flex-wrap md:flex-nowrap">
      <div className="md:w-64 mr-10 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
        <img src="https://dummyimage.com/720x600" alt="Placeholder Image" />
      </div>
      <div className="md:flex-grow mt-10">
        <h2 className="text-2xl font-medium text-gray-900 title-font mb-20">
          {item.FACLT_NM}
        </h2>
        <p className="leading-relaxed">{item.SIGUN_NM}</p>
        <p className="leading-relaxed">{item.CONTCT_NO}</p>
        <p className="leading-relaxed">{item.HMPG_ADDR}</p>
        {(item.IRREGULR_RELYSWIMPL_LENG &&
          item.IRREGULR_RELYSWIMPL_LANE_CNT) !== null && (
          <p className="leading-relaxed">
            {item.IRREGULR_RELYSWIMPL_LENG}m *{' '}
            {item.IRREGULR_RELYSWIMPL_LANE_CNT}
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewList({reviews}: {reviews: ReviewData[]}) {
  return (
    <div className="md:flex-grow mt-20">
      <p className="text-2xl font-medium text-gray-900 title-font mb-7">
        수영장 리뷰
      </p>
      {reviews.map((item, index) => (
        <div
          key={index}
          className="flex w-full mx-auto mb-5 flex-wrap bg-white rounded-lg overflow-hidden shadow-md p-4"
        >
          <p className="title-font text-gray-900 lg:w-3/4 lg:mb-0 mb-4">
            {item.review_content}
          </p>
          <div className="flex-grow"></div>
          <div className="flex justify-between">
            <p className="text-gray-900 text-sm mr-5">
              {item.author_user_name}
            </p>
            <p className="text-gray-500 text-sm">{item.reg_date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Layout({
  swimmingpool_id,
}: {
  readonly swimmingpool_id: string;
}) {
  const {data, loading, error} = useData();
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviews = await fetchReviewsBySwimmingPoolId(swimmingpool_id);

        if (reviews) {
          setReviews(reviews);
        } else {
          console.error('Fetch reviews returned undefined');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (swimmingpool_id) {
      fetchData();
    } else {
      console.error('Invalid swimmingpool_id:', swimmingpool_id);
    }
  }, [swimmingpool_id]);

  if (loading) {
    return (
      <Spinner
        size="lg"
        className="flex flex-col items-center justify-center min-h-screen"
      />
    );
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="text-gray-600 body-font overflow-hidden min-h-max flex-1">
        {data.map((item, index) => (
          <div key={index}>
            {item.id === swimmingpool_id && (
              <div className="container px-5 mx-auto max-w-screen-xl">
                <SwimmingPoolDetail item={item} />
                <ReviewList reviews={reviews} />
              </div>
            )}
          </div>
        ))}
      </section>
      <Footer />
    </div>
  );
}
