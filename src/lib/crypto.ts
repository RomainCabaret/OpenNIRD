import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

export const encryptData = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): object | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Échec de déchiffrement ou données corrompues :", error);
    return null;
  }
};

export const saveToLocalStorage = (key: string, data: object) => {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

export const loadFromLocalStorage = (key: string): object | null => {
  const encryptedData = localStorage.getItem(key);
  if (!encryptedData) return null;
  return decryptData(encryptedData);
};
