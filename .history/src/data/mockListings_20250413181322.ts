// Mock data using realtor.com format
const mockListings = [
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/d25e5e762e833137dbb39d0214539e3al-m2064909868s.jpg"
    },
    tags: [
      "central_air",
      "forced_air", 
      "pets_allowed",
      "recreation_facilities",
      "garage_1_or_more",
      "open_floor_plan",
      "ensuite"
    ],
    status: "for_rent",
    list_price: 4000,
    href: "https://www.realtor.com/rentals/details/1451-Belmont-St-NW-Apt-113_Washington_DC_20009_M69298-13321",
    property_id: "6929813322",
    description: {
      beds: 2,
      baths: 3,
      baths_full: 2,
      baths_half: 1,
      sqft: 1353,
      type: "condos",
      text: "Welcome to The Fedora a fabulous condominium ideally located in the vibrant Northwest corridor of Washington, DC. This exceptional two-bedroom, two-and-a-half-bath residence is a true gem in the heart of the city, offering 1,353 square feet of beautifully finished living space across two thoughtfully designed levels.",
      title: "Luxury Columbia Heights Condo"
    },
    location: {
      address: {
        line: "1451 Belmont St NW Apt 113",
        city: "Washington",
        state_code: "DC",
        postal_code: "20009",
        coordinate: {
          lat: 38.92072,
          lon: -77.033948
        }
      }
    }
  },
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/d25e5e762e833137dbb39d0214539e3al-m2064909868rd-w2048_h1536.webp"
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
      text: "Welcome to The Fedora...",
      title: "Modern Luxury Condo"
    },
    location: {
      address: {
        line: "1451 Belmont St NW Apt 113",
        city: "Washington",
        state_code: "DC",
        postal_code: "20009",
        coordinate: {
          lat: 38.9186,
          lon: -77.0340
        }
      }
    }
  },
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/8b22dd056eb6f5802afe13a438b89a76l-m3358864447rd-w1024_h768.jpg"
    },
    tags: [
      "central_air",
      "dishwasher",
      "pets_allowed",
      "washer_dryer",
      "fitness_center"
    ],
    status: "for_rent",
    list_price: 2800,
    href: "https://www.realtor.com/realestateandhomes-detail/789-Main-St_Boston_MA_02115_M12345-67890",
    property_id: "12345",
    description: {
      beds: 1,
      baths: 1,
      baths_full: 1,
      baths_half: 0,
      sqft: 750,
      type: "apartment",
      text: "Beautiful apartment in great location...",
      title: "Cozy 1BR in Downtown"
    },
    location: {
      address: {
        line: "789 Main St",
        city: "Boston",
        state_code: "MA",
        postal_code: "02115",
        coordinate: {
          lat: 42.3411,
          lon: -71.0892
        }
      }
    }
  },
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/5b4e59e69251b7fb737f2d962a536a87l-m429196652rd-w1024_h768.jpg"
    },
    tags: [
      "hardwood_floors",
      "stainless_steel",
      "balcony",
      "pool",
      "garage_2_or_more"
    ],
    status: "for_rent",
    list_price: 3500,
    href: "https://www.realtor.com/realestateandhomes-detail/456-Park-Ave_Cambridge_MA_02139_M98765-43210",
    property_id: "98765",
    description: {
      beds: 2,
      baths: 2,
      baths_full: 2,
      baths_half: 0,
      sqft: 1100,
      type: "townhouse",
      text: "Spacious townhouse with modern finishes...",
      title: "Modern Townhouse with Garage"
    },
    location: {
      address: {
        line: "456 Park Ave",
        city: "Cambridge",
        state_code: "MA",
        postal_code: "02139",
        coordinate: {
          lat: 42.3736,
          lon: -71.1097
        }
      }
    }
  },
  {
    primary_photo: {
      href: "https://ap.rdcpix.com/1b9a3995a800df0cd1aca7698edba8d3l-m3930248228rd-w1024_h768.jpg"
    },
    tags: [
      "fireplace",
      "laundry",
      "parking",
      "furnished",
      "yard"
    ],
    status: "for_rent",
    list_price: 5200,
    href: "https://www.realtor.com/realestateandhomes-detail/123-College-Ave_Somerville_MA_02144_M54321-09876",
    property_id: "54321",
    description: {
      beds: 3,
      baths: 2.5,
      baths_full: 2,
      baths_half: 1,
      sqft: 1800,
      type: "single_family",
      text: "Beautiful single family home near universities...",
      title: "Spacious Family Home"
    },
    location: {
      address: {
        line: "123 College Ave",
        city: "Somerville",
        state_code: "MA",
        postal_code: "02144",
        coordinate: {
          lat: 42.4001,
          lon: -71.1213
        }
      }
    }
  }
];

export default mockListings; 