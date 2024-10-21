import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    investmenttype: 'Equity Investment',
    businesstype: 'Startups',
    startupstage: 'Idea Stage',
    industry: 'Technology',
    bedrooms: 1,
    bathrooms: 1,
    neededFund: 50,
    minimumInvestmentAmount: 1,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'Debt Investment' || e.target.id === 'Equity Investment' || e.target.id === 'Revenue Sharing') {
      setFormData({
        ...formData,
        investmenttype: e.target.id,
      });
    }

    if (e.target.id === 'Startups' || e.target.id === 'SMEs' || e.target.id === 'Non-Profits') {
      setFormData({
        ...formData,
        businesstype: e.target.id,
      });
    }

    if (e.target.id === 'Idea Stage' || e.target.id === 'Pre-Seed/Seed' || e.target.id === 'Early Stage' || e.target.id === 'Growth Stage' || e.target.id === 'Mature Stage') {
      setFormData({
        ...formData,
        startupstage: e.target.id,
      });
    }

    if (e.target.id === 'industry') {
      setFormData({
        ...formData,
        industry: e.target.value,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.neededFund < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      if (+formData.neededFund < +formData.minimumInvestmentAmount)
        return setError('Minimum Investment Amount must be lower than Needed Fund');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <h1 className='text-xl font-semibold text-center '>Investment Type</h1>
          <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
              
              <input
                type='checkbox'
                id='Revenue Sharing'
                className='w-5'
                onChange={handleChange}
                checked={formData.investmenttype === 'Revenue Sharing'}
              />
              <span>Revenue Sharing</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Equity Investment'
                className='w-5'
                onChange={handleChange}
                checked={formData.investmenttype === 'Equity Investment'}
              />
              <span>Equity Investment</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Debt Investment'
                className='w-5'
                onChange={handleChange}
                checked={formData.investmenttype === 'Debt Investment'}
              />
              <span>Debt Investment</span>
            </div>
          </div>
          <h1 className='text-xl font-semibold text-center '>Business Type</h1>
          <div className='flex gap-6 flex-wrap'>
            
          <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Startups'
                className='w-5'
                onChange={handleChange}
                checked={formData.businesstype === 'Startups'}
              />
              <span>Startups</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='SMEs'
                className='w-5'
                onChange={handleChange}
                checked={formData.businesstype === 'SMEs'}
              />
              <span>SMEs</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Non-Profits'
                className='w-5'
                onChange={handleChange}
                checked={formData.businesstype === 'Non-Profits'}
              />
              <span>Non-Profits</span>
            </div>
          </div>
          {formData.businesstype == 'Startups' && (
              <><h1 className='text-xl font-semibold text-center mt-2'>Startup Stage</h1><div className='flex gap-6 flex-wrap'>

              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='Idea Stage'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.startupstage === 'Idea Stage'} />
                <span>Idea Stage</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='Pre-Seed/Seed'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.startupstage === 'Pre-Seed/Seed'} />
                <span>Pre-Seed/Seed</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='Early Stage'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.startupstage === 'Early Stage'} />
                <span>Early Stage</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='Growth Stage'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.startupstage === 'Growth Stage'} />
                <span>Growth Stage</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='Mature Stage'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.startupstage === 'Mature Stage'} />
                <span>Mature Stage</span>
              </div>
            </div></>
            )}
          <h1 className='text-xl font-semibold text-center '>Industries</h1>
          <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <label htmlFor='industry' className='font-semibold'>
            Select Industry:
            </label>
            <select
            id='industry'
            className='border w-fit rounded-lg'
            value={formData.industry}
            onChange={handleChange}
            required
            >
            <option value='Technology'>Technology</option>
            <option value='Healthcare'>Healthcare</option>
            <option value='Finance'>Finance</option>
            <option value='Real Estate'>Real Estate</option>
            <option value='Education'>Education</option>
            </select>
            </div>
          </div>
          <div className='flex gap-6 flex-wrap'>
          

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='neededFund'
                min='50'
                
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.neededFund}
              />
              <div className='flex flex-col items-center'>
                <p>Needed Fund</p>
                {formData.investmenttype === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='minimumInvestmentAmount'
                min='1'
                
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.minimumInvestmentAmount}
              />
              <div className='flex flex-col items-center'>
                <p>Minimum Investment Amount</p>
                {formData.investmenttype === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>

                  {formData.investmenttype === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Updating...' : 'Update listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}