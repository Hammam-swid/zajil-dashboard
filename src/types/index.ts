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
  variations?: ProductVariation[];
  parent?: ProductCategory | null;
  children?: ProductCategory[];
}

export interface ProductVariation {}
// => end

export interface Order {
  id: number;
  code: string;
  status: string;
  user: User;
  products: Product[];
  quantity: number;
  total: string;
  created_at: Date;
  store: Store;
}

export interface Store {
  id: number;
  name: string;
  description: string;
  image: string;
  average_rating: number | string;
  number_of_ratings: number;
  number_of_followers: number;
  categories: Partial<ProductCategory>[];
  categories_string: string;
  location: Location;
  products: Product[];
}
