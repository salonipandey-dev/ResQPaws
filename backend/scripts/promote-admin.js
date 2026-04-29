require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const run = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: node scripts/promote-admin.js <email>");
    process.exit(1);
  }

  try {
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`${user.email} is already an admin.`);
      process.exit(0);
    }

    const previousRole = user.role;
    user.role = "admin";
    await user.save();

    console.log(`Promoted ${user.email} from "${previousRole}" to "admin".`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to promote user:", err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();