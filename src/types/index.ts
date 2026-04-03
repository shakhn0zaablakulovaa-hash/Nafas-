export interface UserProfile {
  uid: string;
  displayName: string;
  nickname: string;
  photoURL?: string;
  role: 'user' | 'admin';
  region: string;
  phoneNumber?: string;
  createdAt: any;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string; // "Anonim" or real if expert
  content: string;
  category: 'legal' | 'psychological' | 'support' | 'success';
  likesCount: number;
  repliesCount: number;
  createdAt: any;
}

export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  price: number;
  rating: number;
}
