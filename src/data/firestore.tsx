import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
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
  const swimmingpoolData: ReviewData[] = [];
  const totalData: ReviewData[] = [];

  const reviewsQuerySnapshot = await getDocs(collection(db, 'reviews'));
  const swimmingpoolQuerySnapshot = await getDocs(
    collection(db, 'swimming_pools'),
  );

  if (reviewsQuerySnapshot.empty || swimmingpoolQuerySnapshot.empty) {
    return [];
  }

  reviewsQuerySnapshot.forEach(doc => {
    if (
      swimmingpool_id === '' ||
      doc.data()['swimmingpool_id'] === swimmingpool_id
    ) {
      const reviewData = {
        swimmingpool_id: doc.data()['swimmingpool_id'],
        swimmingpool_address: doc.data()['address'],
        review_content: doc.data()['review_content'],
        swimmingpool_name: doc.data()['name'],
        author_user_id: doc.data()['author_user_id'],
        reg_date: doc.data()['reg_date'],
      };
      reviewsData.push(reviewData);
    }
  });

  swimmingpoolQuerySnapshot.forEach(doc => {
    const poolData = {
      swimmingpool_id: doc.data()['swimmingpool_id'],
      swimmingpool_address: doc.data()['address'],
      review_content: doc.data()['review_content'],
      swimmingpool_name: doc.data()['name'],
      author_user_id: doc.data()['author_user_id'],
      reg_date: doc.data()['reg_date'],
    };
    swimmingpoolData.push(poolData);
  });

  reviewsData.forEach(review => {
    const matchingPool = swimmingpoolData.find(pool => {
      return pool.swimmingpool_id === review.swimmingpool_id;
    });
    if (matchingPool) {
      const combinedData = {
        swimmingpool_id: review.swimmingpool_id,
        swimmingpool_address: matchingPool.swimmingpool_address,
        review_content: review.review_content,
        swimmingpool_name: matchingPool.swimmingpool_name,
        author_user_id: review.author_user_id,
        reg_date: review.reg_date,
      };
      totalData.push(combinedData);
    }
  });
  return totalData;
}

interface AddData {
  id: string;
  name: string;
  address: string;
  contents: string;
  user: string;
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
        review_content: data.contents,
        author_user_id: data.user,
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
