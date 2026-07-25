import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Hotel } from "../src/models/Hotel.js";
import { Review } from "../src/models/Review.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hotels = Hotel.findAll({}).map((h) => ({
  ...h,
  reviews: Review.findByHotel(h.id),
}));

const outPath = path.join(__dirname, "../../client/src/demoData.json");
fs.writeFileSync(outPath, JSON.stringify(hotels, null, 2));
console.log(`Exported ${hotels.length} hotels to client/src/demoData.json`);
