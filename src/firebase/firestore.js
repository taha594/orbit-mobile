import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "./config";

const QUICK_ACTIONS_COLLECTION = "quickActions";

export const saveQuickAction = async (quickAction) => {
  const docRef = await addDoc(collection(db, QUICK_ACTIONS_COLLECTION), {
    ...quickAction,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...quickAction };
};

export const fetchQuickActionsByUser = async (userId) => {
  const quickActionsQuery = query(
    collection(db, QUICK_ACTIONS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(quickActionsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
