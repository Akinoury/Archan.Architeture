export interface Project {
  id: string
  title: string
  description: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  garage: number
  floors: number
  image: string
  images?: string[]
  featured: boolean
  hero?: boolean
  category: 'residential' | 'commercial' | 'interior'
  tags: string[]
  currency?: 'BRL' | 'USD'
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  featured: boolean
  category?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface DevModeState {
  enabled: boolean
  editingId: string | null
  editableElements: Map<string, HTMLElement>
}

export interface SliderImage {
  id: string
  src: string
  alt: string
  projectId: string
}