import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (username: string, password: string, fullName: string, parentPhone: string, teacherPhone: string, studentClass?: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uevazerjmlznnotnyvcj.supabase.co';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has token in localStorage
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user_profile');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setUserProfile(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
      }
    }

    setLoading(false);
  }, []);

  const signUp = async (
    username: string,
    password: string,
    fullName: string,
    parentPhone: string,
    teacherPhone: string,
    studentClass: string = ''
  ) => {
    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        password_hash: passwordHash,
        full_name: fullName,
        parent_phone: parentPhone,
        teacher_phone: teacherPhone,
        student_class: studentClass,
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: newUser.id,
        token: crypto.randomUUID(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (sessionError) throw new Error(sessionError.message);

    localStorage.setItem('auth_token', session.token);
    localStorage.setItem('user_profile', JSON.stringify(newUser));

    setUser(newUser);
    setUserProfile(newUser);
  };

  const signIn = async (username: string, password: string) => {
    // Hash password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Find user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', passwordHash)
      .limit(1);

    if (userError || !users || users.length === 0) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const user = users[0];

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        token: crypto.randomUUID(),
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (sessionError) throw new Error(sessionError.message);

    localStorage.setItem('auth_token', session.token);
    localStorage.setItem('user_profile', JSON.stringify(user));

    setUser(user);
    setUserProfile(user);
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

