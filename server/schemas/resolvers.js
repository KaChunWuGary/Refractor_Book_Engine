const {User} = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query:{
    me: async (parent,{ user = null, params }) => {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      });
      if (!foundUser) {
        console.log('Cannot find user')
        return null;
      } 
      return foundUser;
    }
  },
  Mutation: {
    login: async (parent,{body}) =>{
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
      if (!user) {
        throw new Error ("Can't find this user" );
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw new Error ('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent,body) => {
      console.log(body);
      const user = await User.create(body);

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, {input} ,context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        return AuthenticationError;
      }
    },
    removeBook: async (parent, {user, params}) =>{
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error ("Couldn't find user with this id!");
      }
      return updatedUser;
    }
  }
};

module.exports = resolvers;