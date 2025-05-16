export type TravelType = 'Solo Traveler' | 'Group Seeker' | 'Travel Funder' | 'Nomad';
export type LookingForOption = 'Romance' | 'Friendship' | 'Adventure Partners' | 'Local Guides';
export type TravelStyle = 'Luxury' | 'Budget' | 'Adventure' | 'Cultural' | 'Relaxation' | 'Foodie';

export const TRAVEL_TYPES: TravelType[] = ['Solo Traveler', 'Group Seeker', 'Travel Funder', 'Nomad'];
export const LOOKING_FOR_OPTIONS: LookingForOption[] = ['Romance', 'Friendship', 'Adventure Partners', 'Local Guides'];
export const TRAVEL_STYLE_OPTIONS: TravelStyle[] = ['Luxury', 'Budget', 'Adventure', 'Cultural', 'Relaxation', 'Foodie'];

export interface FormData {
    fullName: string;
    bio: string;
    travelType: string;
    lookingFor: string;
    travelStyle: string;
    languages: string;
  }

export interface getUser {
    _id: string;
}

export type Place = {
    _id: number,
    placeName: 'string',
    experience: 'string',
    travelWith: 'string',
    travelBy : 'string',
    userId : 'string'
};

export type ChatMessage = {
    text: string;
    isMine: boolean;
    status: 'sent' | 'delivered' | 'read';
    timestamp: string; // ISO or formatted string
  };

export interface ChatScreenProps {
    recipient: {
      id: number;
      name: string;
      avatar: string;
      online: boolean;
    };
    onBack: () => void;
    ws: WebSocket | null;
    userId: string;
    userName: string;
  }


 