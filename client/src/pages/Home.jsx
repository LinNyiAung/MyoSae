import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [EquityInvestmentListings, setEquityInvestmentListings] = useState([]);
  const [DebtInvestmentListings, setDebtInvestmentListings] = useState([]);
  const [RevenueSharingListings, setRevenueSharingListings] = useState([]);

  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchEquityInvestmentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchEquityInvestmentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?investmenttype=Equity Investment&limit=4');
        const data = await res.json();
        setEquityInvestmentListings(data);
        fetchDebtInvestmentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchDebtInvestmentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?investmenttype=Debt Investment&limit=4');
        const data = await res.json();
        setDebtInvestmentListings(data);
        fetchRevenueSharingListings();
      } catch (error) {
        log(error);
      }
    };

    const fetchRevenueSharingListings = async () => {
      try {
        const res = await fetch('/api/listing/get?investmenttype=Revenue Sharing&limit=4');
        const data = await res.json();
        setRevenueSharingListings(data);
      } catch (error) {
        log(error);
      }
    };

    
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}

      <div className='max-w-max mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {EquityInvestmentListings && EquityInvestmentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Equity Investment</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?investmenttype=Equity Investment'}>Show more places for Equity Investment</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {EquityInvestmentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {DebtInvestmentListings && DebtInvestmentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Debt Investment</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?investmenttype=Debt Investment'}>Show more places for Debt Investment</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {DebtInvestmentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {RevenueSharingListings && RevenueSharingListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Revenue Sharing</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?investmenttype=Revenue Sharing'}>Show more places for Revenue Sharing</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {RevenueSharingListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}