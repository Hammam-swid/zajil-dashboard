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
  date_of_birth: Date | string;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[];
  vehicles?: Vehicle[];
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
  passport: string | File;
  driving_license: string | File;
  clearance_form: string | File;
  vehicles: Vehicle[];
  earnings?: Wallet;
  debits?: Wallet;
}

export interface Vehicle {
  id: number;
  plate_no: string;
  model: string;
  name: string;
  vin: string;
  year: string;
  document: string;
  vehicle_type: VehicleType;
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
  city_id: number;
  is_active: boolean | 0 | 1;
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
  url: string;
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
  variations?: Variation[];
  parent?: ProductCategory | null;
  children?: ProductCategory[];
}

export interface Variation {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  options?: Option[];
}

export interface Option {
  id: number;
  value: string;
  variation_id: number;
  createdAt: Date;
  updatedAt: Date;
}
// => end

export interface Order {
  id: number;
  code: string;
  user: User;
  orderProducts: OrderProduct[];
  quantity: number;
  total: string;
  created_at: Date;
  store: Store;
  store_id: number;
  transaction: Transaction;
  status: OrderStatus;
}

export interface OrderStatus {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  amount: string;
  status: "عملية ناجحة" | "عملية فاشلة";
  description: string;
  wallet_type: string;
  reference: string;
  receiver_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface InternalTransaction {
  id: number;
  amount: string;
  status: string;
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
  background_image: string;
  average_rating: number | string;
  number_of_ratings: number;
  number_of_followers: number;
  categories: Partial<ProductCategory>[];
  categories_string: string;
  location: Location;
  wallet: Wallet;
  products: Product[];
  user: Partial<User> & { seller: Seller };
}

export interface StoreTransaction {
  id: number;
  amount: string;
  status: "عملية ناجحة" | "قيد الانتظار" | "عملية فاشلة";
  updated_at: Date;
  description: string;
  wallet_id: number;
  reference: string;
}

export interface Seller {
  id: number;
  commercial_register: string;
  trade_license: string;
  passport: string;
}

export interface Wallet {
  id: number;
  balance: number;
  wallet_type_id: number;
  wallet_type: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  image: string | File;
  is_active: boolean;
  is_for_customers: boolean | 0 | 1;
}

export interface Banner {
  id: number;
  title: string;
  image: string | File;
  is_active: boolean | 0 | 1;
}
