'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ThreeContainerItem {
  id: 'tall-cup' | 'bottle' | 'medium-tub';
  title: string;
  detail: string;
}

const THREE_CONTAINERS: ThreeContainerItem[] = [
  {
    id: 'tall-cup',
    title: 'Energía diaria',
    detail:
      'Acompaña tus mañanas con proteínas, calcio, minerales y cultivos naturales.',
  },
  {
    id: 'bottle',
    title: 'Rico en nutrientes',
    detail:
      'Aporta proteínas, carbohidratos, minerales, calcio, vitaminas (B2, B9, B12), zinc, fósforo, magnesio, potasio, fermentos naturales y más.',
  },
  {
    id: 'medium-tub',
    title: 'Frescura en casa',
    detail:
      'Ideal para compartir en desayunos o bowls con sabor artesanal y fermentos vivos.',
  },
];

function SingleContainer({
  item,
  isHovered,
  onEnter,
  onLeave,
}: {
  item: ThreeContainerItem;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const fillColor = isHovered ? '#49C5FF' : '#052354';

  if (item.id === 'tall-cup') {
    return (
      <button
        type="button"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-label={item.title}
        className={`relative flex items-center justify-center w-52 sm:w-64 md:w-72 h-[22rem] sm:h-[26rem] md:h-[29rem] transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
          isHovered ? 'scale-[1.05] -translate-y-2 z-20' : 'scale-100 z-10'
        }`}
      >
        <svg viewBox="0 0 240 380" className="w-full h-full">
          <path
            d="M12 22 H228 V38 H215 L194 348 C193 360 183 369 171 369 H69 C57 369 47 360 46 348 L25 38 H12 Z"
            fill={fillColor}
            className="transition-colors duration-300"
          />
        </svg>
        {isHovered && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-white px-9 sm:px-11 pt-6">
            <h2 className="w-full max-w-[145px] text-base sm:text-lg font-extrabold leading-tight break-words">
              {item.title}
            </h2>
            <p className="w-full max-w-[140px] mt-2.5 text-[11px] sm:text-xs leading-[1.35] font-medium text-white/95 break-words">
              {item.detail}
            </p>
          </div>
        )}
      </button>
    );
  }

  if (item.id === 'bottle') {
    return (
      <button
        type="button"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-label={item.title}
        className={`relative flex items-center justify-center w-52 sm:w-60 md:w-64 h-[25rem] sm:h-[29rem] md:h-[32rem] transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
          isHovered ? 'scale-[1.05] -translate-y-2 z-20' : 'scale-100 z-10'
        }`}
      >
        <svg viewBox="0 0 220 440" className="w-full h-full">
          <path
            d="M72 10 H148 V25 H142 L146 36 L140 42 L148 56 C152 64 154 74 154 88 L158 134 C159 148 164 160 172 170 C180 180 184 194 184 212 V396 C184 418 168 432 146 432 H74 C52 432 36 418 36 396 V212 C36 194 40 180 48 170 C56 160 61 148 62 134 L66 88 C66 74 68 64 72 56 L80 42 L74 36 L78 25 H72 Z"
            fill={fillColor}
            className="transition-colors duration-300"
          />
        </svg>
        {isHovered && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-white px-10 pt-10">
            <h2 className="w-full max-w-[118px] text-sm sm:text-[15px] font-extrabold leading-tight break-words">
              {item.title}
            </h2>
            <p className="w-full max-w-[116px] mt-2 text-[10px] sm:text-[10.5px] leading-[1.3] font-medium text-white/95 break-words">
              {item.detail}
            </p>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={item.title}
      className={`relative flex items-center justify-center w-52 sm:w-64 md:w-72 h-[15.5rem] sm:h-[18.5rem] md:h-[20.5rem] transition-all duration-300 ease-out cursor-pointer focus:outline-none ${
        isHovered ? 'scale-[1.05] -translate-y-2 z-20' : 'scale-100 z-10'
      }`}
    >
      <svg viewBox="0 0 250 260" className="w-full h-full">
        <path
          d="M12 34 H238 V50 H224 L210 232 C209 243 200 251 189 251 H61 C50 251 41 243 40 232 L26 50 H12 Z"
          fill={fillColor}
          className="transition-colors duration-300"
        />
      </svg>
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-white px-9 sm:px-11 pt-6">
          <h2 className="w-full max-w-[145px] text-sm sm:text-base font-extrabold leading-tight break-words">
            {item.title}
          </h2>
          <p className="w-full max-w-[140px] mt-2 text-[10.5px] sm:text-[11px] leading-[1.3] font-medium text-white/95 break-words">
            {item.detail}
          </p>
        </div>
      )}
    </button>
  );
}

export default function BeneficiosPage() {
  const [hoveredId, setHoveredId] = useState<ThreeContainerItem['id'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white text-[#052354] flex flex-col justify-between">
      {/* Encabezado igual al de la primera imagen */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-extrabold tracking-tight text-[#14171F]">
              MEZQUITE.
            </Link>
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-[#52525B]">
              <Link href="/" className="hover:text-[#14171F] transition">
                Inicio
              </Link>
              <Link href="/#productos" className="hover:text-[#14171F] transition">
                Productos
              </Link>
              <Link href="/beneficios" className="text-[#14171F] font-bold transition">
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

            <Link
              href="/"
              className="flex items-center gap-2 rounded-full bg-[#14171F] hover:bg-[#881337] text-white px-4 py-2 text-sm font-bold transition"
            >
              <span>Carrito</span>
              <span className="inline-flex items-center justify-center rounded-full bg-white text-[#14171F] text-xs font-extrabold w-5 h-5">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="font-serif text-lg sm:text-xl font-bold text-[#052354]">
            ¿Cómo sería el
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-[4.25rem] font-bold tracking-tight leading-[1.03] text-[#052354] mt-1">
            yoghurt de tus sueños?
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8">
          {THREE_CONTAINERS.map((item) => (
            <SingleContainer
              key={item.id}
              item={item}
              isHovered={hoveredId === item.id}
              onEnter={() => setHoveredId(item.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </main>

      <div className="h-6" />
    </div>
  );
}