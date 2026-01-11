import { Router } from "express";
import bodyParser from "body-parser";
import {
  onWriteWebContent,
  onTranslate,
  onWrite,
  onHumannize,
} from "../controllers/servicesController";

const router = Router();

router.post("/humanize", onHumannize); // to humanize ai written text
router.get("/write", onWrite); // write human-like with ai
router.get("/translate", onTranslate); // context-awear translation 
router.get("/webcontent", onWriteWebContent); // write blogs/articls with ai that sound human

export default router;
