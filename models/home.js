import mongoose from "mongoose";

const homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photoUrl: { type: String },
  discription: { type: String },
});

// homeSchema.pre("findOneAndDelete", async function () {
//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({ homeId: homeId });
// });

export default mongoose.model("Home", homeSchema);
