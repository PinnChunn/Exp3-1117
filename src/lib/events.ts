import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc } from 'firebase/firestore';

export interface Event {
  id?: string;
  title: string;
  date: string;
  time: string;
  format: string;
  attendeeLimit: number;
  price?: number;
  xp?: number;
  description: string;
  skills: string[];
  imageUrl: string;
  learningOutcomes: string[];
  requirements: string[];
  instructor: {
    name: string;
    role: string;
    avatar: string;
    description: string;
    stats: {
      courses: number;
      articles: number;
      students: number;
    };
    linkedin?: string;
    email?: string;
    medium?: string;
    website?: string;
    expertise: string[];
  };
  registeredUsers?: string[];
}

export const addEvent = async (event: Event) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), event);
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: 'Failed to add event' };
  }
};

export const getEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
    return { events, error: null };
  } catch (error) {
    return { events: [], error: 'Failed to fetch events' };
  }
};

export const getEvent = async (id: string) => {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { event: { id: docSnap.id, ...docSnap.data() } as Event, error: null };
    } else {
      return { event: null, error: 'Event not found' };
    }
  } catch (error) {
    return { event: null, error: 'Failed to fetch event' };
  }
};

export const registerForEvent = async (eventId: string, userId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (!eventDoc.exists()) {
      return { error: 'Event not found' };
    }

    const event = eventDoc.data() as Event;
    const registeredUsers = event.registeredUsers || [];

    if (registeredUsers.includes(userId)) {
      return { error: 'Already registered for this event' };
    }

    await updateDoc(eventRef, {
      registeredUsers: [...registeredUsers, userId]
    });

    return { error: null };
  } catch (error) {
    return { error: 'Failed to register for event' };
  }
};

export const getUserEvents = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'events'),
      where('registeredUsers', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
    
    return { events, error: null };
  } catch (error) {
    return { events: [], error: 'Failed to fetch user events' };
  }
};