'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import {useState, useEffect} from 'react';
import useData from '@/lib/requestdata';
import ErrorPage from '@/components/error';
import {fetchReviewsBySwimmingPoolId} from '@/data/firestore';
import {PublicSwimmingPool, ReviewData} from '@/lib/types';
import {Spinner, Button, Link} from '@nextui-org/react';

function SwimmingPoolDetail({item}: {item: PublicSwimmingPool}) {
  return (
    <div className="py-8 flex flex-wrap md:flex-nowrap">
      <div className="md:w-64 h-64 mr-5 md:mb-0 flex-shrink-0 flex flex-col">
        <img
          src={item.imgSource}
          alt="Swimming Pool Image"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="md:flex-grow ">
        <div className="mb-5">
          <h2 className="text-2xl font-medium text-gray-900 title-font">
            {item.FACLT_NM}
          </h2>
        </div>
        <br />
        <br />
        <div className="flex items-center mt-20 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-500 w-5 h-5 mr-2"
            viewBox="0 0 384 512"
          >
            <path
              fill="#1079ea"
              d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
            />
          </svg>
          <p className="leading-relaxed">{item.SIGUN_NM}</p>
        </div>
        {(item.IRREGULR_RELYSWIMPL_LENG &&
          item.IRREGULR_RELYSWIMPL_LANE_CNT) !== null ? (
          <>
            <Button radius="lg" color="primary" size="sm">
              {item.IRREGULR_RELYSWIMPL_LENG}m
            </Button>
            <Button
              radius="lg"
              color="primary"
              size="sm"
              variant="bordered"
              isIconOnly
            >
              {item.IRREGULR_RELYSWIMPL_LANE_CNT}
            </Button>
          </>
        ) : (
          <Button radius="lg" color="primary" size="sm" variant="bordered">
            레일 정보를 준비 중이에요
          </Button>
        )}
      </div>
    </div>
  );
}

function ReviewList({
  reviews,
  item,
}: {
  reviews: ReviewData[];
  item: PublicSwimmingPool;
}) {
  return (
    <div className="md:flex-grow mt-20">
      <div className="flex items-center justify-between mb-7">
        <p className="text-2xl font-medium text-gray-900 title-font">
          수영장 리뷰
        </p>
        <Link
          href={`/visit/${item.id}`}
          className="flex items-center text-blue-500 text-sm hover:text-gray-300"
        >
          <p className="mr-2">방문한 수영장 인증</p>
          <svg
            className="inline-flex h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </Link>
      </div>
      {reviews.length === 0 ? (
        <div className="flex w-full mx-auto justify-center mb-5 flex-wrap bg-gray-100 text-gray-400 rounded-lg overflow-hidden shadow-md p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="#cfcfcf"
            className="w-4 h-5 mr-2"
          >
            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
          </svg>
          <p>가장 처음으로 리뷰를 작성해주세요!</p>
        </div>
      ) : (
        <>
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
        </>
      )}
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
                <ReviewList reviews={reviews} item={item} />
              </div>
            )}
          </div>
        ))}
      </section>
      <Footer />
    </div>
  );
}
