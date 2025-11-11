import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { handleInviteResponse, sendInvite } from "../controllers/inviteController";

const inviteRoutes = Router();

inviteRoutes.post('/send', verifyJWT, sendInvite as any);
inviteRoutes.post('/recieve/:token', verifyJWT, handleInviteResponse as any);


export default inviteRoutes;