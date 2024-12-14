export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: string;
  authorName?: string;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
}