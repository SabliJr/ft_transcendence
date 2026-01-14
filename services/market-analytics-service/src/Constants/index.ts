import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;
const CMC_API_KEY = process.env.CMC_API_KEY;
const CG_API_KEY = process.env.CG_API_KEY;

export { PORT, CMC_API_KEY, CG_API_KEY };