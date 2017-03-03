import User from '../models/user.model';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobile - The mobile of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User(req.body);
  delete user._id;
  user._id = null;
  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobile - The mobile of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.body;
  // user.username = req.body.username;
  // user.mobile = req.body.mobile;
  // user.save()
  //   .then(savedUser => res.json(savedUser))
  //   .catch(e => next(e));
  User.modify(req.body._id, user)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0
  } = req.query;
  User.list({
      limit,
      skip
    })
    .then(users => res.json({
      'total': 200,
      'per_page': 15,
      'current_page': 1,
      'last_page': 14,
      'next_page_url': 'http://localhost:4040/api/users?page=2',
      'prev_page_url': null,
      'from': 1,
      'to': 15,
      data: users
    }))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove
};
