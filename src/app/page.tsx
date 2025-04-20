import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import { HiLocationMarker, HiHome, HiTag, HiCurrencyDollar, HiMail } from 'react-icons/hi';
import { HiHomeModern, HiBuildingOffice2, HiSquaresPlus } from 'react-icons/hi2';
import { mapRealtorToAppProperty } from '@/utils/propertyMapper';

const trendingLocations = [
  { id: 1, name: 'Boston', count: '2,345 listings' },
  { id: 2, name: 'New York City', count: '3,567 listings' },
  { id: 3, name: 'Washington DC', count: '1,890 listings' },
];

// Sample realtor.com data
const sampleRealtorProperty = {
  primary_photo: {
    href: "https://ap.rdcpix.com/d25e5e762e833137dbb39d0214539e3al-m2064909868s.jpg"
  },
  tags: [
    "central_air",
    "forced_air",
    "pets_allowed",
    "recreation_facilities",
    "garage_1_or_more"
  ],
  status: "for_rent",
  list_price: 4000,
  href: "https://www.realtor.com/rentals/details/1451-Belmont-St-NW-Apt-113_Washington_DC_20009_M69298-13321",
  property_id: "6929813321",
  description: {
    beds: 2,
    baths: 3,
    baths_full: 2,
    baths_half: 1,
    sqft: 1353,
    type: "condos",
    text: "Welcome to The Fedora..."
  },
  location: {
    address: {
      line: "1451 Belmont St NW Apt 113",
      city: "Washington",
      state_code: "DC",
      postal_code: "20009",
      coordinate: {
        lat: 38.9209,
        lng: -77.0376
      }
    }
  }
};

// Combine default apartments with realtor data
const recommendedApartments = [
  mapRealtorToAppProperty(sampleRealtorProperty),
  {
    id: 1,
    title: 'Luxury Student Loft',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    price: '$1,200/mo',
    location: {
      address: {
        line: '123 Mass Ave',
        city: 'Cambridge',
        state: 'MA',
        postal_code: '02139'
      }
    },
    description: {
      beds: 2,
      baths: 2,
      sqft: 1000,
      type: 'condo'
    },
    tags: ['Luxury', 'Pet Friendly', 'In-unit Laundry'],
    href: '/property/1'
  },
  {
    id: 2,
    title: 'Modern Studio Suite',
    image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
    price: '$950/mo',
    location: {
      address: {
        line: '360 Huntington Ave',
        city: 'Boston',
        state: 'MA',
        postal_code: '02115'
      }
    },
    description: {
      beds: 1,
      baths: 1,
      sqft: 500,
      type: 'studio'
    },
    tags: ['Modern', 'Furnished', 'Utilities Included'],
    href: '/property/2'
  },
  {
    id: 3,
    title: 'Spacious 2BR Apartment',
    image: 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
    price: '$1,800/mo',
    location: {
      address: {
        line: '1234 Harvard Square',
        city: 'Cambridge',
        state: 'MA',
        postal_code: '02138'
      }
    },
    description: {
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: 'apartment'
    },
    tags: ['Spacious', 'Central AC', 'Parking'],
    href: '/property/3'
  },
  {
    id: 4,
    title: 'Cozy Campus Studio',
    image: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    price: '$1,100/mo',
    location: {
      address: {
        line: '855 Commonwealth Ave',
        city: 'Boston',
        state: 'MA',
        postal_code: '02215'
      }
    },
    description: {
      beds: 1,
      baths: 1,
      sqft: 450,
      type: 'studio'
    },
    tags: ['Cozy', 'Furnished', 'All Utilities'],
    href: '/property/4'
  },
  {
    id: 5,
    title: 'Premium 3BR Suite',
    image: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
    price: '$2,400/mo',
    location: {
      address: {
        line: '180 Beacon St',
        city: 'Boston',
        state: 'MA',
        postal_code: '02116'
      }
    },
    description: {
      beds: 3,
      baths: 2,
      sqft: 1500,
      type: 'apartment'
    },
    tags: ['Luxury', 'Doorman', 'Gym'],
    href: '/property/5'
  },
  {
    id: 6,
    title: 'Urban Student Haven',
    image: 'https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg',
    price: '$1,350/mo',
    location: {
      address: {
        line: '50 Fenway',
        city: 'Boston',
        state: 'MA',
        postal_code: '02115'
      }
    },
    description: {
      beds: 1,
      baths: 1,
      sqft: 700,
      type: 'apartment'
    },
    tags: ['Modern', 'Pet Friendly', 'Gym'],
    href: '/property/6'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16">
        <HeroCarousel />
      </section>

      {/* Trending Locations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          <HiLocationMarker className="inline-block mr-2 text-yellow-400" />
          Trending Locations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
              <p className="text-gray-600 mt-2">{location.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Apartments */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          <HiHome className="inline-block mr-2 text-yellow-400" />
          Recommended Apartments
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedApartments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
            >
              <div className="relative h-48">
                <img
                  src={apt.image}
                  alt={apt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {apt.description.type}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{apt.title}</h3>
                  <p className="text-xl font-bold text-yellow-500">{apt.price}</p>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {typeof apt.location.address === 'string' 
                    ? apt.location.address 
                    : `${apt.location.address.line}, ${apt.location.address.city}`}
                </p>
                
                {/* Features */}
                <div className="flex items-center gap-4 mb-3 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <HiBuildingOffice2 className="w-4 h-4 mr-1" />
                    {apt.description.beds} {apt.description.beds === 1 ? 'bed' : 'beds'}
                  </div>
                  <div className="flex items-center">
                    <HiHomeModern className="w-4 h-4 mr-1" />
                    {apt.description.baths} {apt.description.baths === 1 ? 'bath' : 'baths'}
                  </div>
                  <div className="flex items-center">
                    <HiSquaresPlus className="w-4 h-4 mr-1" />
                    {apt.description.sqft} sqft
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {apt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Details Button */}
                <a
                  href={apt.href}
                  className="block w-full text-center py-2 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-500 transition-colors font-medium"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <HiMail className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with New Listings
            </h2>
            <p className="text-white/90 mb-8">
              Get notified about new student housing opportunities in your area
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
} 
