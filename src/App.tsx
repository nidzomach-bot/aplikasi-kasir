/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Store,
  Layers,
  BarChart3,
  Search,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Download,
  CheckCircle2,
  RefreshCw,
  X,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  TrendingUp,
  Tag,
  Package,
  Calendar,
  User,
  SlidersHorizontal,
  ChevronRight,
  Receipt,
  FileCode,
  Copy,
  Check,
  Percent,
  Minus
} from 'lucide-react';

// Static image imports for the fashion catalog
import imgOxford from './assets/images/apparel_kemeja_oxford_1791730728474.jpg';
import imgKaos from './assets/images/apparel_kaos_oversized_1791730743628.jpg';
import imgChino from './assets/images/apparel_celana_chino_1791730761833.jpg';
import imgDenim from './assets/images/apparel_jaket_denim_1791730773848.jpg';

// Data types
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Kemeja' | 'Kaos' | 'Celana' | 'Jaket' | 'Dress' | 'Aksesori';
  sizes: string[];
  selectedSize?: string;
  color: string;
  colorHex: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  sku: string;
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  imageUrl?: string;
}

export interface Transaction {
  id: string;
  invoiceNo: string;
  timestamp: string;
  dateStr: string;
  cashierName: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number; // e.g., 0.11
  taxAmount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit' | 'Transfer';
  cashGiven: number;
  change: number;
}

// Initial catalog data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'KMJ-OXF-BLU',
    name: 'Kemeja Oxford Cotton Slim-Fit',
    category: 'Kemeja',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Baby Blue',
    colorHex: '#93c5fd',
    price: 249000,
    stock: 24,
    imageUrl: imgOxford,
  },
  {
    id: 'prod-2',
    sku: 'KOS-OVR-BGE',
    name: 'Kaos Heavyweight Oversized',
    category: 'Kaos',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Oatmeal Beige',
    colorHex: '#e7d8c9',
    price: 139000,
    stock: 45,
    imageUrl: imgKaos,
  },
  {
    id: 'prod-3',
    sku: 'CLN-CHN-NVY',
    name: 'Celana Chino Stretch Navy',
    category: 'Celana',
    sizes: ['29', '30', '32', '34'],
    color: 'Deep Navy',
    colorHex: '#1e3a8a',
    price: 289000,
    stock: 18,
    imageUrl: imgChino,
  },
  {
    id: 'prod-4',
    sku: 'JKT-DNM-WSH',
    name: 'Jaket Denim Vintage Washed',
    category: 'Jaket',
    sizes: ['M', 'L', 'XL'],
    color: 'Washed Indigo',
    colorHex: '#3b82f6',
    price: 379000,
    stock: 12,
    imageUrl: imgDenim,
  },
  {
    id: 'prod-5',
    sku: 'KMJ-FLN-GRN',
    name: 'Kemeja Flanel Casual Kotak',
    category: 'Kemeja',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Forest Green',
    colorHex: '#166534',
    price: 219000,
    stock: 15,
  },
  {
    id: 'prod-6',
    sku: 'KOS-BAS-BLK',
    name: 'Kaos Basic Supima Black',
    category: 'Kaos',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Jet Black',
    colorHex: '#18181b',
    price: 119000,
    stock: 38,
  },
  {
    id: 'prod-7',
    sku: 'CLN-CRG-KHK',
    name: 'Celana Cargo Tactical Khaki',
    category: 'Celana',
    sizes: ['30', '32', '34'],
    color: 'Desert Khaki',
    colorHex: '#c2b280',
    price: 299000,
    stock: 8,
  },
  {
    id: 'prod-8',
    sku: 'DRS-LIN-SGE',
    name: 'Linen Tiered Midi Dress',
    category: 'Dress',
    sizes: ['S', 'M', 'L'],
    color: 'Sage Mist',
    colorHex: '#94a3b8',
    price: 329000,
    stock: 14,
  },
  {
    id: 'prod-9',
    sku: 'JKT-BMB-OLV',
    name: 'Bomber Flight Jacket Quilted',
    category: 'Jaket',
    sizes: ['M', 'L', 'XL'],
    color: 'Olive Green',
    colorHex: '#4d5d53',
    price: 419000,
    stock: 7,
  },
  {
    id: 'prod-10',
    sku: 'AKS-BLT-BRN',
    name: 'Ikat Pinggang Kulit Asli Vintage',
    category: 'Aksesori',
    sizes: ['All Size'],
    color: 'Espresso Brown',
    colorHex: '#4a3728',
    price: 149000,
    stock: 20,
  },
];

