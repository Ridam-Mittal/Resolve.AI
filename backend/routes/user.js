import { Router } from "express";
import { getUsers, login, signup, updateUser, logout, SelfUpdate } from "../controllers/user.js";
import { authenticate } from './../middlewares/auth.js';

const router = Router();


router.post('/signup', signup);

router.post('/login', login);

router.get('/logout', authenticate, logout);

router.post('/update-user', authenticate, updateUser);

router.get('/users', authenticate, getUsers);

router.post('/self-update', authenticate, SelfUpdate);



export default router;