import { Item, ItemType, ItemStatus, User, UserRole, Notification, Claim } from '../types';

// --- MOCK DATA STORE ---

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Kent Jasper Sisi',
    email: 'kntjspr26@ustp.edu.ph',
    role: UserRole.STUDENT,
    avatarUrl: '/kent.jpg'
  },
  {
    id: 'staff-1',
    name: 'John Doe',
    email: 'admin@ustp.edu.ph',
    role: UserRole.STAFF,
    avatarUrl: 'https://i.pravatar.cc/150?u=staff-1'
  }
];

let MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Blue Hydroflask',
    description: 'Left it near the Science Complex benches. Has a sticker of a cat.',
    type: ItemType.LOST,
    status: ItemStatus.OPEN,
    location: 'Science Complex',
    date: '2023-10-25',
    imageUrl: 'https://irunsg.com/cdn/shop/files/W32BTS678_Hydro_Flask_Wide_32_Trillium_101466_1__74139.1707338107_1024x1024.jpg?v=1710988547',
    contactName: 'Kent Jasper Sisi',
    category: 'Accessories',
    reporterId: 'user-1',
    isVerified: true
  },
  {
    id: '2',
    title: 'Casio Scientific Calculator',
    description: 'Found in Room 304, under the teacher\'s desk.',
    type: ItemType.FOUND,
    status: ItemStatus.OPEN,
    location: 'Building 3, Rm 304',
    date: '2023-10-26',
    imageUrl: 'https://m.media-amazon.com/images/I/811iKa+ingL._AC_UF350,350_QL80_.jpg',
    contactName: 'Jane Smith',
    category: 'Electronics',
    reporterId: 'user-2',
    isVerified: true
  },
  {
    id: '3',
    title: 'Student ID (Ending 1234)',
    description: 'Found near the main cafeteria entrance.',
    type: ItemType.FOUND,
    status: ItemStatus.PENDING,
    location: 'Cafeteria',
    date: '2023-10-24',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    contactName: 'Admin',
    category: 'ID/Cards',
    reporterId: 'staff-1',
    isVerified: true
  },
  {
    id: '4',
    title: 'Beige Totebag',
    description: 'Contains notebooks and a pencil case. Lost probably in the library.',
    type: ItemType.LOST,
    status: ItemStatus.OPEN,
    location: 'Library 2nd Floor',
    date: '2023-10-27',
    imageUrl: 'hhttps://contents.mediadecathlon.com/p2739547/k$3b2a45803f6914ec857b164bbea0f124/25-l-multisport-suede-effect-tote-bag-beige-decathlon-8873798.jpg?f=1920x0&format=auto',
    contactName: 'Mike Ross',
    category: 'Accessories',
    reporterId: 'user-3',
    isVerified: false // Pending verification
  }
];

let MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    userId: 'user-1',
    title: 'Potential Match Found',
    message: 'A "Blue Water Bottle" was found near Science Complex that matches your lost item report.',
    isRead: false,
    date: '2023-10-26T10:00:00Z',
    relatedItemId: '2'
  }
];

let MOCK_CLAIMS: Claim[] = [];

// --- HELPERS ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- AUTH SERVICES ---

export const loginUser = async (role: UserRole): Promise<User> => {
  await delay(800);
  return role === UserRole.STAFF ? MOCK_USERS[1] : MOCK_USERS[0];
};

// --- ITEM SERVICES ---

