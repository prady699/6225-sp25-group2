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
      coordinate: {
        lat?: number;
        lng?: number;
        lon?: number;  // Add 'lon' as an alternative to 'lng' for longitude
      };
    };
  };
  photos?: Array<{
    href: string;
    tags: Array<{
      label: string;
      probability: number;
    }>;
  }>;
}

export interface AppProperty {
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
  ai_score?: number;
  matchScore?: number;
}

export function mapRealtorToAppProperty(realtorProperty: RealtorProperty): AppProperty {
  const type = realtorProperty.description?.type ?? 'Rental';
  const beds = realtorProperty.description?.beds ?? 0;
  const title = `${beds}BR ${type.charAt(0).toUpperCase() + type.slice(1)}`;
 
  const totalBaths = (realtorProperty.description?.baths_full || 0) + (realtorProperty.description?.baths_half || 0) * 0.5;
 
  const defaultLat = 38.8936;
  const defaultLng = -77.0725;
  const lat = realtorProperty.location?.address?.coordinate?.lat ?? defaultLat;
  // Try both 'lng' and 'lon' property names for longitude as APIs often use different conventions
  const lng = realtorProperty.location?.address?.coordinate?.lon ?? realtorProperty.location?.address?.coordinate?.lng ?? defaultLng;
 
  const formattedPrice = `$${realtorProperty.list_price}/mo`;
 
  const safeTags = Array.isArray(realtorProperty.tags)
    ? realtorProperty.tags.slice(0, 3).map(tag =>
        tag.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
    : [];
 
  return {
    id: realtorProperty.property_id ?? '',
    title,
    image: realtorProperty.primary_photo?.href ?? '',
    price: formattedPrice,
    location: {
      lat,
      lng,
      address: {
        line: realtorProperty.location?.address?.line ?? '',
        city: realtorProperty.location?.address?.city ?? '',
        state: realtorProperty.location?.address?.state_code ?? '',
        postal_code: realtorProperty.location?.address?.postal_code ?? ''
      }
    },
    description: {
      beds,
      baths: totalBaths,
      sqft: realtorProperty.description?.sqft ?? 0,
      type
    },
    tags: safeTags,
    href: realtorProperty.href ?? '',
    ai_score: 0
  };
}

export function mapRealtorToAppProperties(realtorProperties: RealtorProperty[]): AppProperty[] {
  return realtorProperties.map(mapRealtorToAppProperty);
} 