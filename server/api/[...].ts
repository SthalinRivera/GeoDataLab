import * as productController from "../controller/product";
import * as favoritesController from "../controller/favorites";
import * as userController from "../controller/user";
import * as categoryController from "../controller/category";
import * as roleController from "../controller/role";
import * as salesController from "../controller/sales";
import * as orderController from "../controller/order";
import * as promotionController from "../controller/promotion";

import * as dashboardController from "../controller/dashboard";
import * as visitController from "../controller/visit";
import * as reviewController from "../controller/garbageReport";
import * as incidentController from "../controller/incidentReport";

import { createRouter, defineEventHandler } from 'h3';
const router = createRouter();

router.get('/getAllGarbageReport', defineEventHandler(reviewController.getAllGarbageReport));
router.get('/getAllGarbageReportPhotos', defineEventHandler(reviewController.getAllGarbageReportPhotos));

router.post('/addGarbageReport', defineEventHandler(reviewController.addGarbageReport));


router.get('/getAllIncidentReport', defineEventHandler(incidentController.getAllIncidentReport));

router.post('/addIncidentReport', defineEventHandler(incidentController.addIncidentReport));

// 🧩 ROLES
router.get('/roles', defineEventHandler(roleController.allRole));
// 👤 User Routes (admin)
router.get('/users/clients', defineEventHandler(userController.getClients));

// 📦 Order Routes (admin)
router.patch('/orders/:id/status', defineEventHandler(orderController.updateOrderStatus));
router.get('/salesReport', defineEventHandler(salesController.salesReport));

router.get('/dashboardReport', defineEventHandler(dashboardController.dashboardReport));
router.get('/getVisits', defineEventHandler(visitController.getVisits));
router.post('/addVisit', defineEventHandler(visitController.addVisit));
router.get('/getVisitStats', defineEventHandler(visitController.getVisitStats));

// 👤 USUARIOS
router.get('/allUser', defineEventHandler(userController.allUser));
router.get('/userById/:id', defineEventHandler(userController.userById));
router.post('/addUser', defineEventHandler(userController.addUser));
router.put('/updateUser/:id', defineEventHandler(userController.updateUser));
router.put('/updateUserAvatar/:id', defineEventHandler(userController.updateUserAvatar));
router.put('/updateUserPhone/:id', defineEventHandler(userController.updateUserPhone));
router.delete('/userDelete/:id', defineEventHandler(userController.deleteUser));


export default useBase("/api/v1", router.handler);