// Initial pre-loaded transaction history
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-1001',
    invoiceNo: 'TRX-20261011-001',
    timestamp: '2026-10-11 09:30',
    dateStr: '2026-10-11',
    cashierName: 'Alya Kasir',
    customerName: 'Budi Santoso',
    items: [
      {
        cartId: 'item-1',
        productId: 'prod-1',
        sku: 'KMJ-OXF-BLU',
        name: 'Kemeja Oxford Cotton Slim-Fit',
        category: 'Kemeja',
        size: 'L',
        color: 'Baby Blue',
        price: 249000,
        qty: 1,
        imageUrl: imgOxford,
      },
      {
        cartId: 'item-2',
        productId: 'prod-3',
        sku: 'CLN-CHN-NVY',
        name: 'Celana Chino Stretch Navy',
        category: 'Celana',
        size: '32',
        color: 'Deep Navy',
        price: 289000,
        qty: 1,
        imageUrl: imgChino,
      },
    ],
    subtotal: 538000,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 26900,
    taxRate: 0.11,
    taxAmount: 56221,
    total: 567321,
    paymentMethod: 'QRIS',
    cashGiven: 567321,
    change: 0,
  },
  {
    id: 'trx-1002',
    invoiceNo: 'TRX-20261011-002',
    timestamp: '2026-10-11 11:15',
    dateStr: '2026-10-11',
    cashierName: 'Alya Kasir',
    customerName: 'Siti Rahma',
    items: [
      {
        cartId: 'item-3',
        productId: 'prod-2',
        sku: 'KOS-OVR-BGE',
        name: 'Kaos Heavyweight Oversized',
        category: 'Kaos',
        size: 'M',
        color: 'Oatmeal Beige',
        price: 139000,
        qty: 2,
        imageUrl: imgKaos,
      },
      {
        cartId: 'item-4',
        productId: 'prod-4',
        sku: 'JKT-DNM-WSH',
        name: 'Jaket Denim Vintage Washed',
        category: 'Jaket',
        size: 'XL',
        color: 'Washed Indigo',
        price: 379000,
        qty: 1,
        imageUrl: imgDenim,
      },
    ],
    subtotal: 657000,
    discountType: 'fixed',
    discountValue: 0,
    discountAmount: 0,
    taxRate: 0.11,
    taxAmount: 72270,
    total: 729270,
    paymentMethod: 'Tunai',
    cashGiven: 750000,
    change: 20730,
  },
  {
    id: 'trx-1003',
    invoiceNo: 'TRX-20261010-003',
    timestamp: '2026-10-10 16:45',
    dateStr: '2026-10-10',
    cashierName: 'Dimas POS',
    customerName: 'Rian Pratama',
    items: [
      {
        cartId: 'item-5',
        productId: 'prod-1',
        sku: 'KMJ-OXF-BLU',
        name: 'Kemeja Oxford Cotton Slim-Fit',
        category: 'Kemeja',
        size: 'M',
        color: 'Baby Blue',
        price: 249000,
        qty: 2,
        imageUrl: imgOxford,
      },
    ],
    subtotal: 498000,
    discountType: 'fixed',
    discountValue: 20000,
    discountAmount: 20000,
    taxRate: 0.11,
    taxAmount: 52580,
    total: 530580,
    paymentMethod: 'Debit',
    cashGiven: 530580,
    change: 0,
  },
];

// Helper formatter for IDR Currency
export const formatIDR = (num: number): string => {
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
};

