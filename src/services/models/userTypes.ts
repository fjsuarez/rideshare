export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureURL?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted: boolean;
  userType: "rider" | "driver";
  driver?: DriverDetails;
}

export interface DriverDetails {
  licenseNumber: string;
  isActive: boolean;
  vehicles: Vehicle[];
}

export interface Vehicle {
  vehicleId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  capacity: number;
}

export interface OnboardingData {
  isDriver: boolean;
  userType?: "rider" | "driver";
  driverDetails?: DriverDetails;
}
