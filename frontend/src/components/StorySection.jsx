export default function StorySection() {
  return (
    <section id="story" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
      <img
        src="https://images.unsplash.com/photo-1596704017254-975f1af3f30b?auto=format&fit=crop&w=1200&q=80"
        alt="Artisan detailing couture"
        className="h-[460px] w-full rounded-2xl object-cover"
      />
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-gold">Craftsmanship</p>
        <h2 className="mt-4 font-display text-4xl">The Story Behind the Craft</h2>
        <p className="mt-6 text-white/80">
          Every silhouette is hand-finished by master artisans across India, blending timeless embroidery with modern cuts.
          We design heirloom pieces that honor heritage and celebrate contemporary confidence.
        </p>
      </div>
    </section>
  );
}
