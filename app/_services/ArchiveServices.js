// app/_services/ArchiveServices.js
import { db } from "../utils/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  limit 
} from "firebase/firestore";

/**
 * Adds a new production to the database
 * Checks for existing production by name to prevent duplicates
 */
export const addProduction = async (prodData) => {
  try {
    // Basic duplicate check logic
    const q = query(
      collection(db, "productions"), 
      where("name", "==", prodData.name)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("This production already exists in the archive.");
    }

    const docRef = await addDoc(collection(db, "productions"), {
      ...prodData,
      createdAt: new Date(),
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

/**
 * Searches productions by name (exact match for prototype)
 */
export const getProductions = async (searchQuery) => {
  try {
    const productionsRef = collection(db, "productions");
    // For a prototype, we use an exact match or a simple prefix query.
    const q = query(
      productionsRef, 
      where("name", "==", searchQuery)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { results, error: null };
  } catch (error) {
    return { results: [], error: error.message };
  }
};