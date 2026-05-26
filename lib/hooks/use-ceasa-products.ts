'use client';

import { useState, useMemo } from 'react';
import { ceasaProducts, CeasaProduct, getAllCategories } from '@/lib/data/ceasa-products';

export function useCeasaProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => getAllCategories(), []);

  const filteredProducts = useMemo(() => {
    return ceasaProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.code.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return {
    products: filteredProducts,
    allProducts: ceasaProducts,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  };
}
