'use client';

import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const phoneNumber = '923252538104';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi,%20I%20am%20interested%20in%20an%20artwork%20from%20Manan%20Art%20Gallery.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 group cursor-pointer"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.511 0 9.997-4.486 10.001-9.997.002-2.67-1.03-5.18-2.906-7.06C16.592 1.66 14.09 .618 11.997.618 6.486.618 2 5.104 1.997 10.614c0 1.62.48 3.208 1.393 4.607L2.4 21.03l5.882-1.543c1.383.753 2.907 1.15 4.365 1.15zM17.86 14.86c-.317-.16-1.873-.926-2.16-1.03-.287-.105-.497-.16-.707.16-.21.317-.812 1.03-.995 1.242-.18.21-.363.24-.68.08-1.56-.777-2.607-1.36-3.647-3.15-.274-.472-.274-.827-.083-1.127.11-.17.317-.412.443-.55.127-.138.16-.232.24-.39.08-.164.04-.307-.02-.465-.06-.16-.707-1.705-.97-2.336-.255-.615-.515-.532-.707-.542-.18-.01-.39-.01-.598-.01-.21 0-.552.08-.84.39-.288.317-1.1.988-1.1 2.41 0 1.42 1.037 2.793 1.18 2.985.143.193 2.04 3.114 4.944 4.368 2.628 1.134 3.267.925 3.844.82.72-.132 1.873-.767 2.133-1.472.26-.705.26-1.31.18-1.436-.08-.126-.288-.21-.606-.37z" />
      </svg>
      <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#1A1816] text-[#E5DCD3] text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 shadow-md whitespace-nowrap rounded-sm">
        Chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
