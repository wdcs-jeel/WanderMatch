import { gql } from "@apollo/client";

export const GET_Feedback = gql`
  query GetFeedbacks {
    feedbacks {
      id
      feedback
    }
  }
`;
export const ADD_FEEDBACK = gql`
  mutation addFeedback($feedback: String!) {
    addFeedback(feedback: $feedback) {
      id
      feedback
    }
  }
`;

export const EDIT_FEEDBACK = gql`
  mutation updateFeedback($id: ID!, $feedback: String!) {
    updateFeedback(id: $id, feedback: $feedback) {
      id
      feedback
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedback($id: ID!) {
    deleteFeedback(id: $id)
  }
`;