export const getItems = async (filters?: {
  category?: string;
  startDate?: string;
  endDate?: string;
  query?: string;
  isVerified?: boolean;
}): Promise<Item[]> => {
  await delay(500);

  return MOCK_ITEMS.filter(item => {
    // Staff might want to see unverified items, regular users only verified
    if (filters?.isVerified !== undefined && item.isVerified !== filters.isVerified) return false;

    // Category Filter
    if (filters?.category && item.category !== filters.category) return false;

    // Date Range Filter
    if (filters?.startDate && new Date(item.date) < new Date(filters.startDate)) return false;
    if (filters?.endDate && new Date(item.date) > new Date(filters.endDate)) return false;

    // Search Query
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  await delay(300);
  return MOCK_ITEMS.find(item => item.id === id);
};

export const createItem = async (newItem: Omit<Item, 'id' | 'status' | 'isVerified'>): Promise<Item> => {
  await delay(1000);

  const item: Item = {
    ...newItem,
    id: Math.random().toString(36).substr(2, 9),
    status: ItemStatus.OPEN,
    isVerified: false // Default to unverified for regular users
  };

  MOCK_ITEMS.unshift(item); // Add to top

  // --- NOTIFICATION SYSTEM LOGIC ---
  // If a FOUND item is reported, look for matching LOST items (and vice versa)
  const potentialMatches = MOCK_ITEMS.filter(existing =>
    existing.id !== item.id &&
    existing.type !== item.type && // Opposite type
    existing.category === item.category && // Same category
    (existing.title.toLowerCase().includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(existing.title.toLowerCase())) // Simple keyword match
  );

  potentialMatches.forEach(match => {
    MOCK_NOTIFICATIONS.unshift({
      id: Math.random().toString(36).substr(2, 9),
      userId: match.reporterId,
      title: 'New Item Match!',
      message: `A new ${item.type.toLowerCase()} item "${item.title}" might match your report.`,
      isRead: false,
      date: new Date().toISOString(),
      relatedItemId: item.id
    });
  });

  return item;
};

// --- USER SERVICES ---

export const getUserItems = async (userId: string): Promise<Item[]> => {
  await delay(500);
  return MOCK_ITEMS.filter(item => item.reporterId === userId);
};

export const getUserClaims = async (userId: string): Promise<{ claim: Claim, item: Item }[]> => {
  await delay(500);
  const userClaims = MOCK_CLAIMS.filter(c => c.claimantId === userId);
  return userClaims.map(claim => {
    const item = MOCK_ITEMS.find(i => i.id === claim.itemId)!;
    return { claim, item };
  });
};

// --- NOTIFICATION SERVICES ---

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  await delay(400);
  return MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
};

export const markNotificationRead = async (id: string): Promise<void> => {
  const note = MOCK_NOTIFICATIONS.find(n => n.id === id);
  if (note) note.isRead = true;
};

// --- STAFF / CLAIM SERVICES ---

export const submitClaim = async (itemId: string, userId: string, proof: string): Promise<void> => {
  await delay(600);
  const user = MOCK_USERS.find(u => u.id === userId);
  MOCK_CLAIMS.push({
    id: Math.random().toString(36).substr(2, 9),
    itemId,
    claimantId: userId,
    claimantName: user?.name || 'Unknown',
    status: 'PENDING',
    date: new Date().toISOString(),
    proofDescription: proof
  });

  // Update item status
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  if (item) item.status = ItemStatus.PENDING;
};

export const verifyItem = async (itemId: string): Promise<void> => {
  await delay(400);
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  if (item) item.isVerified = true;
};

export const rejectItem = async (itemId: string): Promise<void> => {
  await delay(400);
  MOCK_ITEMS = MOCK_ITEMS.filter(i => i.id !== itemId);
};

export const markAsResolved = async (itemId: string): Promise<void> => {
  await delay(400);
  const item = MOCK_ITEMS.find(i => i.id === itemId);
  if (item) item.status = ItemStatus.RESOLVED;
};

export const getPendingClaims = async (): Promise<{ claim: Claim, item: Item }[]> => {
  await delay(500);
  const pending = MOCK_CLAIMS.filter(c => c.status === 'PENDING');
  return pending.map(claim => ({
    claim,
    item: MOCK_ITEMS.find(i => i.id === claim.itemId)!
  }));
};

export const processClaim = async (claimId: string, approved: boolean): Promise<void> => {
  await delay(500);
  const claim = MOCK_CLAIMS.find(c => c.id === claimId);
  if (claim) {
    claim.status = approved ? 'APPROVED' : 'REJECTED';

    const item = MOCK_ITEMS.find(i => i.id === claim.itemId);
    if (item) {
      if (approved) {
        item.status = ItemStatus.RESOLVED;
      } else {
        item.status = ItemStatus.OPEN; // Reopen if rejected
      }
    }
  }
};