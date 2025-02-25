
'use client';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  description: string;
}

const fetchProducts = async (query: string): Promise<Product[]> => {
  if (!query) return [];
  const response = await axios.get<Product[]>(`/api/search?query=${query}`);
  return response.data;
};

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', debouncedQuery],
    queryFn: () => fetchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 3,
  });

  return (
    <div className="p-4">
     
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button variant="outline" disabled={isLoading}>
          Search
        </Button>
      </div>

      
      {isLoading && (
        <Card>
          <CardContent className="p-4 mx-auto  space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-2" role="status"
              aria-label="Loading">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Display Results */}
      {!isLoading && (products ?? []).length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            {(products ?? []).map((product) => (
              <div key={product.id} className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                <span className="font-medium">{product.name}</span>
                <span className="text-sm text-gray-500">{product.description}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results Found */}
      {debouncedQuery.length >= 3 && !isLoading && (products ?? []).length === 0 && (
        <p className="text-center">No products found.</p>
      )}
    </div>
  );
}