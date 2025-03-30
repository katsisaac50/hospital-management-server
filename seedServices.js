const mongoose = require("mongoose");
const Service = require("./models/Service"); // Adjust path if needed

mongoose.connect("mongodb+srv://katsisaac50:LovE1234k@cluster0.xlgv2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedServices = async () => {
  await Service.insertMany([
    { name: "General Consultation", price: 50 },
    { name: "Dental Checkup", price: 80 },
    { name: "Laboratory Test", price: 100 },
    { name: "X-Ray Scan", price: 120 },
    { name: "Physiotherapy", price: 90 },
  ]);
  console.log("Services added!");
  mongoose.disconnect();
};

seedServices();
