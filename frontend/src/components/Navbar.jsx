import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-luxe' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-[0.22em] text-gold">
          AARUNYA
        </Link>
        <div className="flex items-center gap-5 text-sm uppercase tracking-[0.16em] text-white/90">
          <a href="#story" className="hover:text-gold">Story</a>
          <a href="#collections" className="hover:text-gold">Collections</a>
          <Link to="/admin" className="rounded-full border border-white/30 px-4 py-2 hover:border-gold hover:text-gold">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
