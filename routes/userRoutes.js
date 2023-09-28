import express from 'express';
import userController from '../controllers/userController.js'
import checkUserAuth from '../middlewares/auth-middleware.js'

const router = express.Router();

//Middleware
router.use('/changepassword', checkUserAuth)

//PUBLIC ROUTES
router.post('/register',userController.userRegistration)
router.post('/login',userController.userLogin)

//PROTECTED ROUTES
router.post('/changepassword',userController.userChangePassword)

export default router