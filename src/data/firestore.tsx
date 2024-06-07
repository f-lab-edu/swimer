import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, Firestore, doc, setDoc } from "firebase/firestore";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEfwfZVfop11CCoXgP6weav8t6eGGvLxs",
  authDomain: "swimmer-d3ede.firebaseapp.com",
  projectId: "swimmer-d3ede",
  storageBucket: "swimmer-d3ede.appspot.com",
  messagingSenderId: "115755048806",
  appId: "1:115755048806:web:2fc7c8cb60f38b791172a7",
  measurementId: "G-YCEXF8262Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchReviewData() {
    const querySnapShot = await getDocs(collection(db, "review"));
    
    if(querySnapShot.empty){
        return [];
    }

    const fetchedData: { id: string; address: string; contents: string; name: string; }[] = [];

    querySnapShot.forEach((doc) => {
        // console.log(doc.id, " => " + doc.data()["contents"]) ;

        const reviewData = {
            id: doc.id,
            address: doc.data()["address"],
            contents: doc.data()["contents"],
            name: doc.data()["name"]
        }
        fetchedData.push(reviewData);
    }); 
    return fetchedData;
}

fetchReviewData();

export async function addDataToFirestore(data: string) {
    try {
        await setDoc(doc(db, "review"), {
            id: "5",
            name: "안성시수영장",
            address: "안성시",
            contents: data,
            user: "user1"
        });
        console.log('add 성공');
    } catch (error) {
        console.error('add 실패: ', error);
    }
}