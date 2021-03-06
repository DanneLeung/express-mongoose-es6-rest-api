import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  }, // match: [/^1[0-9]{12}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'] 
  email: {
    type: String
  },
  password: {
    type: String
  },
  // match: [/^1[0-9]{12}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
  enabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
  modify(id, update) {
    return this.findByIdAndUpdate(id, update, {
      new: true
    }).exec().then((updateUser) => {
      global.console.log('********', updateUser);
      if (updateUser) {
        return updateUser;
      }
      const err = new APIError('Error while updating user!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  findByUsername(username) {
    return this.findOne({
      "username": username
    }).exec().then((user) => {
      if (user) {
        return user;
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    skip = 0,
    limit = 50
  } = {}) {
    return this.find()
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
