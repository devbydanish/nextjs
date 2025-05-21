import apiClient from './client';
import { ApiResponse, FilterParams, Listing, PaginationParams } from '@/types';

export async function getListings(
  params: PaginationParams & FilterParams = { page: 1, pageSize: 10 }
): Promise<ApiResponse<Listing[]>> {
  const { page, pageSize, category, city, featured, tags } = params;
  
  // Build filters
  let filters = {};
  
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
    filters
  };

  console.log(queryParams);
  
  const { data } = await apiClient.get('/api/listings', { params: { ...queryParams } });
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
    images: fileIds
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
    images: fileIds
  };
  
  const { data } = await apiClient.put(`/api/listings/${id}`, { data: listingPayload });
  return data;
}

export async function deleteListing(id: number): Promise<void> {
  await apiClient.delete(`/api/listings/${id}`);
} 