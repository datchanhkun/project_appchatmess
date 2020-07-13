import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userID: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

//Tao ban ghi, this la contactschema
ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  }
};

module.exports = mongoose.model("contact", ContactSchema);