import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Vendor from "../models/vendor.js";

await mongoose.connect(process.env.MONGO_URI);

console.log("Seeding vendors...");
await Vendor.deleteMany({});
await Vendor.insertMany([
  { name: "AgriCorp Supplies", email: "agri@corp.com", phone: "9999990001", rating: 4.5 },
  { name: "FarmFresh Traders", email: "sales@farmfresh.com", phone: "9999990002", rating: 4.1 },
  { name: "SweetMills Pvt Ltd", email: "sales@sweetmills.com", phone: "9999990003", rating: 3.9 },
  { name: "PalmHarvest Co", email: "info@palmharvest.com", phone: "9999990004", rating: 4.3 }
]);
console.log("Done seeding vendors");
process.exit(0);
