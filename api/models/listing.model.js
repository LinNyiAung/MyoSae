import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    neededFund: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    investmenttype: {
      type: String,
      required: true,
    },
    businesstype: {
      type: String,
      required: true,
    },
    // industry: {
    //   type: String,
    //   required: true,
    //   enum: [
    //     'Technology',
    //     'Healthcare',
    //     'Fintech',
    //     'Real Estate',
    //     'Education',
    //     'E-commerce',
    //     'Energy & Sustainability',
    //     'Agriculture',
    //     'Manufacturing',
    //     'Media & Entertainment',
    //     'Fashion & Apparel',
    //     'Food & Beverage',
    //   ],
    // },
    industry: {
      type: String,
      required: true,
    },
    
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;