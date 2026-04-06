import { db } from "../utils/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where 
} from "firebase/firestore";

/**
 * Adds a new production to the database
 */
export const addProduction = async (prodData) => {
  try {
    // 1. Check if production with TITLE and SEASON already exists
    const q = query(
      collection(db, "productions"), 
      where("title", "==", prodData.title),
      where("season", "==", prodData.season)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("This production already exists for the selected season.");
    }

    // 2. Map fields EXPLICITLY to ensure no "createdAt" or extra data is added
    const cleanData = {
      title: prodData.title,
      composer: prodData.composer,
      librettist: prodData.librettist,
      language: prodData.language,
      season: prodData.season,
      year: prodData.year,
      duration: prodData.duration,
      prodId: prodData.prodId
    };

    // 3. Add to Firestore
    const docRef = await addDoc(collection(db, "productions"), cleanData);
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

/**
 * Logic for fetching seasons
 */
export const getSeasons = async () => {
  const querySnapshot = await getDocs(collection(db, "seasons"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};