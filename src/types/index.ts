// global user types => start
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  phones: Phone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Phone {
  id: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
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
