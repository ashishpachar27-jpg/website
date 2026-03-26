import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">Luxury Indian Fashion</p>
        <h1 className="font-display text-5xl md:text-7xl">Celebrate Style</h1>
      </motion.div>
    </section>
  );
}
