import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const QUICK_ACTIONS_COLLECTION = "quickActions";

export const quickActionExists = async (
  userId: string,
  date: string,
  type: string,
) => {
  const q = query(
    collection(db, QUICK_ACTIONS_COLLECTION),
    where("userId", "==", userId),
    where("date", "==", date),
    where("type", "==", type),
    limit(1),
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const createQuickAction = async (quickAction: any) => {
  const { id, ...payload } = quickAction;
  if (!payload.userId) {
    throw new Error("userId is required to create a quick action.");
  }

  const docRef = await addDoc(collection(db, QUICK_ACTIONS_COLLECTION), {
    ...payload,
    status: payload.status || "pending",
    reason: payload.reason || payload.details?.reason || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...payload,
    status: payload.status || "pending",
    reason: payload.reason || payload.details?.reason || "",
  };
};

export const updateQuickAction = async (id: string, updates: any) => {
  const ref = doc(db, QUICK_ACTIONS_COLLECTION, id);
  const payload = {
    ...updates,
    reason: updates.reason || updates.details?.reason || updates.reason,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(ref, payload);
  return { id, ...updates, reason: payload.reason };
};

export const deleteQuickAction = async (id: string) => {
  const ref = doc(db, QUICK_ACTIONS_COLLECTION, id);
  await deleteDoc(ref);
};

export const getQuickActionsByUser = async (userId: string) => {
  const q = query(
    collection(db, QUICK_ACTIONS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
