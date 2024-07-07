'use client';

import Header from './header';
import Footer from './footer';
import {useState, useEffect} from 'react';
import useData from '../lib/requestdata';
import Loading from './loading';
import ErrorPage from './error';
import {fetchReviewData} from '@/data/firestore';
import {PublicSwimmingPool, ReviewData} from '../lib/types';

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
        const reviews = await fetchReviewData(swimmingpool_id);

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
                {item.author_user_id}
              </p>
              <p className="text-gray-500 text-sm">{item.reg_date}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font overflow-hidden min-h-max">
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
    </>
  );
}
