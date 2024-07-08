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
} from 'firebase/auth';
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {ReviewData} from '../lib/types';

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

export async function fetchReviewData(swimmingpool_id: string = '') {
  const reviewsData: ReviewData[] = [];
  const totalData: ReviewData[] = [];

  try {
    const reviewsQuery =
      swimmingpool_id === ''
        ? collection(db, 'reviews')
        : query(
            collection(db, 'reviews'),
            where('swimmingpool_id', 'in', [swimmingpool_id]),
          );

    const reviewsQuerySnapshot = await getDocs(reviewsQuery);
    const swimmingpoolQuerySnapshot = await getDocs(
      collection(db, 'swimming_pools'),
    );

    if (reviewsQuerySnapshot.empty || swimmingpoolQuerySnapshot.empty) {
      return [];
    }

    reviewsQuerySnapshot.forEach(doc => {
      const reviewData = {
        swimmingpool_id: doc.data()['swimmingpool_id'],
        swimmingpool_address: doc.data()['swimmingpool_address'],
        review_content: doc.data()['review_content'],
        swimmingpool_name: doc.data()['swimmingpool_name'],
        author_user_id: doc.data()['author_user_id'],
        author_user_name: doc.data()['author_user_name'],
        reg_date: doc.data()['reg_date'],
      };
      reviewsData.push(reviewData);
    });

    swimmingpoolQuerySnapshot.forEach(doc => {
      const poolData = {
        swimmingpool_id: doc.data()['swimmingpool_id'],
        swimmingpool_address: doc.data()['swimmingpool_address'],
        review_content: doc.data()['review_content'],
        swimmingpool_name: doc.data()['swimmingpool_name'],
        author_user_id: doc.data()['author_user_id'],
        author_user_name: doc.data()['author_user_name'],
        reg_date: doc.data()['reg_date'],
      };

      const matchingReview = reviewsData.find(
        review => review.swimmingpool_id === poolData.swimmingpool_id,
      );
      if (matchingReview) {
        const combinedData = {
          swimmingpool_id: matchingReview.swimmingpool_id,
          swimmingpool_address: poolData.swimmingpool_address,
          review_content: matchingReview.review_content,
          swimmingpool_name: poolData.swimmingpool_name,
          author_user_id: matchingReview.author_user_id,
          author_user_name: matchingReview.author_user_name,
          reg_date: matchingReview.reg_date,
        };
        totalData.push(combinedData);
      }
    });
    return totalData;
  } catch (error) {
    console.error('Error fetching review data:', error);
  }
}

interface AddData {
  id: string;
  name: string;
  address: string;
  content: string;
  user_id: string;
  user_name: string;
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
        author_user_id: data.user_id,
        author_user_name: data.user_name,
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
