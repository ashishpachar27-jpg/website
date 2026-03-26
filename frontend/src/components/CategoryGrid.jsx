import { categories } from '../data/mockData';

export default function CategoryGrid() {
  return (
    <section id="collections" className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-8 font-display text-4xl">Shop by Category</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <article key={category.id} className="group relative h-72 overflow-hidden rounded-2xl">
            <img
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <h3 className="absolute bottom-4 left-4 font-display text-2xl">{category.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}
