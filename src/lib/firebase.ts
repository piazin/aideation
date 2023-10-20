// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'aideation-6abfe.firebaseapp.com',
  projectId: 'aideation-6abfe',
  storageBucket: 'aideation-6abfe.appspot.com',
  messagingSenderId: '354302532225',
  appId: '1:354302532225:web:e23cf549e4947653dacb80',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFileToFirebase(imageUrl: string, name: string) {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const fileName = name.replace(' ', '') + Date.now() + '.jpeg';
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, buffer, {
      contentType: 'image/jpeg',
    });
    const firebaseUrl = await getDownloadURL(storageRef);
    return firebaseUrl;
  } catch (error) {
    console.error(error);
  }
}
