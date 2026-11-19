'use client';

import React, { useEffect, useState } from 'react';

export interface HeroShowcaseItem {
  id: number;
  name: string;
  backdropLabel: string;
  description: string;
  weight: string;
  category: 'Yogurt' | 'Cajeta' | 'Queso';
  price: number;
  titleColor: string;
  bgColors: [string, string, string];
  backdropTextColor: string;
  imageUrl: string;
}

const HERO_ITEMS: HeroShowcaseItem[] = [
  {
    id: 1,
    name: 'Yogurt Natural',
    backdropLabel: 'YOGURT',
    description: 'Elaborado con leche fresca y cultivos vivos para una textura cremosa y balanceada.',
    weight: '1 L',
    category: 'Yogurt',
    price: 68,
    titleColor: '#0284C7',
    bgColors: ['#F59E0B', '#EA580C', '#B45309'],
    backdropTextColor: 'rgba(255, 255, 255, 0.24)',
    imageUrl: '/hero/yogurt-main.png',
  },
  {
    id: 2,
    name: 'Cajeta Quemada',
    backdropLabel: 'CAJETA',
    description: 'Cocida lentamente en cazo con sabor caramelizado profundo y consistencia sedosa.',
    weight: '660 GR',
    category: 'Cajeta',
    price: 115,
    titleColor: '#881337',
    bgColors: ['#BE123C', '#881337', '#4C0519'],
    backdropTextColor: 'rgba(255, 255, 255, 0.22)',
    imageUrl: '/hero/cajeta-main.png',
  },
  {
    id: 3,
    name: 'Queso Fresco',
    backdropLabel: 'QUESO',
    description: 'De sabor suave y limpio, ideal para acompañar platillos del día con frescura artesanal.',
    weight: '500 GR',
    category: 'Queso',
    price: 89,
    titleColor: '#15803D',
    bgColors: ['#16A34A', '#15803D', '#14532D'],
    backdropTextColor: 'rgba(255, 255, 255, 0.22)',
    imageUrl: '/hero/queso-main.png',
  },
];

function MovingHeroImage({
  src,
  alt,
  isTransitioning,
  floatOffset,
}: {
  src: string;
  alt: string;
  isTransitioning: boolean;
  floatOffset: number;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div
        style={{
          transform: isTransitioning
            ? 'scale(0.96) translateY(8px)'
            : `scale(1) translateY(${floatOffset}px)`,
        }}
        className={`transition-all duration-[550ms] ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="w-72 h-72 sm:w-80 sm:h-80 md:w-[26rem] md:h-[26rem] object-contain select-none pointer-events-none"
          />
        ) : (
          <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-[26rem] md:h-[26rem] flex items-center justify-center text-white/70 text-sm font-extrabold tracking-widest uppercase select-none pointer-events-none">
            {alt}
          </div>
        )}
      </div>

      {/* Sombra suave difuminada debajo de la imagen */}
      <div
        style={{
          transform: `scale(${isTransitioning ? 0.8 : 1 - Math.abs(floatOffset) * 0.012})`,
        }}
        className="w-64 sm:w-72 h-6 rounded-full bg-black/45 blur-xl -mt-3 transition-all duration-[550ms] ease-in-out pointer-events-none"
      />
    </div>
  );
}

export default function OrbitalHero({
  onAddProduct,
}: {
  onAddProduct?: (item: HeroShowcaseItem, qty?: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tick, setTick] = useState(0);

  // Duración de 4 segundos por producto
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_ITEMS.length);
        setIsTransitioning(false);
      }, 450);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Movimiento continuo suave del fondo y de la imagen
  useEffect(() => {
    const motionInterval = setInterval(() => {
      setTick((t) => (t + 1) % 360);
    }, 45);
    return () => clearInterval(motionInterval);
  }, []);

  const current = HERO_ITEMS[activeIndex];
  const rad = (tick * Math.PI) / 60;
  const mainFloat = Math.sin(rad) * 10;
  const bgPosX = 50 + Math.cos(rad * 0.6) * 28;
  const bgPosY = 50 + Math.sin(rad * 0.6) * 22;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-6 bg-white">
      <div
        style={{
          backgroundImage: `radial-gradient(circle at ${bgPosX}% ${bgPosY}%, ${current.bgColors[0]} 0%, ${current.bgColors[1]} 55%, ${current.bgColors[2]} 100%)`,
        }}
        className="relative rounded-[32px] border border-[#14171F]/10 overflow-hidden min-h-[490px] md:min-h-[550px] p-6 sm:p-10 md:p-12 flex flex-col justify-between text-white transition-all duration-[550ms] ease-in-out shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
      >
        {/* Letras grandes del nombre del producto atrás de la imagen */}
        <div
          style={{
            color: current.backdropTextColor,
            transform: `translateX(${Math.sin(rad * 0.4) * 18}px) ${
              isTransitioning ? 'scale(0.97)' : 'scale(1)'
            }`,
          }}
          className={`pointer-events-none select-none z-0 absolute inset-0 flex items-center justify-center overflow-hidden transition-all duration-[550ms] ease-in-out ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="text-[5.5rem] sm:text-[8.5rem] md:text-[12rem] font-extrabold tracking-tight uppercase leading-none whitespace-nowrap">
            {current.backdropLabel}
          </span>
        </div>

        {/* Fila superior */}
        <div className="flex items-center justify-between z-10">
          <span
            className={`text-xs font-extrabold uppercase tracking-widest text-white/90 transition-opacity duration-[550ms] ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {current.category} · {current.weight}
          </span>
        </div>

        {/* Cuerpo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 my-4 z-10">
          <div
            className={`lg:col-span-5 space-y-3 transition-all duration-[550ms] ease-in-out ${
              isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.04] text-white drop-shadow-xs">
              {current.name}
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-md">
              {current.description}
            </p>
          </div>

          <div className="lg:col-span-7 flex items-center justify-center relative z-20">
            <MovingHeroImage
              src={current.imageUrl}
              alt={current.name}
              isTransitioning={isTransitioning}
              floatOffset={mainFloat}
            />
          </div>
        </div>

        <div className="h-2 z-10" />
      </div>
    </section>
  );
}