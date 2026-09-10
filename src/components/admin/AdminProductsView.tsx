"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdminStore } from "@/stores";
import { Product } from "@/types/ecommerce.types";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Package,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminProductsView() {
  const { products, updateProductStock, addProduct, deleteProduct } =
    useAdminStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState({
    name: "",
    categoryName: "Smartphones & Tablets",
    price: 0,
    originalPrice: 0,
    stock: 10,
    brand: "Apple",
    thumbnail:
      "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80",
  });

  const categories = Array.from(
    new Set(products.map((p) => p.categoryName).filter(Boolean))
  );

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      categoryFilter === "all" ? true : p.categoryName === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || newProd.price <= 0) return;

    const slug = newProd.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const created: Product = {
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProd.name,
      shortDescription: `Authentic ${newProd.name} with official warranty and nationwide delivery.`,
      description: `Premium official ${newProd.name}. Verified serial, authentic importer seal, and 7-day replacement guarantee from Telos Cart BD.`,
      categoryId: "cat-general",
      categorySlug: "general-tech",
      categoryName: newProd.categoryName,
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || newProd.price),
      discountPercentage: 0,
      currency: "BDT",
      rating: 4.8,
      reviewCount: 1,
      stock: Number(newProd.stock),
      inStock: Number(newProd.stock) > 0,
      isFeatured: false,
      isFlashDeal: false,
      isNewArrival: true,
      images: [newProd.thumbnail],
      thumbnail: newProd.thumbnail,
      brand: newProd.brand,
      sku: `TELOS-${newProd.brand.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      specifications: {
        Brand: newProd.brand,
        Warranty: "1 Year Official Brand Warranty",
        Authenticity: "100% Original BD Unit",
      },
      tags: ["official-bd", "tech"],
      createdAt: new Date().toISOString(),
    };

    addProduct(created);
    setShowAddModal(false);
    setNewProd({
      name: "",
      categoryName: "Smartphones & Tablets",
      price: 0,
      originalPrice: 0,
      stock: 10,
      brand: "Apple",
      thumbnail:
        "https://images.unsplash.com/photo-1511707171634-5f897ff0259f?auto=format&fit=crop&w=800&q=80",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Inventory & Catalog Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage product listings, realtime stock counts, and brand assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/70 bg-background pl-9 pr-4 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ── Products Table ── */}
      <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category & SKU</th>
                <th className="py-3 px-4">Price (BDT)</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.slice(0, 20).map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border/60 shrink-0 bg-muted/30">
                        <Image
                          src={prod.thumbnail}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-foreground truncate">
                          {prod.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Brand: <strong className="text-foreground">{prod.brand}</strong>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-foreground truncate">
                      {prod.categoryName}
                    </p>
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {prod.sku || "NO-SKU"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-foreground text-sm">
                    ৳{prod.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {/* Stock quick stepper */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={prod.stock}
                        onChange={(e) =>
                          updateProductStock(prod.id, Number(e.target.value))
                        }
                        className={cn(
                          "w-16 h-8 rounded-lg border text-center font-mono font-bold text-xs focus:outline-none",
                          prod.stock <= 4
                            ? "border-rose-500/80 bg-rose-500/10 text-rose-600"
                            : "border-border/80 bg-background text-foreground"
                        )}
                      />
                      <span className="text-[10px] text-muted-foreground">units</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {prod.stock <= 0 ? (
                      <span className="inline-block rounded-full bg-rose-500/15 text-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Out of Stock
                      </span>
                    ) : prod.stock <= 4 ? (
                      <span className="inline-block rounded-full bg-amber-500/15 text-amber-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-emerald-500/15 text-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Product Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-background p-6 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="text-base font-black text-foreground">
                Add New Product to Catalog
              </h3>
              <p className="text-xs text-muted-foreground">
                Fill details to immediately list item in store.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-foreground">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samsung Galaxy S25 Ultra 12GB/512GB"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samsung / Apple / Sony"
                    value={newProd.brand}
                    onChange={(e) =>
                      setNewProd({ ...newProd, brand: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground">Category *</label>
                  <select
                    value={newProd.categoryName}
                    onChange={(e) =>
                      setNewProd({ ...newProd, categoryName: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-semibold text-foreground focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                    <option value="Laptops & MacBooks">Laptops & MacBooks</option>
                    <option value="Audio & Headphones">Audio & Headphones</option>
                    <option value="Gaming & Consoles">Gaming & Consoles</option>
                    <option value="Accessories & Power">Accessories & Power</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-foreground">Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="120000"
                    value={newProd.price || ""}
                    onChange={(e) =>
                      setNewProd({ ...newProd, price: Number(e.target.value) })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground">Original Price</label>
                  <input
                    type="number"
                    placeholder="130000"
                    value={newProd.originalPrice || ""}
                    onChange={(e) =>
                      setNewProd({
                        ...newProd,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-mono text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.stock}
                    onChange={(e) =>
                      setNewProd({ ...newProd, stock: Number(e.target.value) })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-mono font-bold text-foreground focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground">Image Thumbnail URL</label>
                <input
                  type="url"
                  value={newProd.thumbnail}
                  onChange={(e) =>
                    setNewProd({ ...newProd, thumbnail: e.target.value })
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-xs font-medium text-foreground focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/80 font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20 active:scale-98 cursor-pointer"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
