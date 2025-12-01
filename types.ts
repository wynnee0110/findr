export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND'
}

export enum ItemStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING', // Waiting for claim approval
  RESOLVED = 'RESOLVED'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  type: ItemType;
  status: ItemStatus;
  location: string;
  date: string;
  imageUrl: string;
  contactName: string;
  category: string;
  reporterId: string; // User who reported it
  isVerified: boolean; // Staff verification status
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  date: string;
  relatedItemId?: string;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  proofDescription: string;
}

export type FilterType = 'ALL' | ItemType;

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "ID/Cards",
  "Keys",
  "Books/Notes",
  "Accessories",
  "Other"
];