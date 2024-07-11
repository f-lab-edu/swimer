import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useAuthState} from '@/contexts/AuthContext';
import {TotalData} from '@/lib/types';
import {fetchReviewByUserId} from '@/data/firestore';
import {Avatar, Spinner, Tooltip} from '@nextui-org/react';
import KakaoMap from './kakaoMap';

function ReviewList({reviews}: {reviews: TotalData[]}) {
  return (
    <div className="md:flex-grow mt-20">
      {reviews.length === 0 ? (
        <p>아직 등록 된 리뷰가 없어요. 리뷰를 남겨보세요! </p>
      ) : (
        reviews.map((item, index) => (
          <div
            key={index}
            className="flex w-full mx-auto mb-5 flex-wrap bg-white rounded-lg overflow-hidden shadow-md p-4"
          >
            <p className="title-font text-gray-900 lg:w-3/4 lg:mb-0 mb-4 font-bold">
              {item.swimmingpool_name}
            </p>
            <p className="title-font text-gray-900 lg:w-3/4 lg:mb-0 mb-4">
              {item.review_content}
            </p>
            <div className="flex-grow"></div>
            <div className="flex justify-between">
              <p className="text-gray-500 text-sm">{item.reg_date}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Layout({children}: {children: React.ReactNode}) {
  const [reviews, setReviews] = useState<TotalData[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.uid) {
          const reviews = await fetchReviewByUserId(user.uid);
          setReviews(reviews);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  if (loading) {
    return (
      <Spinner
        size="lg"
        className="flex flex-col items-center justify-center min-h-screen"
      />
    );
  }

  //사용자 레벨
  const filledStars = (() => {
    if (reviews.length === 0) return 0;
    else if (reviews.length === 1) return 1;
    else if (reviews.length <= 2) return 2;
    else if (reviews.length <= 3) return 3;
    else if (reviews.length <= 4) return 4;
    else return 5;
  })();

  const totalStar: number[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="text-gray-600 body-font overflow-hidden min-h-max flex-1">
        <div className="container px-5 mx-auto max-w-screen-xl">
          <div className="container px-5 py-24 mx-auto">
            <div className="-my-8 ">
              <p className="text-sm text-blue-400 mb-3">
                오수완과 함께 즐거운 수영 생활을 기록해보세요!
              </p>
              <div className="flex items-center mb-4">
                <Avatar
                  name={user?.displayName ?? ''}
                  size="md"
                  className="mr-2"
                />
                <p className="text-lg mr-3">나의 수친자 레벨은?</p>

                {totalStar.map((arrayindex, index) => (
                  <Tooltip
                    content={
                      index === 0
                        ? 'Lv1'
                        : index === 1
                        ? '수린이'
                        : index === 2
                        ? '수친자'
                        : index === 3
                        ? '고인물'
                        : '돌고래'
                    }
                    key={index}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="text-blue-500 inline-flex items-center size-7 mr-1"
                    >
                      <path
                        fill={index < filledStars ? '#1079ea' : '#CCCCCC'}
                        d="M180.5 141.5C219.7 108.5 272.6 80 336 80s116.3 28.5 155.5 61.5c39.1 33 66.9 72.4 81 99.8c4.7 9.2 4.7 20.1 0 29.3c-14.1 27.4-41.9 66.8-81 99.8C452.3 403.5 399.4 432 336 432s-116.3-28.5-155.5-61.5c-16.2-13.7-30.5-28.5-42.7-43.1L48.1 379.6c-12.5 7.3-28.4 5.3-38.7-4.9S-3 348.7 4.2 336.1L50 256 4.2 175.9c-7.2-12.6-5-28.4 5.3-38.6s26.1-12.2 38.7-4.9l89.7 52.3c12.2-14.6 26.5-29.4 42.7-43.1zM448 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                      />
                    </svg>
                  </Tooltip>
                ))}
              </div>
              <div className="flex justify-between items-center mb-7 mt-10">
                <p className="text-2xl font-medium text-gray-900 title-font">
                  내가 방문한 수영장
                  <span className="inline-block bg-blue-500 text-white text-lg rounded-2xl px-2 py-0 ml-2">
                    {reviews.length}
                  </span>
                </p>
                <Link
                  href={'/'}
                  className="flex items-center text-blue-500 text-sm mt-3 hover:text-gray-300"
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
              <div className="flex">
                <KakaoMap reviews={reviews} />
              </div>
            </div>
            <div className="-my-7">
              <div className="md:flex-grow mt-20">
                <ReviewList reviews={reviews} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
