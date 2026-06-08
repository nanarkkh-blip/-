/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Sparkles, Plus, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import { MENU_DATA, CATEGORIES } from '../menuData';

interface MenuGridProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuGrid({ onAddToCart }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ທັງໝົດ');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = MENU_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'ທັງໝົດ' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col gap-5" id="menu-grid-section">
      {/* Category selector & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between" id="menu-controls">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5" id="category-badges">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                id={`cat-btn-${cat}`}
                className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm" id="search-bar">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="ຄົ້ນຫາລາຍການອາຫານ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-700"
          />
        </div>
      </div>

      {/* Grid Menu Cards */}
      <div id="grid-container">
        {filteredItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            id="food-items-grid"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  id={`food-card-${item.id}`}
                >
                  {/* Image Header with tag overlay */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      <span className="px-2.5 py-1 text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md rounded-md select-none">
                        {item.category}
                      </span>
                      {item.isPopular && (
                        <span className="px-2.5 py-1 text-[10px] font-semibold bg-amber-500 text-white rounded-md flex items-center gap-1 shadow-sm select-none">
                          <ThumbsUp className="w-3 h-3" />
                          ຮ້ານແນະນຳ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-slate-800" id={`item-title-${item.id}`}>
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Order Button */}
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">ລາຄາ</span>
                        <p className="text-base font-extrabold text-red-600">
                          {item.price.toLocaleString()} <span className="text-xs font-semibold">ກີບ</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        id={`add-to-cart-btn-${item.id}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        ເລືອກສັ່ງ
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center"
            id="empty-menu-state"
          >
            <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-500">ບໍ່ພົບລາຍການອາຫານທີ່ຄົ້ນຫາ</p>
            <p className="text-xs text-slate-400 mt-1">ລອງຄົ້ນຫາດ້ວຍຄຳສັບອື່ນ ຫຼື ກົດເລືອກໝວດໝູ່ທັງໝົດ</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
