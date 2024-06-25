import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyC6wXhBHLfJrbtt1rJYN5OYALZR1PAaqCQ",
  authDomain: "project01-80eb1.firebaseapp.com",
  projectId: "project01-80eb1",
  storageBucket: "project01-80eb1.appspot.com",
  messagingSenderId: "708304216648",
  appId: "1:708304216648:web:dea2783bb3d914a7596e7d",
  measurementId: "G-9W4W29GWVQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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