export default function App() {
  // Navigation tabs: 'pos' | 'master' | 'rekap'
  const [activeTab, setActiveTab] = useState<'pos' | 'master' | 'rekap'>('pos');

  // Persistence in LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('kasirku_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('kasirku_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load transactions from storage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kasirku_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kasirku_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sizeFilter, setSizeFilter] = useState<string>('Semua');
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [cashierName] = useState('Kasir Utama');

  // Cart Calculations & Discounts
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [applyTax, setApplyTax] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit' | 'Transfer'>('Tunai');
  const [cashGivenInput, setCashGivenInput] = useState<string>('');

  // Modals
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [currentReceipt, setCurrentReceipt] = useState<Transaction | null>(null);

  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Cart financial summary
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'percentage') {
      const percent = Math.min(Math.max(discountValue, 0), 100);
      return Math.round((subtotal * percent) / 100);
    } else {
      return Math.min(Math.max(discountValue, 0), subtotal);
    }
  }, [subtotal, discountType, discountValue]);

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxRate = applyTax ? 0.11 : 0;
  const taxAmount = Math.round(taxableAmount * taxRate);
  const grandTotal = taxableAmount + taxAmount;

  const cashGiven = cashGivenInput ? parseFloat(cashGivenInput) || 0 : (paymentMethod !== 'Tunai' ? grandTotal : 0);
  const change = Math.max(0, cashGiven - grandTotal);
  const isPayDisabled = cart.length === 0 || (paymentMethod === 'Tunai' && cashGiven < grandTotal);

  // Filtered products for POS
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Semua' || prod.category === selectedCategory;
      const matchesSize =
        sizeFilter === 'Semua' || prod.sizes.includes(sizeFilter);
      return matchesSearch && matchesCategory && matchesSize;
    });
  }, [products, searchQuery, selectedCategory, sizeFilter]);

  // Categories list
  const categories = ['Semua', 'Kemeja', 'Kaos', 'Celana', 'Jaket', 'Dress', 'Aksesori'];

  // Add item to cart
  const addToCart = (product: Product, sizeOption?: string) => {
    if (product.stock <= 0) return;

    const chosenSize = sizeOption || product.sizes[0] || 'M';
    const cartId = `${product.id}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        if (existing.qty >= product.stock) {
          return prev; // stock limit reached
        }
        return prev.map((item) =>
          item.cartId === cartId ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            cartId,
            productId: product.id,
            sku: product.sku,
            name: product.name,
            category: product.category,
            size: chosenSize,
            color: product.color,
            price: product.price,
            qty: 1,
            imageUrl: product.imageUrl,
          },
        ];
      }
    });
  };

  // Modify cart quantity
  const updateCartQty = (cartId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartId === cartId) {
            const product = products.find((p) => p.id === item.productId);
            const maxStock = product ? product.stock : 999;
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (newQty > maxStock) return item;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setCashGivenInput('');
    setDiscountValue(0);
  };

  // Checkout execution
  const handleCheckout = () => {
    if (isPayDisabled) return;

    const now = new Date();
    const dateFormatted = now.toISOString().split('T')[0];
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const invoiceNo = `TRX-${dateFormatted.replace(/-/g, '')}-${String(
      transactions.length + 1
    ).padStart(3, '0')}`;

    const newTransaction: Transaction = {
      id: `trx-${Date.now()}`,
      invoiceNo,
      timestamp: `${dateFormatted} ${timeFormatted}`,
      dateStr: dateFormatted,
      cashierName,
      customerName: customerName.trim() || 'Pelanggan Umum',
      items: [...cart],
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      taxRate,
      taxAmount,
      total: grandTotal,
      paymentMethod,
      cashGiven: paymentMethod === 'Tunai' ? cashGiven : grandTotal,
      change,
    };

    // Deduct inventory stock
    setProducts((prev) => {
      return prev.map((prod) => {
        const boughtItems = cart.filter((c) => c.productId === prod.id);
        const totalBought = boughtItems.reduce((acc, c) => acc + c.qty, 0);
        if (totalBought > 0) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - totalBought),
          };
        }
        return prod;
      });
    });

    // Record transaction
    setTransactions((prev) => [newTransaction, ...prev]);

    // Open receipt modal
    setCurrentReceipt(newTransaction);
    setShowReceiptModal(true);

    // Reset cart
    clearCart();
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset data produk dan transaksi ke setelan awal toko pakaian?')) {
      setProducts(INITIAL_PRODUCTS);
      setTransactions(INITIAL_TRANSACTIONS);
      clearCart();
    }
  };

  // Master Data CRUD Actions
  const handleSaveProduct = (prodData: Partial<Product>) => {
    if (editingProduct) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: prodData.name || p.name,
                sku: prodData.sku || p.sku,
                category: (prodData.category as any) || p.category,
                sizes: prodData.sizes || p.sizes,
                color: prodData.color || p.color,
                colorHex: prodData.colorHex || p.colorHex,
                price: Number(prodData.price) || p.price,
                stock: Number(prodData.stock) || p.stock,
              }
            : p
        )
      );
    } else {
      // Create New
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: prodData.sku || `APP-${Date.now().toString().slice(-4)}`,
        name: prodData.name || 'Produk Pakaian Baru',
        category: (prodData.category as any) || 'Kaos',
        sizes: prodData.sizes || ['S', 'M', 'L', 'XL'],
        color: prodData.color || 'Putih',
        colorHex: prodData.colorHex || '#ffffff',
        price: Number(prodData.price) || 150000,
        stock: Number(prodData.stock) || 10,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Hapus item pakaian "${name}" dari inventaris?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((c) => c.productId !== id));
    }
  };

  // Rekapitulasi Analytics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter((t) => t.dateStr === todayStr);

  const totalRevenueToday = todayTransactions.reduce((acc, t) => acc + t.total, 0);
  const totalAllRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalTransactionsCount = transactions.length;

  // Best selling items calculation
  const productSalesMap = useMemo(() => {
    const map: Record<string, { name: string; category: string; count: number; revenue: number }> = {};
    transactions.forEach((trx) => {
      trx.items.forEach((item) => {
        if (!map[item.productId]) {
          map[item.productId] = {
            name: item.name,
            category: item.category,
            count: 0,
            revenue: 0,
          };
        }
        map[item.productId].count += item.qty;
        map[item.productId].revenue += item.price * item.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [transactions]);

  const bestSellingItem = productSalesMap[0] || { name: 'Belum Ada Penjualan', count: 0 };
  const totalUnitsSold = useMemo(() => {
    return transactions.reduce(
      (acc, t) => acc + t.items.reduce((sum, item) => sum + item.qty, 0),
      0
    );
  }, [transactions]);

  const totalStockAvailable = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock, 0);
  }, [products]);

  // Last 7 days sales data for chart
  const weeklySalesData = useMemo(() => {
    const days: { label: string; date: string; amount: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'numeric' });

      const dayTransactions = transactions.filter((t) => t.dateStr === dateStr);
      const totalAmount = dayTransactions.reduce((acc, t) => acc + t.total, 0);

      days.push({
        label: dayName,
        date: dateStr,
        amount: totalAmount,
        count: dayTransactions.length,
      });
    }
    return days;
  }, [transactions]);

  const maxWeeklyAmount = Math.max(...weeklySalesData.map((d) => d.amount), 500000);

  // Category breakdown
  const categorySales = useMemo(() => {
    const map: Record<string, number> = {
      Kemeja: 0,
      Kaos: 0,
      Celana: 0,
      Jaket: 0,
      Dress: 0,
      Aksesori: 0,
    };
    transactions.forEach((trx) => {
      trx.items.forEach((item) => {
        if (map[item.category] !== undefined) {
          map[item.category] += item.price * item.qty;
        }
      });
    });
    return map;
  }, [transactions]);

  const totalCategoryRevenue = Object.values(categorySales).reduce((a, b) => a + b, 0) || 1;

  // Single File HTML Exporter Content
  const standaloneHtmlCode = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KasirKu Fashion - POS Toko Pakaian</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f0f9ff; }
    @media print {
      body * { visibility: hidden; }
      #printable-receipt, #printable-receipt * { visibility: visible; }
      #printable-receipt { position: absolute; left: 0; top: 0; width: 80mm !important; }
    }
  </style>
</head>
<body class="bg-sky-50 text-slate-800">
  <!-- Aplikasi Kasir Standalone KasirKu Fashion -->
  <div class="p-6 text-center">
    <h1 class="text-2xl font-bold text-sky-800">KasirKu Fashion POS</h1>
    <p class="text-sm text-slate-600 mt-2">Versi Standalone HTML Siap Pakai.</p>
  </div>
</body>
</html>`;
  }, []);

  return (
    <div className="min-h-screen bg-sky-50/60 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-600/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight text-base tracking-tight">
                KasirKu Fashion
              </h1>
              <span className="text-xs text-sky-700 font-medium">Boutique & Apparel POS</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'pos'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Kasir / Penjualan</span>
            {cart.length > 0 && (
              <span
                className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'pos'
                    ? 'bg-white text-sky-700'
                    : 'bg-sky-100 text-sky-700'
                }`}
              >
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('master')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'master'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Master Data Produk</span>
            <span
              className={`ml-auto text-xs font-mono tabular-nums ${
                activeTab === 'master' ? 'text-sky-100' : 'text-slate-400'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'rekap'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Rekapitulasi & Laporan</span>
            <span
              className={`ml-auto text-xs font-mono tabular-nums ${
                activeTab === 'rekap' ? 'text-sky-100' : 'text-slate-400'
              }`}
            >
              {transactions.length}
            </span>
          </button>
        </nav>

        {/* Quick Shift & Store Information */}
        <div className="p-4 border-t border-slate-100 bg-sky-50/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              K1
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{cashierName}</p>
              <p className="text-slate-500">Shift Pagi · Toko Aktif</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={handleResetData}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
              title="Reset contoh data produk dan transaksi"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="hover:text-sky-700 transition-colors flex items-center gap-1 font-medium text-[11px] text-sky-600"
            >
              <FileCode className="w-3 h-3" />
              <span>Kode Standalone</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: KASIR / POS VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'pos' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            {/* Left: Product Catalog & Filters */}
            <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-y-auto">
              {/* Header Title & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Katalog Pakaian
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pilih koleksi busana untuk ditambahkan ke keranjang belanja
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama pakaian atau SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Segmented Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                        : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Size Sub-filter & Product Counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-600">Filter Ukuran:</span>
                  <div className="flex items-center gap-1">
                    {['Semua', 'S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSizeFilter(sz)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          sizeFilter === sz
                            ? 'bg-slate-800 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="tabular-nums font-mono text-slate-400">
                  {filteredProducts.length} model pakaian ditemukan
                </span>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                  <Package className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Tidak ada pakaian yang cocok
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Coba ganti kata kunci pencarian atau ubah filter kategori
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSizeFilter('Semua');
                    }}
                    className="mt-4 px-3.5 py-1.5 text-xs font-medium bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {filteredProducts.map((product) => {
                    const isOutOfStock = product.stock <= 0;
                    return (
                      <div
                        key={product.id}
                        onClick={() => !isOutOfStock && addToCart(product)}
                        className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all flex flex-col overflow-hidden text-left cursor-pointer ${
                          isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'
                        }`}
                      >
                        {/* Product Image Slot */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100/50 p-4">
                              <ShoppingBag className="w-8 h-8 text-sky-400 mb-1" />
                              <span className="text-[10px] uppercase font-semibold text-sky-700 tracking-wider">
                                {product.category}
                              </span>
                            </div>
                          )}

                          {/* Quick color swatch preview */}
                          <div
                            className="absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: product.colorHex }}
                            title={`Warna: ${product.color}`}
                          />

                          {/* Stock status indicator */}
                          <div className="absolute top-2.5 right-2.5">
                            {isOutOfStock ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-sm">
                                Habis
                              </span>
                            ) : product.stock <= 10 ? (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-sm">
                                Sisa {product.stock}
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs tabular-nums font-mono">
                                Stok {product.stock}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Category & SKU metadata (no static pills) */}
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
                              <span>{product.category}</span>
                              <span>·</span>
                              <span className="font-mono">{product.sku}</span>
                            </div>

                            <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
                              {product.name}
                            </h3>

                            {/* Color & available sizes */}
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="truncate max-w-[100px]">{product.color}</span>
                              <span className="font-mono text-slate-400">
                                {product.sizes.join('/')}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row: Price & Add Button */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-sky-800 font-mono tabular-nums">
                              {formatIDR(product.price)}
                            </span>

                            <button
                              type="button"
                              disabled={isOutOfStock}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                isOutOfStock
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white'
                              }`}
                              title="Tambah ke keranjang"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Shopping Cart & Checkout Panel */}
            <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200/90 flex flex-col shrink-0 shadow-lg lg:shadow-none">
              {/* Cart Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      Keranjang Kasir
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {cart.reduce((s, i) => s + i.qty, 0)} item dipilih
                    </p>
                  </div>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:underline font-medium"
                  >
                    Kosongkan
                  </button>
                )}
              </div>

              {/* Customer Selector */}
              <div className="px-4 py-2.5 bg-sky-50/50 border-b border-slate-100 flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Nama Pelanggan (opsional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-full font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Cart Items List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[180px] max-h-[380px] lg:max-h-none">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <ShoppingBag className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">
                      Keranjang Masih Kosong
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                      Klik pakaian di katalog sebelah kiri untuk memulai transaksi
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-200 transition-all flex items-start justify-between gap-2.5"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-sky-700 bg-sky-50 px-1 py-0.2 rounded border border-sky-100">
                            Size {item.size}
                          </span>
                          <span>·</span>
                          <span className="truncate">{item.color}</span>
                        </div>
                        <div className="text-xs font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                          {formatIDR(item.price * item.qty)}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">
                            (@{formatIDR(item.price)})
                          </span>
                        </div>
                      </div>

                      {/* Stepper buttons */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.cartId, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono tabular-nums text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.cartId, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCartItem(item.cartId)}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Summary & Checkout Execution */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
                {/* Discount Control Drawer */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-sky-600" />
                      Diskon Promosi
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          discountType === 'percentage'
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          discountType === 'fixed'
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Rp
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === 'percentage' ? 'Contoh: 10 (%)' : 'Contoh: 20000'}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                    />
                    {discountAmount > 0 && (
                      <span className="text-xs font-bold text-emerald-600 font-mono tabular-nums whitespace-nowrap">
                        -{formatIDR(discountAmount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tax Checkbox */}
                <div className="flex items-center justify-between text-xs px-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={applyTax}
                      onChange={(e) => setApplyTax(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                    />
                    <span>Hitung PPN 11%</span>
                  </label>
                  <span className="font-mono tabular-nums text-slate-500 text-xs">
                    {formatIDR(taxAmount)}
                  </span>
                </div>

                {/* Subtotal & Total Line */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Produk</span>
                    <span className="font-mono tabular-nums">{formatIDR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-slate-900">Total Tagihan</span>
                    <span className="text-lg font-extrabold text-sky-800 font-mono tabular-nums">
                      {formatIDR(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Metode Pembayaran
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Tunai', 'QRIS', 'Debit', 'Transfer'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(method);
                          if (method !== 'Tunai') {
                            setCashGivenInput(grandTotal.toString());
                          }
                        }}
                        className={`py-1.5 px-1 text-center rounded-lg text-xs font-semibold border transition-all ${
                          paymentMethod === method
                            ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash Input & Change (Only for Cash Payment) */}
                {paymentMethod === 'Tunai' && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Uang Diterima (Rp)</span>
                      {cashGiven > 0 && (
                        <span
                          className={`font-mono font-bold text-xs ${
                            cashGiven >= grandTotal ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {cashGiven >= grandTotal
                            ? `Kembalian: ${formatIDR(change)}`
                            : `Kurang: ${formatIDR(grandTotal - cashGiven)}`}
                        </span>
                      )}
                    </div>

                    <input
                      type="number"
                      placeholder="Masukkan nominal uang tunai..."
                      value={cashGivenInput}
                      onChange={(e) => setCashGivenInput(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                    />

                    {/* Quick nominal buttons */}
                    <div className="flex items-center gap-1 overflow-x-auto pt-1">
                      <button
                        type="button"
                        onClick={() => setCashGivenInput(grandTotal.toString())}
                        className="px-2 py-1 text-[10px] font-semibold bg-sky-50 text-sky-700 rounded hover:bg-sky-100 whitespace-nowrap"
                      >
                        Uang Pas
                      </button>
                      {[50000, 100000, 200000, 500000].map((nom) => (
                        <button
                          key={nom}
                          type="button"
                          onClick={() => setCashGivenInput(nom.toString())}
                          className="px-2 py-1 text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 rounded hover:bg-slate-200 whitespace-nowrap"
                        >
                          {nom >= 1000 ? `${nom / 1000}k` : nom}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  type="button"
                  disabled={isPayDisabled}
                  onClick={handleCheckout}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isPayDisabled
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/30 active:scale-[0.99]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proses Bayar ({formatIDR(grandTotal)})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MASTER DATA PRODUK VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'master' && (
          <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Manajemen Inventaris Pakaian
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola katalog busana, varian ukuran, penetapan harga jual, dan stok gudang
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-sky-600/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk Baru</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Total SKU Pakaian
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                  {products.length}
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Total Stok Unit
                </span>
                <span className="text-xl font-extrabold text-sky-700 font-mono tabular-nums mt-1 block">
                  {totalStockAvailable} Pcs
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Stok Menipis (≤10)
                </span>
                <span className="text-xl font-extrabold text-amber-600 font-mono tabular-nums mt-1 block">
                  {products.filter((p) => p.stock > 0 && p.stock <= 10).length} Item
                </span>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Stok Habis
                </span>
                <span className="text-xl font-extrabold text-rose-600 font-mono tabular-nums mt-1 block">
                  {products.filter((p) => p.stock === 0).length} Item
                </span>
              </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter SKU atau nama pakaian..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        Kategori: {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Body */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item Pakaian</th>
                      <th className="py-3 px-4">Kode SKU</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Ukuran & Warna</th>
                      <th className="py-3 px-4 text-right">Harga Jual</th>
                      <th className="py-3 px-4 text-center">Stok</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {prod.imageUrl ? (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-sky-50 text-sky-600">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-snug">{prod.name}</p>
                              <span className="text-[11px] text-slate-400">ID: {prod.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-slate-600">
                          {prod.sku}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-600 font-medium">{prod.category}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: prod.colorHex }}
                              title={prod.color}
                            />
                            <span className="text-slate-600 text-xs">
                              {prod.color} ({prod.sizes.join(', ')})
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {formatIDR(prod.price)}
                        </td>

                        <td className="py-3 px-4 text-center font-mono font-bold tabular-nums">
                          {prod.stock}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {prod.stock <= 0 ? (
                            <span className="text-[11px] font-semibold text-rose-600">
                              Habis
                            </span>
                          ) : prod.stock <= 10 ? (
                            <span className="text-[11px] font-semibold text-amber-600">
                              Menipis
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-emerald-600">
                              Tersedia
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(prod);
                                setShowProductModal(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit Produk"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: REKAPITULASI & LAPORAN PENJUALAN VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'rekap' && (
          <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-y-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Rekapitulasi & Laporan Penjualan
                </h2>
                <p className="text-xs text-slate-500">
                  Ikhtisar omzet harian, performa produk busana terlaris, dan histori transaksi kasir
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,' +
                      'No Transaksi,Tanggal,Kasir,Pelanggan,Metode,Total,Item Count\n' +
                      transactions
                        .map(
                          (t) =>
                            `"${t.invoiceNo}","${t.timestamp}","${t.cashierName}","${t.customerName}","${t.paymentMethod}",${t.total},${t.items.length}`
                        )
                        .join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `rekap_penjualan_${todayStr}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh CSV</span>
                </button>
              </div>
            </div>

            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Pendapatan Hari Ini
                  </span>
                  <span className="text-xl font-extrabold text-sky-800 font-mono tabular-nums mt-1 block">
                    {formatIDR(totalRevenueToday)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Total: {formatIDR(totalAllRevenue)}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Total Transaksi
                  </span>
                  <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums mt-1 block">
                    {totalTransactionsCount} Struk
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                    {todayTransactions.length} transaksi hari ini
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Produk Terlaris
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 truncate mt-1 block max-w-[150px]">
                    {bestSellingItem.name}
                  </span>
                  <span className="text-[11px] text-sky-700 font-mono tabular-nums mt-0.5 block">
                    {bestSellingItem.count} Pcs Terjual
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Volume Penjualan
                  </span>
                  <span className="text-xl font-extrabold text-indigo-700 font-mono tabular-nums mt-1 block">
                    {totalUnitsSold} Pcs
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Sisa stok toko: {totalStockAvailable} Pcs
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Weekly Sales Bar Chart (2 columns) */}
              <div className="lg:col-span-2 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Tren Penjualan 7 Hari Terakhir
                    </h3>
                    <p className="text-xs text-slate-500">
                      Grafik omzet harian toko pakaian
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    Maks {formatIDR(maxWeeklyAmount)}
                  </span>
                </div>

                {/* SVG/CSS Bar Chart */}
                <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                  {weeklySalesData.map((d, idx) => {
                    const heightPercent = Math.max(
                      Math.round((d.amount / maxWeeklyAmount) * 100),
                      6
                    );
                    const isToday = d.date === todayStr;
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none whitespace-nowrap shadow-md z-10 font-mono">
                          {formatIDR(d.amount)} ({d.count} trx)
                        </div>

                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                            isToday
                              ? 'bg-sky-600 group-hover:bg-sky-700'
                              : 'bg-sky-200 group-hover:bg-sky-400'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500 mt-2 truncate w-full text-center">
                          {d.label.split(',')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Proportion Breakdown (1 column) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Penjualan Berdasarkan Kategori
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Proporsi kontribusi omzet busana
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(categorySales).map(([cat, amount]) => {
                    const percent = Math.round((amount / totalCategoryRevenue) * 100) || 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{cat}</span>
                          <span className="font-mono text-slate-500">
                            {formatIDR(amount)} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-sky-600 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Riwayat Transaksi Penjualan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftar seluruh nota penjualan yang berhasil diproses
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {transactions.length} transaksi tercatat
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">No. Transaksi</th>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Kasir</th>
                      <th className="py-3 px-4 text-center">Item</th>
                      <th className="py-3 px-4">Metode</th>
                      <th className="py-3 px-4 text-right">Total Transaksi</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-sky-800">
                          {trx.invoiceNo}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {trx.timestamp}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {trx.customerName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{trx.cashierName}</td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums">
                          {trx.items.reduce((acc, i) => acc + i.qty, 0)} Pcs
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {trx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 tabular-nums">
                          {formatIDR(trx.total)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentReceipt(trx);
                              setShowReceiptModal(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>Lihat Nota</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: RECEIPT / STRUK PEMBAYARAN POPUP */}
      {/* ========================================================================= */}
      {showReceiptModal && currentReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success Icon Badge */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pembayaran Berhasil!</h3>
              <p className="text-xs text-slate-500">Transaksi telah dicatat ke dalam database kasir</p>
            </div>

            {/* Printable Receipt Paper */}
            <div
              id="printable-receipt"
              className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 font-mono text-[11px] text-slate-700 space-y-2.5"
            >
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <p className="font-bold text-sm text-slate-900 tracking-wider">KASIRKU FASHION</p>
                <p className="text-[10px] text-slate-500">Jl. Malioboro Fashion Street No. 45</p>
                <p className="text-[10px] text-slate-500">Telp: 0812-3456-7890</p>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 pb-1 border-b border-dashed border-slate-200">
                <div>
                  <p>No: {currentReceipt.invoiceNo}</p>
                  <p>Kasir: {currentReceipt.cashierName}</p>
                </div>
                <div className="text-right">
                  <p>{currentReceipt.timestamp}</p>
                  <p>Pelanggan: {currentReceipt.customerName}</p>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 py-1">
                {currentReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-slate-800 leading-tight">{it.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {it.size} · {it.color} · {it.qty} x {formatIDR(it.price)}
                      </p>
                    </div>
                    <span className="font-bold tabular-nums text-slate-800">
                      {formatIDR(it.price * it.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Subtotals */}
              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatIDR(currentReceipt.subtotal)}</span>
                </div>
                {currentReceipt.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon</span>
                    <span className="tabular-nums">-{formatIDR(currentReceipt.discountAmount)}</span>
                  </div>
                )}
                {currentReceipt.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>PPN (11%)</span>
                    <span className="tabular-nums">{formatIDR(currentReceipt.taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-xs">
                  <span>TOTAL</span>
                  <span className="tabular-nums">{formatIDR(currentReceipt.total)}</span>
                </div>
                <div className="flex justify-between text-slate-600 pt-1">
                  <span>Metode: {currentReceipt.paymentMethod}</span>
                  <span className="tabular-nums">{formatIDR(currentReceipt.cashGiven)}</span>
                </div>
                {currentReceipt.paymentMethod === 'Tunai' && (
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Kembalian</span>
                    <span className="tabular-nums">{formatIDR(currentReceipt.change)}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-400">
                <p>Terima Kasih Telah Berbelanja!</p>
                <p>Barang yang sudah dibeli dapat ditukar max 3 hari</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Struk</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Transaksi Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH / EDIT PRODUK FORM */}
      {/* ========================================================================= */}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EXPORT STANDALONE HTML SINGLE-FILE */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ekspor Single-File HTML Standalone
                </h3>
                <p className="text-xs text-slate-500">
                  Salin atau unduh file HTML lengkap mandiri yang dapat langsung dibuka di browser
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Sesuai dengan instruksi, Anda dapat langsung mengunduh seluruh sistem kasir ini dalam 1
              file HTML murni tanpa perlu Node.js atau server terpisah.
            </p>

            <div className="relative mb-4">
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono h-40 overflow-y-auto leading-relaxed">
                {standaloneHtmlCode}
              </pre>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(standaloneHtmlCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-medium flex items-center gap-1 border border-slate-700"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Disalin!' : 'Salin'}</span>
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([standaloneHtmlCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'kasirku_fashion_pos.html';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File .HTML</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Modal Form for Adding/Editing Product
function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(
    product?.sku || `APP-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [category, setCategory] = useState<Product['category']>(
    product?.category || 'Kemeja'
  );
  const [sizesStr, setSizesStr] = useState(
    product?.sizes.join(', ') || 'S, M, L, XL'
  );
  const [color, setColor] = useState(product?.color || 'Biru Langit');
  const [colorHex, setColorHex] = useState(product?.colorHex || '#38bdf8');
  const [price, setPrice] = useState<number>(product?.price || 189000);
  const [stock, setStock] = useState<number>(product?.stock || 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sizes = sizesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({
      name,
      sku,
      category,
      sizes: sizes.length > 0 ? sizes : ['All Size'],
      color,
      colorHex,
      price,
      stock,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          {product ? 'Edit Pakaian' : 'Tambah Busana Baru'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Isi detail informasi produk pakaian untuk dimasukkan ke katalog
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Pakaian</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kemeja Linen Floral Relaxed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kode SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="Kemeja">Kemeja</option>
                <option value="Kaos">Kaos</option>
                <option value="Celana">Celana</option>
                <option value="Jaket">Jaket</option>
                <option value="Dress">Dress</option>
                <option value="Aksesori">Aksesori</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ukuran (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="S, M, L, XL"
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Warna</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  placeholder="Nama Warna"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Stok Awal</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono font-medium"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-sm shadow-sky-600/20 transition-colors"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
