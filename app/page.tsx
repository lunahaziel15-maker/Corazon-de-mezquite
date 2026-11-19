'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import OrbitalHero, { HeroShowcaseItem } from '@/components/OrbitalHero';

interface ProductItem {
  id: number;
  name: string;
  tagline: string;
  weight: string;
  category: 'Yogurt' | 'Cajeta' | 'Queso';
  price: number;
  description: string;
  imageUrl: string;
  accentColor: string;
}

interface CartEntry {
  product: ProductItem;
  qty: number;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    name: 'Yogurt Natural Artesanal',
    tagline: 'Cultivos Vivos & Cremoso',
    weight: '1 L',
    category: 'Yogurt',
    price: 68,
    description: 'Leche fresca con cultivos vivos, textura cremosa y sin endulzantes artificiales.',
    imageUrl: '/hero/yogurt-main.png',
    accentColor: '#EA580C',
  },
  {
    id: 2,
    name: 'Cajeta Quemada Tradicional',
    tagline: 'Cocción Lenta en Cazo',
    weight: '660 GR',
    category: 'Cajeta',
    price: 115,
    description: 'Cocida lentamente en cazo con sabor caramelizado profundo y consistencia sedosa.',
    imageUrl: '/hero/cajeta-main.png',
    accentColor: '#881337',
  },
  {
    id: 3,
    name: 'Queso Fresco de Rancho',
    tagline: 'Sabor Suave y Fresco',
    weight: '500 GR',
    category: 'Queso',
    price: 89,
    description: 'Sabor suave y limpio, ideal para desayunos, antojitos y cocina diaria.',
    imageUrl: '/hero/queso-main.png',
    accentColor: '#15803D',
  },
];

const CATEGORIES: Array<'Todos' | 'Yogurt' | 'Cajeta' | 'Queso'> = [
  'Todos',
  'Yogurt',
  'Cajeta',
  'Queso',
];

