import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChefHat, Flame, Leaf, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Category, MenuItem } from "./backend";
import { useGetMenu } from "./hooks/useQueries";

const CATEGORY_ICONS: Record<string, string> = {
  "Spring Roll": "🥢",
  Momos: "🥟",
  Noodles: "🍜",
  Manchurian: "🥦",
  Soup: "🍲",
};

function MenuItemRow({ item, index }: { item: MenuItem; index: number }) {
  const markerIndex = index + 1;
  return (
    <motion.div
      data-ocid={`menu.item.row.${markerIndex}`}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between py-2.5 px-1 border-b border-border/40 last:border-0 group"
    >
      <div className="flex-1 min-w-0 pr-3">
        <span className="text-foreground font-body font-semibold text-sm sm:text-base leading-snug">
          {item.name}
        </span>
        {item.note && (
          <span className="ml-2 text-xs text-accent/90 font-body italic">
            ({item.note})
          </span>
        )}
      </div>
      <div className="flex-shrink-0">
        <span className="font-display font-bold text-primary text-sm sm:text-base tracking-wide">
          ₹{Number(item.price)}/-
        </span>
      </div>
    </motion.div>
  );
}

function CategorySection({
  category,
  sectionIndex,
}: { category: Category; sectionIndex: number }) {
  const icon = CATEGORY_ICONS[category.name] || "🍽️";
  return (
    <motion.div
      data-ocid={`menu.category.item.${sectionIndex + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="menu-card-bg rounded-xl overflow-hidden shadow-lg mb-5"
    >
      {/* Category Header */}
      <div className="category-stripe px-4 py-3 flex items-center gap-2.5">
        <span className="text-2xl" role="img" aria-label={category.name}>
          {icon}
        </span>
        <h2 className="font-display font-black text-lg sm:text-xl uppercase tracking-widest text-primary-foreground">
          {category.name}
        </h2>
      </div>

      {/* Items */}
      <div className="px-4 py-1">
        {category.items.map((item, idx) => (
          <MenuItemRow key={item.name} item={item} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div data-ocid="menu.loading_state" className="space-y-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="menu-card-bg rounded-xl overflow-hidden">
          <Skeleton className="h-12 w-full bg-muted" />
          <div className="px-4 py-2 space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between py-2">
                <Skeleton className="h-4 w-48 bg-muted" />
                <Skeleton className="h-4 w-16 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { data: menu, isLoading, isError } = useGetMenu();

  return (
    <div data-ocid="menu.page" className="min-h-screen bg-background font-body">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Background image */}
        <div className="relative h-48 sm:h-56">
          <img
            src="/assets/generated/hero-chinese-veg-food.dim_800x400.jpg"
            alt="Chinese vegetarian food spread"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        {/* Restaurant branding */}
        <div className="bg-background px-4 pt-4 pb-5 text-center relative">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 category-stripe" />

          {/* Veg badge */}
          <div className="flex justify-center mb-3">
            <Badge className="bg-green-600/90 text-white border-0 font-display font-bold uppercase tracking-widest text-xs px-4 py-1.5 gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              Only Veg Food
            </Badge>
          </div>

          {/* Restaurant name */}
          <div className="mb-1">
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase leading-none tracking-tight text-shadow-glow">
              <span className="text-primary">THE HOT</span>
              <br />
              <span className="text-accent">CHILLY</span>{" "}
              <span className="text-foreground">YAMMY</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px flex-1 max-w-16 bg-primary/40" />
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Fast Food
              </span>
              <ChefHat className="w-4 h-4 text-primary" />
            </div>
            <div className="h-px flex-1 max-w-16 bg-primary/40" />
          </div>

          {/* Decorative Chinese pattern text */}
          <p className="mt-2 text-muted-foreground/50 font-display text-xs tracking-widest uppercase">
            ✦ Fresh · Spicy · Delicious ✦
          </p>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isLoading && <LoadingSkeleton />}

          {isError && (
            <motion.div
              data-ocid="menu.error_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground font-body text-base">
                Menu load karne mein problem aa gayi. Please refresh karein.
              </p>
            </motion.div>
          )}

          {!isLoading && !isError && menu && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {menu.length === 0 ? (
                <div data-ocid="menu.empty_state" className="text-center py-12">
                  <p className="text-muted-foreground">
                    Abhi koi items nahi hain.
                  </p>
                </div>
              ) : (
                menu.map((category, idx) => (
                  <CategorySection
                    key={category.name}
                    category={category}
                    sectionIndex={idx}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Contact */}
      <footer className="bg-secondary/60 border-t border-border mt-4 px-4 py-6 text-center">
        {/* Contact numbers */}
        <div className="mb-4">
          <p className="font-display font-bold text-xs uppercase tracking-widest text-muted-foreground mb-3">
            📞 Order Karein
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:8228096793"
              data-ocid="menu.primary_button"
              className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 text-primary font-display font-bold tracking-wide hover:bg-primary/20 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              8228096793
            </a>
            <a
              href="tel:8582024063"
              data-ocid="menu.secondary_button"
              className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2 text-primary font-display font-bold tracking-wide hover:bg-primary/20 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              8582024063
            </a>
          </div>
        </div>

        <div className="border-t border-border/40 pt-4">
          <p className="text-muted-foreground text-xs font-body">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
