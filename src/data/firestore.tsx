import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  User,
} from 'firebase/auth';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {ReviewData, TotalData} from '@/lib/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//mypage페이지 fetch함수
export async function fetchReviewByUserId(author_user_id: string) {
  try {
    const totalData: TotalData[] = [];
    // 1. 로그인한 사용자가 작성한 리뷰 읽어오기
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('author_user_id', '==', author_user_id),
    );

    const reviewsQuerySnapshot = await getDocs(reviewsQuery);

    if (reviewsQuerySnapshot.empty) {
      return [];
    }

    const reviewsData = reviewsQuerySnapshot.docs.map(
      doc => doc.data() as ReviewData,
    );

    // 2. reviewsData에 포함된 수영장 id 가져오기
    const swimmingpool_ids = reviewsData.map(review => review.swimmingpool_id);

    // 3. swimming_pools 컬렉션에서 수영장 데이터 가져오기
    const poolsQuery = query(
      collection(db, 'swimming_pools'),
      where('swimmingpool_id', 'in', swimmingpool_ids),
    );

    const swimmingpoolQuerySnapshot = await getDocs(poolsQuery);

    if (swimmingpoolQuerySnapshot.empty) {
      return [];
    }

    const swimmingpoolsData = swimmingpoolQuerySnapshot.docs.map(doc =>
      doc.data(),
    );

    // 4. 리뷰 데이터와 수영장 데이터 합치기
    const combinedData = reviewsData.map(review => {
      const matchingPool = swimmingpoolsData.find(
        pool => pool.swimmingpool_id === review.swimmingpool_id,
      );
      return {
        ...review,
        swimmingpool_name: matchingPool?.swimmingpool_name,
      };
    });

    totalData.push(...combinedData);

    return totalData;
  } catch (error) {
    console.error('Error fetching review data:', error);
    throw error;
  }
}

//detail페이지 fetch함수
// 수영장 id가 같은 전체 리뷰 가져오기(리뷰 내용,작성자 이름, 등록일자)
export async function fetchReviewsBySwimmingPoolId(swimmingpool_id: string) {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('swimmingpool_id', 'in', [swimmingpool_id]),
    );

    const reviewsQuerySnapshot = await getDocs(reviewsQuery);

    const reviewsData = reviewsQuerySnapshot.docs.map(
      doc => doc.data() as ReviewData,
    );

    return reviewsData;
  } catch (error) {
    console.error('Error fetching review data:', error);
    throw error;
  }
}

// 리뷰 많이 작성한 top3출력 - firebase의 쿼리(orderby) 이용해 보려했으나 실패.
export async function fetchCountUserReview() {
  try {
    const querySnapshot = await getDocs(collection(db, 'reviews'));

    const reviewCounts: {authorName: string; reviewCount: number}[] = [];

    querySnapshot.forEach(doc => {
      const reviews = doc.data();
      const authorName = reviews.author_user_name;

      const index = reviewCounts.findIndex(
        item => item.authorName === authorName,
      );

      if (index !== -1) {
        reviewCounts[index].reviewCount++;
      } else {
        reviewCounts.push({authorName, reviewCount: 1});
      }
    });

    return reviewCounts;
  } catch (error) {
    console.error('Error fetching review data:', error);
    throw error;
  }
}

interface AddData {
  id: string;
  name: string;
  address: string;
  content: string;
  user_data: User | null;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function addDataToFirestore(data: AddData) {
  const today = new Date();
  const formattedDate = formatDate(today);
  console.log(formattedDate);
  try {
    await Promise.all([
      addDoc(collection(db, 'reviews'), {
        swimmingpool_id: data.id,
        review_content: data.content,
        author_user_id: data.user_data?.uid,
        author_user_name: data.user_data?.displayName,
        reg_date: formattedDate,
      }),
      setDoc(doc(db, 'swimming_pools', data.id), {
        swimmingpool_id: data.id,
        swimmingpool_name: data.name,
        swimmingpool_address: data.address,
        reg_date: formattedDate,
      }),
    ]);

    console.log('add 성공');
  } catch (error) {
    console.error('add 실패: ', error);
  }
}

export function signUp(
  email: string,
  password: string,
  router: string[] | AppRouterInstance,
) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert('회원 가입 성공');
      console.log('userCredential: ' + userCredential);
      router.push('/');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        alert('이미 사용 중인 이메일 주소입니다.');
      } else {
        console.error('Firebase Error:', error.message);
        alert('다시 시도해주세요');
      }
    });
}

setPersistence(auth, browserSessionPersistence);

export function signIn(
  email: string,
  password: string,
  router: string[] | AppRouterInstance,
) {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert('로그인 성공');
      router.push('/');
      const user = userCredential.user;
      console.log('user: ' + user);
    })
    .catch(error => {
      console.error('Firebase Error:', error.message);
      alert('다시 시도해주세요');
    });
}

export function singOut() {
  auth.signOut();
}

export const authService = getAuth();
