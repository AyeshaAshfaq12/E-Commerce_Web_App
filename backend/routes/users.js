/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to users
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Requires Admin role. Creates a new user.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized - invalid token or insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Requires Admin or Store Operator role. Retrieves a list of all users.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid token or insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Requires Admin or Store Operator role. Retrieves user details by ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - invalid token or insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Requires Admin role. Updates user details by ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized - invalid token or insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Requires Admin role. Deletes a user by ID.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - invalid token or insufficient role
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login
 *     description: Logs in a user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized - invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout
 *     description: Logs out a user.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUserById,
  loginUser,
  logoutUser,
} = require("../controllers/users.js");
const {
  validateToken,
  requireRoles,
} = require("../middleware/authorization.js");
const {
  checkDuplicateUsernameOrEmail,
} = require("../middleware/verifySignUp.js");

router
  .route("/users")
  .post(validateToken, requireRoles(["Admin"]), createUser)
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getAllUsers);
router
  .route("/users/:id")
  .get(validateToken, requireRoles(["Admin", "Store Operator"]), getUserById)
  .put(validateToken, requireRoles(["Admin"]), updateUser)
  .delete(validateToken, requireRoles(["Admin"]), deleteUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
