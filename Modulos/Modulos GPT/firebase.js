import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query, limit, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlaMVBRQlulpV9MbVxasuGblF38KkY5f8",
  authDomain: "greek-bird.firebaseapp.com",
  projectId: "greek-bird",
  storageBucket: "greek-bird.appspot.com",
  messagingSenderId: "58870766246",
  appId: "1:58870766246:web:6eb9c796ec11abd0e5f267",
  measurementId: "G-PZBLWMH5W6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTopScores() {
  const scoresRef = collection(db, "scores");
  const q = query(scoresRef, orderBy("score", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  const topScores = [];
  querySnapshot.forEach((doc) => {
    topScores.push(doc.data());
  });
  return topScores;
}

export async function saveScore(name, score) {
  try {
    const topScores = await getTopScores();
    // Verifica se o novo score é maior que o menor no top 10
    if (topScores.length < 10 || score > topScores[topScores.length - 1].score) {
      await addDoc(collection(db, "scores"), {
        name: name,
        score: score
      });
      console.log("Score saved!");
    } else {
      console.log("Score too low to enter top 10.");
    }
  } catch (error) {
    console.error("Error saving score: ", error);
  }
}
