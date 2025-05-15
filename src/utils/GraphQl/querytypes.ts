import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: 'http://192.168.109.128:3000/graphql', // Use LAN IP like http://192.168.X.X:3000 if needed
  cache: new InMemoryCache(),
});

//display feedback
interface Feedback {
    id: string;
    feedback: string;
  }
export interface FeedbackData {
    feedbacks: Feedback[];
}

//add feedback
export interface AddFeedbackVars {
    feedback: string;
}
export interface AddFeedbackData {
    addFeedback: {
    id: string;
    feedback: string;
  };
}

//update feedback
export interface UpdateFeedbackVars {
  id: string;
  feedback: string;
}
export interface UpdateFeedbackData {
  updateFeedback: {
    id: string;
    feedback: string;
  };
}