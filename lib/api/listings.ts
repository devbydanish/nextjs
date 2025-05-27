import apiClient from './client';
import { ApiResponse, FilterParams, Listing, PaginationParams } from '@/types';

export async function getListings(
  params: PaginationParams & FilterParams = { page: 1, pageSize: 10 }
): Promise<ApiResponse<Listing[]>> {
  const { page, pageSize, category, city, featured, tags, slug, status } = params;
  
  // Build filters
  let filters = {};
  
  if (slug) {
    // match slug in the slug field for example it will fetch all listing whose slug contains the slug value at start
    filters = { ...filters, slug: { $startsWith: slug} };
  }

  if (category) {
    filters = { ...filters, 'category': {
      slug: { $eq: category }
    }};
  }
  
  if (city) {
    filters = { ...filters, 'city': {
      slug: { $eq: city }
    }};
  }
  
  if (featured !== undefined) {
    filters = { ...filters, featured: { $eq: featured } };
  }
  
  if (status) {
    filters = { ...filters, status: { $eq: status } };
  }
  
  if (tags && tags.length > 0) {
    filters = { ...filters, 'tags': {
      slug: { $in: tags }
    }};
  }
  
  const queryParams = {
    populate: ['images', 'category', 'city', 'tags'],
    pagination: {
      page,
      pageSize
    },
    filters,
    sort: ['createdAt:desc'] // Default sort by creation date
  };

  console.log(queryParams);
  
  const { data } = await apiClient.get('/api/listings', { params: { ...queryParams } });
  return data;
}

// Get listings ordered by homepage position for admin management
export async function getListingsForHomepageManagement(): Promise<ApiResponse<Listing[]>> {
  const { data } = await apiClient.get('/api/listings', {
    params: {
      populate: ['images', 'category', 'city', 'tags'],
      sort: ['homepagePosition:asc', 'createdAt:desc'],
      pagination: {
        page: 1,
        pageSize: 100
      }
    }
  });
  return data;
}

// Get listings by category ordered by category position for admin management
export async function getListingsByCategoryForManagement(categorySlug: string): Promise<ApiResponse<Listing[]>> {
  const { data } = await apiClient.get('/api/listings', {
    params: {
      filters: {
        'category': {
          slug: { $eq: categorySlug }
        }
      },
      populate: ['images', 'category', 'city', 'tags'],
      sort: ['categoryPosition:asc', 'createdAt:desc'],
      pagination: {
        page: 1,
        pageSize: 100
      }
    }
  });
  return data;
}

// Update listing position (admin only)
export async function updateListingPosition(
  id: number, 
  positionData: { homepagePosition?: number; categoryPosition?: number }
): Promise<ApiResponse<Listing>> {
  const { data } = await apiClient.put(`/api/listings/${id}`, { 
    data: positionData 
  });
  return data;
}

// Admin create listing function
export async function adminCreateListing(listingData: any): Promise<ApiResponse<Listing>> {
  const { data } = await apiClient.post('/api/listings', { data: listingData });
  return data;
}

export async function getFeaturedListings(limit = 6): Promise<ApiResponse<Listing[]>> {
  return getListings({ page: 1, pageSize: limit, featured: true });
}

export async function getListingBySlug(slug: string): Promise<ApiResponse<Listing>> {
  const { data } = await apiClient.get(`/api/listings`, {
    params: {
      filters: { slug: { $eq: slug } },
      populate: ['images', 'category', 'city', 'tags']
    }
  });
  return data;
}

export async function getUserListings(userId: number): Promise<ApiResponse<Listing[]>> {
  const { data } = await apiClient.get('/api/listings', {
    params: {
      filters: { advertiserId: { id: { $eq: userId } } },
      populate: ['images', 'category', 'city', 'tags']
    }
  });
  return data;
}

// New function to upload files to the Upload API
export async function uploadFiles(files: File[]): Promise<any[]> {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
  });
  
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  
  const { data } = await apiClient.post('/api/upload', formData, config);
  return data;
}

export async function createListing(listingData: FormData): Promise<ApiResponse<Listing>> {
  // Extract the payload and files
  const payload = JSON.parse(listingData.get('data') as string);
  const files = listingData.getAll('files.images') as File[];
  
  // First upload the files
  let fileIds = [];
  if (files && files.length > 0) {
    const uploadedFiles = await uploadFiles(files);
    fileIds = uploadedFiles.map(file => file.id);
  }
  
  // Create the listing with the file IDs
  const listingPayload = {
    ...payload,
    images: fileIds,
    linkTargetType: payload.linkTargetType || 'internal',
    linkTargetValue: payload.linkTargetValue || '',
    websiteUrl: payload.websiteUrl || '',
    bbsThreadUrl: payload.bbsThreadUrl || '',
    advertiserId: payload.advertiserId
  };
  
  const { data } = await apiClient.post('/api/listings', { data: listingPayload });
  return data;
}

export async function updateListing(id: number, listingData: FormData): Promise<ApiResponse<Listing>> {
  // Extract the payload and files
  const payload = JSON.parse(listingData.get('data') as string);
  const files = listingData.getAll('files.images') as File[];
  
  // First upload the files
  let fileIds = [];
  if (files && files.length > 0) {
    const uploadedFiles = await uploadFiles(files);
    fileIds = uploadedFiles.map(file => file.id);
  }
  
  // Update the listing with the file IDs
  const listingPayload = {
    ...payload,
    images: fileIds,
    linkTargetType: payload.linkTargetType || 'internal',
    linkTargetValue: payload.linkTargetValue || '',
    websiteUrl: payload.websiteUrl || '',
    bbsThreadUrl: payload.bbsThreadUrl || '',
    advertiserId: payload.advertiserId
  };
  
  const { data } = await apiClient.put(`/api/listings/${id}`, { data: listingPayload });
  return data;
}

export async function deleteListing(id: number): Promise<void> {
  await apiClient.delete(`/api/listings/${id}`);
}

export async function getListingById(id: string | number): Promise<ApiResponse<Listing>> {
  const { data } = await apiClient.get(`/api/listings/${id}`, {
    params: {
      populate: ['images', 'category', 'city', 'tags']
    }
  });
  return data;
} 