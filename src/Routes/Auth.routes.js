import { Router } from 'express';
import { createUser, login} from "../Controllers/AuthController.js";

const router = Router();

//ruta
router.post("/api/users", createUser);
router.post("/api/login", login);

export default router