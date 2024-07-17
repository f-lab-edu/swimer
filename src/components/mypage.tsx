import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useAuthState} from '@/contexts/AuthContext';
import {TotalData} from '@/lib/types';
import {fetchReviewByUserId} from '@/data/firestore';
import {Avatar, Spinner, Tooltip} from '@nextui-org/react';
import KakaoMap from './kakaoMap';
import {ArrowIcon, FishIcon} from '@/ui/icon';

function ReviewList({reviews}: {reviews: TotalData[]}) {
  if (reviews.length === 0) {
    return <p>아직 등록 된 리뷰가 없어요. 리뷰를 남겨보세요! </p>;
  }

  return (
    <div className="md:flex-grow mt-20">
      {reviews.map((item, index) => (
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
      ))}
    </div>
  );
}

export default function Layout({
  children,
  uid,
}: {
  children: React.ReactNode;
  uid: string;
}) {
  const [reviews, setReviews] = useState<TotalData[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (uid) {
          const reviews = await fetchReviewByUserId(uid);
          setReviews(reviews);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [uid]);

  if (loading) {
    return (
      <Spinner
        size="lg"
        className="flex flex-col items-center justify-center min-h-screen"
      />
    );
  }

  const isCurrentUser = user?.uid === uid;

  const userLevelLabel = (index: number) => {
    switch (index) {
      case 0:
        return 'Lv1';
      case 1:
        return '수린이';
      case 2:
        return '수친자';
      case 3:
        return '고인물';
      default:
        return '돌고래';
    }
  };

  const avatarUserName =
    reviews.length > 0
      ? reviews[0].author_user_name
      : (isCurrentUser && user?.displayName) || '';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <section className="text-gray-600 body-font overflow-hidden min-h-max flex-1">
        <div className="container px-5 mx-auto max-w-screen-xl">
          <div className="container px-5 py-24 mx-auto">
            <div className="-my-8 ">
              <p className="text-sm text-blue-400 mb-3">
                {isCurrentUser
                  ? '오수완과 함께 즐거운 수영 생활을 기록 해 보세요!'
                  : '오수완과 함께 다른 수영인들은 어떤 수영장을 방문했는 지 확인 해 보세요!'}
              </p>
              <div className="flex items-center mb-4">
                <Avatar name={avatarUserName} size="md" className="mr-2" />
                <p className="text-lg mr-3">
                  {isCurrentUser
                    ? '나의 수친자 레벨은 ?'
                    : reviews.length > 0 &&
                      `${reviews[0].author_user_name} 님의 수친자 레벨`}
                </p>

                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Tooltip content={userLevelLabel(index)} key={index}>
                      <FishIcon index={index} reviews={reviews.length} />
                    </Tooltip>
                  ))}
              </div>
              <div className="flex justify-between items-center mb-7 mt-10">
                <p className="text-2xl font-medium text-gray-900 title-font">
                  {isCurrentUser
                    ? '내가 방문한 수영장'
                    : `${
                        reviews.length > 0 && reviews[0].author_user_name
                      } 님이 방문한 수영장`}
                  <span className="inline-block bg-blue-500 text-white text-lg rounded-2xl px-2 py-0 ml-2">
                    {reviews.length}
                  </span>
                </p>
                {isCurrentUser && (
                  <Link
                    href={'/'}
                    className="flex items-center text-blue-500 text-sm mt-3 hover:text-gray-300"
                  >
                    <p className="mr-2">방문한 수영장 인증</p>
                    <ArrowIcon />
                  </Link>
                )}
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
