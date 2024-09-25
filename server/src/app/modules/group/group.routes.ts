import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { GroupValidation } from './group.validations';
import { GroupController } from './group.controller';

const router = express.Router();

//! create Account ------------------------->>>

router.post(
  '/',
  // auth(UserRoles.ADMIN, UserRoles.SUPERADMIN),
  validateRequest(GroupValidation.addGroup),
  GroupController.createGroup
);

// !  get all Users ------------------------------>>>
router.get(
  '/',
  // auth(UserRoles.ADMIN, UserRoles.SUPERADMIN),
  GroupController.getAllGroups
);

router.get('/trialBalance', GroupController.getTrialBalance);

export const GroupRoutes = router;
