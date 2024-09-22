const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../database/mongodb");

class User {
  constructor(email, password, fullname, address, postal) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = address;
    this.postal = postal;
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);
    return db.getDatabase().collection("users").findOne({ _id: uid }, { projection: { password: 0 } }); // don't retreive password from db
  }

  getUserWithSameEmail() {
    return db
      .getDatabase()
      .collection("users")
      .findOne({ email: this.email });
  }

  hasCorrectPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDatabase().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address,
      postal: this.postal,
    });
  }
}

// You could export a class as well
module.exports = User;
