import express from 'express';
import propertyController from '../controllers/propertyController.js'
import checkUserAuth from '../middlewares/auth-middleware.js'

const router = express.Router();

//Middleware
router.use('/add_property', checkUserAuth)
router.use('/get_user', checkUserAuth)
router.use('/update_property/:id', checkUserAuth)
router.use('/delete_property/:id', checkUserAuth)

//PUBLIC ROUTES
router.get('/get',propertyController.getAllProperty)

//PROTECTED ROUTES
router.post('/add_property',propertyController.postProperty)
router.get('/get_user',propertyController.getPropertyByUser)
router.put('/update_property/:id',propertyController.updateProperty)
router.delete('/delete_property/:id',propertyController.deleteProperty)

export default router