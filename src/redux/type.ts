export interface User {
    _id: string;
    email: string;
    fullName: string;
    dateOfBirth?: string;
    bio?: string;
    interests: string[];
    travelType?: string;
    lookingFor?: string[];
    travelStyle?: string[];
    topDestinations?: string[];
    languages?: string[];
    identityVerified: boolean;
    identityDocument: {
      data: string; // base64 string
      contentType: string;
    };
    profilePhotos: Array<{
      data: string; // base64 string
      contentType: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }
  
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    error: string | null;
  }
  
export interface Trip {
    _id: number;
    placeName: string;
    experience: string;
    travelWith: string;
    travelBy: string;
    userId: string;
    // add any other fields as needed
}

export interface TripState {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  tripAdded: boolean;
}
