// resolvers.js
const Feedback = require('../models/Feedback');

const resolvers = {
  Query: {
    feedbacks: async () => await Feedback.find(),
  },
  Mutation: {
    addFeedback: async (_, { feedback}) => {
      const feedback1 = new Feedback({ feedback });
      return await feedback1.save();
    },
    deleteFeedback: async (_, { id }) => {
        await Feedback.findByIdAndDelete(id);
        return true;
      },
    updateFeedback: async (_, { id, feedback }) => {
      // Update logic (using, for example, Mongoose)
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        id,
        { feedback },
        { new: true }
      );
      return updatedFeedback;
    },
  },
};

module.exports = resolvers;
