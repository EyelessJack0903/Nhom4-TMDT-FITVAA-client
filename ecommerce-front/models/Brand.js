import mongoose from 'mongoose';

const SubBrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  subBrands: [SubBrandSchema],
});

const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

export default Brand;
