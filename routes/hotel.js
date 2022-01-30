import express from "express";
import { create, hotels, image, sellerHotels, remove, read, searchListings, update } from "../controllers/hotel";
import formidable from  "express-formidable";
import {requireSignin, hotelOwner} from '../middlewares/index'

const router = express.Router();


router.post("/create-hotel", requireSignin,  formidable(), create);
router.get("/hotels", hotels);
router.get("/hotel/image/:hotelId", image);
router.get("/seller-hotels", requireSignin, sellerHotels);
router.delete("/delete-hotel/:hotelId", requireSignin, hotelOwner, remove);
router.get("/hotel/:hotelId", read);
router.put("/update-hotel/:hotelId", requireSignin, formidable(), hotelOwner, update);
router.post("/search-listings", searchListings);











// export default router;
module.exports = router;