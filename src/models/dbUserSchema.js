import mongoose from "./dbConnection.js";

const validateEmail = (e) => {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
};

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, validate: validateEmail },
    phone: { type: String, required: true },
    numberOfMembers: { type: Number, required: true },
    selectedPackage: { type: String },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", formSchema);

export default Form;
