// global user types => start
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  phones: Phone[];
  locations: Location[];
  profile_photo_path?: string | null;
  profile_photo_url?: string | null;
  email_verified_at: Date;
  date_of_birth: Date;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[];
}

export interface Phone {
  id: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}
// => end

// Drivers Types => start
export interface Driver {
  id: number;
  isOnline: boolean;
  isAvailable: boolean;
  region: Region;
  user: User;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: VehicleType;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleType {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// => end

// Zones Types => start
export interface City {
  id: number;
  name: string;
  is_active: boolean | 0 | 1;
  regions?: Region[];
}

export interface Region {
  id: number;
  name: string;
  city: City;
}
// => end

// Products Types => start

export interface Product {
  id: number;
  name: string;
  images: ProductImage[];
  price: string;
}

export interface ProductImage {
  id: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  background_color: string;
  text_color: string;
  variations?: ProductVariants[];
  parent?: ProductCategory | null;
  children?: ProductCategory[];
}

export interface ProductVariants {}
// => end

export interface Order {
  id: number;
  code: string;
  status: string;
  user: User;
  orderProducts: OrderProduct[];
  quantity: number;
  total: string;
  created_at: Date;
  store: Store;
  store_id: number;
  transaction: Transaction;
}

export interface Transaction {
  id: number;
  order: Order;
  amount: string;
  status: string;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderProduct extends Product {
  quantity: number;
  price_at_purchase: string;
}

export interface Store {
  id: number;
  name: string;
  description: string;
  image: string;
  cover_image: string;
  average_rating: number | string;
  number_of_ratings: number;
  number_of_followers: number;
  categories: Partial<ProductCategory>[];
  categories_string: string;
  location: Location;
  products: Product[];
}