export default function HomePage() {
  const [selectedCat, setSelectedCat] = useState<'Todos' | 'Yogurt' | 'Cajeta' | 'Queso'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCat = selectedCat === 'Todos' || item.category === selectedCat;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCat, searchQuery]);

  const addToCart = (product: ProductItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.product.id === product.id);
      if (existing) {
        return prev.map((entry) =>
          entry.product.id === product.id ? { ...entry, qty: entry.qty + qty } : entry
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const handleAddFromHero = (heroItem: HeroShowcaseItem, qty = 1) => {
    const matched = PRODUCTS.find((p) => p.id === heroItem.id) ?? {
      id: heroItem.id,
      name: heroItem.name,
      tagline: 'Artesanal',
      weight: heroItem.weight,
      category: heroItem.category,
      price: heroItem.price,
      description: heroItem.description,
      imageUrl: heroItem.imageUrl,
      accentColor: '#881337',
    };
    addToCart(matched, qty);
    setCartOpen(true);
  };

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.product.id === productId ? { ...entry, qty: entry.qty + delta } : entry
        )
        .filter((entry) => entry.qty > 0)
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-white text-[#14171F] scroll-smooth">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('inicio')}
              className="text-xl font-extrabold tracking-tight text-[#14171F] cursor-pointer"
            >
              MEZQUITE.
            </button>
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-[#52525B]">
              <button
                type="button"
                onClick={() => scrollToSection('inicio')}
                className="hover:text-[#14171F] transition cursor-pointer"
              >
                Inicio
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('productos')}
                className="hover:text-[#14171F] transition cursor-pointer"
              >
                Productos
              </button>
              <Link
                href="/beneficios"
                className="hover:text-[#14171F] transition"
              >
                Beneficios
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar yogurt, cajeta, queso"
              className="hidden sm:block w-56 md:w-64 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-4 py-1.5 text-sm text-[#14171F] placeholder:text-[#71717A] focus:outline-none focus:border-[#14171F]"
            />

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#14171F] hover:bg-[#881337] text-white px-4 py-2 text-sm font-bold transition cursor-pointer"
            >
              <span>Carrito</span>
              <span className="inline-flex items-center justify-center rounded-full bg-white text-[#14171F] text-xs font-extrabold w-5 h-5">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="inicio">
        {/* Sección principal de presentación */}
        <OrbitalHero onAddProduct={handleAddFromHero} />

        {/* Catálogo de productos */}
        <section id="productos" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="block text-[11px] font-light uppercase tracking-[0.28em] text-[#52525B] mb-1">
                CATÁLOGO ARTESANAL
              </span>
              <div className="relative inline-block">
                <h2 className="font-[family-name:var(--font-oswald)] text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-none text-[#14171F]">
                  Nuestros productos
                </h2>
                <span className="font-[family-name:var(--font-script)] text-2xl sm:text-3xl text-[#881337] -mt-2 ml-1 inline-block -rotate-3">
                  {selectedCat === 'Todos' ? 'Fresco' : selectedCat}
                </span>
              </div>
              <p className="text-sm text-[#52525B] mt-2">
                Toca cualquier tarjeta para agregarlo a tu pedido
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
                      active
                        ? 'bg-[#14171F] text-white'
                        : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  addToCart(item, 1);
                  setCartOpen(true);
                }}
                style={
                  {
                    '--card-accent': item.accentColor,
                  } as React.CSSProperties
                }
                className="group relative rounded-[28px] border border-[#E4E4E7] bg-white p-7 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer hover:border-transparent hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(0,0,0,0.22)] hover:[background-color:var(--card-accent)]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-[#52525B] group-hover:text-white/90 transition-colors duration-300 mb-6">
                    <span>{item.weight}</span>
                    <span
                      style={{ backgroundColor: item.accentColor }}
                      className="w-3 h-3 rounded-full ring-2 ring-white/40 group-hover:bg-white transition-colors duration-300"
                    />
                  </div>

                  <div className="h-52 flex items-center justify-center mb-6 px-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full w-auto object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </div>

                  <h3 className="text-xl font-extrabold text-[#14171F] group-hover:text-white transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#881337] group-hover:text-white/85 transition-colors duration-300 mt-1">
                    {item.tagline}
                  </p>
                  <p className="text-sm text-[#52525B] group-hover:text-white/90 transition-colors duration-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F4F4F5] group-hover:border-white/20 transition-colors duration-300 flex items-center justify-between">
                  <span className="text-xl font-extrabold text-[#14171F] group-hover:text-white transition-colors duration-300">
                    ${item.price}{' '}
                    <span className="text-xs font-semibold text-[#71717A] group-hover:text-white/80 transition-colors duration-300">
                      MXN
                    </span>
                  </span>
                  <span className="rounded-full bg-[#14171F] group-hover:bg-white group-hover:text-[#14171F] text-white text-xs font-extrabold px-4 py-2 transition-colors duration-300">
                    + Agregar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Beneficios en página */}
        <section id="beneficios" className="max-w-7xl mx-auto px-4 py-12 border-t border-[#E4E4E7] scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] p-6">
              <h3 className="font-extrabold text-base text-[#14171F]">Elaboración Artesanal</h3>
              <p className="text-sm text-[#52525B] mt-1">
                Recetas tradicionales cuidadas en cada lote para conservar sabor y textura.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] p-6">
              <h3 className="font-extrabold text-base text-[#14171F]">Cadena de Frío</h3>
              <p className="text-sm text-[#52525B] mt-1">
                Conservación adecuada para que cada producto llegue fresco hasta tu mesa.
              </p>
            </div>
            <div className="rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] p-6">
              <h3 className="font-extrabold text-base text-[#14171F]">Pedido Directo</h3>
              <p className="text-sm text-[#52525B] mt-1">
                Arma tu selección al instante y revisa el total de tu carrito sin complicaciones.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Panel lateral del carrito */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
                <h3 className="text-lg font-extrabold text-[#14171F]">Tu carrito ({totalItems})</h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="text-sm font-bold text-[#52525B] hover:text-[#14171F] cursor-pointer"
                >
                  Cerrar ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-[#71717A] py-12 text-center">
                  Aún no agregas productos a tu pedido.
                </p>
              ) : (
                <div className="divide-y divide-[#F4F4F5] mt-2">
                  {cart.map(({ product, qty }) => (
                    <div key={product.id} className="py-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm text-[#14171F]">{product.name}</p>
                        <p className="text-xs text-[#71717A]">
                          ${product.price} MXN · {product.weight}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="w-7 h-7 rounded-full border border-[#E4E4E7] font-bold text-sm cursor-pointer"
                        >
                          −
                        </button>
                        <span className="text-sm font-extrabold w-5 text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="w-7 h-7 rounded-full border border-[#E4E4E7] font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4E4E7] space-y-3">
              <div className="flex items-center justify-between text-base font-extrabold">
                <span>Total</span>
                <span>${totalPrice} MXN</span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="w-full rounded-full bg-[#14171F] hover:bg-[#881337] text-white py-3 text-sm font-extrabold transition cursor-pointer"
              >
                Continuar con el pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}