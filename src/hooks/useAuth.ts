import { useEffect } from 'react';
import { onAuthChange } from '../services/firebase';
import { setUser } from '../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import { AuthUser } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        const u: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(u));
      } else {
        dispatch(setUser(null));
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return { user, loading, error };
};
