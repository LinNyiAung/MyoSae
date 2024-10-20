import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    investmenttype: 'investmentall',
    businesstype: 'businessall',
    industry: 'industryall',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const investmenttypeFromUrl = urlParams.get('investmenttype');
    const businesstypeFromUrl = urlParams.get('businesstype');
    const industryFromUrl = urlParams.get('industry');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      investmenttypeFromUrl ||
      businesstypeFromUrl ||
      industryFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        investmenttype: investmenttypeFromUrl || 'investmentall',
        businesstype: businesstypeFromUrl || 'businessall',
        industry: industryFromUrl || 'industryall',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'investmentall' ||
      e.target.id === 'Equity Investment' ||
      e.target.id === 'Debt Investment' ||
      e.target.id === 'Revenue Sharing'
    ) {
      setSidebardata({ ...sidebardata, investmenttype: e.target.id });
    }

    if (
      e.target.id === 'businessall' ||
      e.target.id === 'Startups' ||
      e.target.id === 'SMEs' ||
      e.target.id === 'Non-Profits'
    ) {
      setSidebardata({ ...sidebardata, businesstype: e.target.id });
    }

    if (e.target.id === 'industry') {
      setSidebardata({ ...sidebardata, industry: e.target.value });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('investmenttype', sidebardata.investmenttype);
    urlParams.set('businesstype', sidebardata.businesstype);
    urlParams.set('industry', sidebardata.industry);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Investment Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='investmentall'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.investmenttype === 'investmentall'}
              />
              <span>All</span>
            </div>
            
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Equity Investment'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.investmenttype === 'Equity Investment'}
              />
              <span>Equity Investment</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Debt Investment'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.investmenttype === 'Debt Investment'}
              />
              <span>Debt Investment</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Revenue Sharing'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.investmenttype === 'Revenue Sharing'}
              />
              <span>Revenue Sharing</span>
            </div>
            
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Business Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='businessall'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.businesstype === 'businessall'}
              />
              <span>All</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Startups'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.businesstype === 'Startups'}
              />
              <span>Startups</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='SMEs'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.businesstype === 'SMEs'}
              />
              <span>SMEs</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='Non-Profits'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.businesstype === 'Non-Profits'}
              />
              <span>Non-Profits</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Industry:
            </label>
            <select
              id='industry'
              value={sidebardata.industry}
              onChange={handleChange}
              className='border rounded-lg p-3 w-full'
            >
              <option value='industryall'>All</option>
              <option value='Technology'>Technology</option>
              <option value='Healthcare'>Healthcare</option>
              <option value='Finance'>Finance</option>
              <option value='Real Estate'>Real Estate</option>
              <option value='Education'>Education</option>
              {/* Add more options as needed */}
            </select>
          </div>  
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='neededFund_desc'>Needed Fund high to low</option>
              <option value='neededFund_asc'>Needed Fund low to high</option>
              <option value='minimumInvestmentAmount_desc'>Investment Amount high to low</option>
              <option value='minimumInvestmentAmount_asc'>Investment Amount low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}