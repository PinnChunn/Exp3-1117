import { auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { createUserProfile, getUserProfile } from './users';

export const signInWithGoogle = async () => {
  try {
    // Try popup first
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const { user: userProfile, error: profileError } = await createUserProfile({
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        });

        if (profileError) {
          throw new Error(profileError);
        }

        return { user: userProfile, error: null };
      }
    } catch (popupError: any) {
      // If popup is blocked, fall back to redirect
      if (popupError.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null }; // Will handle redirect result separately
      }
      throw popupError; // Re-throw other errors
    }
    
    return { user: null, error: 'No user data received' };
  } catch (error: any) {
    console.error('Sign-in error:', error);
    if (error.code === 'auth/unauthorized-domain') {
      return {
        user: null,
        error: 'This domain is not authorized for authentication. Please contact support.'
      };
    }
    return {
      user: null,
      error: 'Unable to start authentication. Please try again.'
    };
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      const { user: userProfile, error: profileError } = await createUserProfile({
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL
      });

      if (profileError) {
        throw new Error(profileError);
      }

      return { user: userProfile, error: null };
    }
    return { user: null, error: null };
  } catch (error: any) {
    console.error('Redirect result error:', error);
    return {
      user: null,
      error: 'Authentication failed. Please try again.'
    };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: 'Failed to sign out. Please try again.' };
  }
};

export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        const { user: userProfile } = await getUserProfile(user.uid);
        resolve(userProfile || {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL
        });
      } else {
        resolve(null);
      }
    });
  });
};