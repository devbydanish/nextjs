import { apiClient } from './client';
import { ApiResponse, FilterParams, Listing, PaginationParams } from '@/types';

export async function getListings(filters: FilterParams = {}): Promise<ApiResponse<Listing[]>> {
  const { page = 1, pageSize = 12, city, category, featured } = filters;
  
  const params = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'populate': 'images,category,city,tags',
  });
  
  if (city) params.append('filters[city][slug][$eq]', city);
  if (category) params.append('filters[category][slug][$eq]', category);
  if (featured) params.append('filters[featured][$eq]', 'true');
  
  const response = await apiClient.get(`/listings?${params.toString()}`);
  return response.data;
}

export async function getFeaturedListings(limit = 6): Promise<ApiResponse<Listing[]>> {
  return getListings({ page: 1, pageSize: limit, featured: true });
}

export async function getListingBySlug(slug: string): Promise<ApiResponse<Listing>> {
  const response = await apiClient.get(`/listings?filters[slug][$eq]=${slug}&populate=images,category,city,tags`);
  return response.data;
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
  
  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function createListing(data: FormData): Promise<ApiResponse<Listing>> {
  const response = await apiClient.post('/listings', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function updateListing(id: number, data: FormData): Promise<ApiResponse<Listing>> {
  const response = await apiClient.put(`/listings/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function deleteListing(id: number): Promise<void> {
  const response = await apiClient.delete(`/listings/${id}`);
  return response.data;
} 