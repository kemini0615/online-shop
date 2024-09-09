const bcrypt = require("bcryptjs");

const mongodb = require("../database/mongodb");

class User {
  constructor(email, password, fullname, address, postal) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.address = address;
    this.postal = postal;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await mongodb.getDatabase().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      fullname: this.fullname,
      address: this.address,
      postal: this.postal
    });
  }
}

// You could export a class as well
module.exports = User;