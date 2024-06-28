import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

export async function fetchReviewData(id: string) {
    const querySnapShot = await getDocs(collection(db, id));

    if(querySnapShot.empty){
        return [];
    }

    const fetchedData: { id: string; address: string; contents: string; name: string; user: string; reg_date: string; }[] = [];

    querySnapShot.forEach((doc) => {

        const reviewData = {
            id: doc.data()["id"],
            address: doc.data()["address"],
            contents: doc.data()["contents"],
            name: doc.data()["name"],
            user: doc.data()["user"],
            reg_date: doc.data()["reg_date"]
        }
        fetchedData.push(reviewData);
    }); 
    return fetchedData;
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
        await setDoc(doc(db, data.id, uuidv4()), {
            id: data.id,
            name: data.name,
            address: data.address,
            contents: data.contents,
            user: data.user,
            reg_date: formattedDate
        });
        console.log('add 성공');
    } catch (error) {
        console.error('add 실패: ', error);
    }
}

export function signUp(email: string, password: string, router: string[] | AppRouterInstance){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("회원 가입 성공");
        console.log("userCredential: " + userCredential);
        router.push("/login");
    })
    .catch((error) => {
        if(error.code === 'auth/email-already-in-use'){
            alert('이미 사용 중인 이메일 주소입니다.');
        }else{
            console.error('Firebase Error:', error.message);
            alert("다시 시도해주세요");
        }
    });
}

export function signIn(email: string, password: string, router: string[] | AppRouterInstance){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        alert("로그인 성공");
        router.push("/");
        const user = userCredential.user;
        console.log("user: " + user);
    })
    .catch((error) => {
        console.error('Firebase Error:', error.message);
        alert("다시 시도해주세요");
    });
}

export const authService = getAuth();