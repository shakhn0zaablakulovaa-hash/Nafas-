import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect, createContext, useContext } from "react";
import { UserProfile } from "../types";

// This will be populated by the set_up_firebase tool
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Set persistence explicitly to help with iframe stability
setPersistence(auth, browserLocalPersistence).catch(err => console.error("Persistence error", err));

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
// googleProvider removed as requested to remove Google Sign-In

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  completeProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Check for mock user in localStorage first
    const savedMockUser = localStorage.getItem('nafas_mock_user');
    if (savedMockUser) {
      const mockUserData = JSON.parse(savedMockUser);
      setUser(mockUserData as User);
      const savedProfile = localStorage.getItem('nafas_mock_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else if (!localStorage.getItem('nafas_mock_user')) {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      if (error.code === 'auth/admin-restricted-operation') {
        console.warn("Anonymous auth disabled in console. Using simulated session.");
        const mockUid = 'sim_' + Math.random().toString(36).substr(2, 9);
        const mockUser = {
          uid: mockUid,
          isAnonymous: true,
          displayName: 'Foydalanuvchi',
        } as User;
        setUser(mockUser);
        localStorage.setItem('nafas_mock_user', JSON.stringify(mockUser));
      } else {
        console.error("Sign in error", error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const completeProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      displayName: "Foydalanuvchi",
      nickname: data.nickname || "Anonim",
      role: data.role || 'user',
      region: data.region || 'Toshkent',
      phoneNumber: "",
      createdAt: serverTimestamp(),
      ...data
    };
    
    if (user.uid.startsWith('sim_')) {
      setProfile(newProfile);
      localStorage.setItem('nafas_mock_profile', JSON.stringify(newProfile));
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const signOut = async () => {
    await auth.signOut();
    localStorage.removeItem('nafas_mock_user');
    localStorage.removeItem('nafas_mock_profile');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isSigningIn, signIn, signOut, completeProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
