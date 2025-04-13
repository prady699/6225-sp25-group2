interface RealtorProperty {
  primary_photo: {
    href: string;
  };
  tags: string[];
  status: string;
  list_price: number;
  href: string;
  property_id: string;
  description: {
    beds: number;
    baths: number;
    baths_full: number;
    baths_half: number;
    sqft: number;
    type: string;
    text: string;
  };
  location: {
    address: {
      line: string;
      city: string;
      state_code: string;
      postal_code: string;
    };
    lat?: number;
    lng?: number;
  };
  photos?: Array<{
    href: string;
    tags: Array<{
      label: string;
      probability: number;
    }>;
  }>;
}

interface AppProperty {
  id: number | string;
  title: string;
  image: string;
  price: string | number;
  location: {
    lat?: number;
    lng?: number;
    address: {
      line: string;
      city: string;
      state: string;
      postal_code: string;
    } | string;
  };
  description: {
    beds: number;
    baths: number;
    sqft: number;
    type: string;
  };
  tags: string[];
  href: string;
}

export function mapRealtorToAppProperty(realtorProperty: RealtorProperty): AppProperty {
  // Generate a title based on the property features
  const title = `${realtorProperty.description.beds}BR ${realtorProperty.description.type.charAt(0).toUpperCase() + realtorProperty.description.type.slice(1)}`;

  // Calculate total baths
  const totalBaths = (realtorProperty.description.baths_full || 0) + (realtorProperty.description.baths_half || 0) * 0.5;

  // Default to Boston coordinates if none provided
  const defaultLat = 42.3601;
  const defaultLng = -71.0589;

  // Format price as string with dollar sign
  const formattedPrice = `$${realtorProperty.list_price}/mo`;

  return {
    id: realtorProperty.property_id,
    title,
    image: realtorProperty.primary_photo.href,
    price: formattedPrice,
    location: {
      lat: realtorProperty.location.lat ?? defaultLat,
      lng: realtorProperty.location.lng ?? defaultLng,
      address: {
        line: realtorProperty.location.address.line,
        city: realtorProperty.location.address.city,
        state: realtorProperty.location.address.state_code,
        postal_code: realtorProperty.location.address.postal_code
      }
    },
    description: {
      beds: realtorProperty.description.beds,
      baths: totalBaths,
      sqft: realtorProperty.description.sqft,
      type: realtorProperty.description.type
    },
    tags: realtorProperty.tags.slice(0, 3).map(tag => 
      tag.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    ),
    href: realtorProperty.href
  };
}

export function mapRealtorToAppProperties(realtorProperties: RealtorProperty[]): AppProperty[] {
  return realtorProperties.map(mapRealtorToAppProperty);
} 