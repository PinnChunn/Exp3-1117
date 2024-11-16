import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  createdAt: number;
  lastLoginAt: number;
  xp: number;
  registeredEvents: string[];
}

export const createUserProfile = async (user: {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}) => {
  try {
    const userRef = doc(db, 'users', user.id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const newUser: UserProfile = {
        ...user,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
        xp: 0,
        registeredEvents: []
      };
      await setDoc(userRef, newUser);
      return { user: newUser, error: null };
    }

    // Update last login time
    await updateDoc(userRef, {
      lastLoginAt: Date.now()
    });

    return { user: userDoc.data() as UserProfile, error: null };
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    return { user: null, error: 'Failed to create/update user profile' };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { user: null, error: 'User not found' };
    }

    return { user: userDoc.data() as UserProfile, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { user: null, error: 'Failed to fetch user profile' };
  }
};

export const updateUserXP = async (userId: string, xpAmount: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      xp: xpAmount
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating user XP:', error);
    return { error: 'Failed to update XP' };
  }
};