// dashboard.js
import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const slotsCol = collection(db, "slots");
const slotList = document.getElementById("slotsList");

// Listen to slots in real-time
const q = query(slotsCol, orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  slotList.innerHTML = "";
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    slotList.appendChild(li);
  });
});

// Add a slot
document.getElementById("addSlotForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newSlot = document.getElementById("slotInput").value;
  await addDoc(slotsCol, {
    text: newSlot,
    timestamp: serverTimestamp()
  });
  document.getElementById("slotInput").value = "";
});
