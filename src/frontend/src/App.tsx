import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Copy,
  Leaf,
  Minus,
  Phone,
  Plus,
  QrCode,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import type { Category, MenuItem } from "./backend";
import { useGetMenu } from "./hooks/useQueries";

const CATEGORY_ICONS: Record<string, string> = {
  "Spring Roll": "🥢",
  Momos: "🥟",
  Noodles: "🍜",
  Manchurian: "🥦",
  Rice: "🍚",
  Soup: "🍲",
};

const DISH_IMAGES: Record<string, string> = {
  // Spring Roll
  "Veg Roll": "/assets/generated/veg-roll.dim_400x400.jpg",
  "Veg Spring Roll": "/assets/generated/veg-spring-roll.dim_400x400.jpg",
  "Paneer Roll": "/assets/generated/paneer-roll.dim_400x400.jpg",
  "Cheese Roll": "/assets/generated/cheese-roll.dim_400x400.jpg",
  // Momos
  "Veg Momo": "/assets/generated/veg-momo.dim_400x400.jpg",
  "Veg Chilli Momo": "/assets/generated/veg-chilli-momo.dim_400x400.jpg",
  "Paneer Momo Fry": "/assets/generated/paneer-momo-fry.dim_400x400.jpg",
  "Saucy Momos": "/assets/generated/saucy-momos.dim_400x400.jpg",
  // Noodles
  "Veg Noodles": "/assets/generated/veg-noodles.dim_400x400.jpg",
  "Veg Schezwan Noodles":
    "/assets/generated/veg-schezwan-noodles.dim_400x400.jpg",
  "Hakka Noodles": "/assets/generated/hakka-noodles.dim_400x400.jpg",
  "Paneer Noodles": "/assets/generated/paneer-noodles.dim_400x400.jpg",
  // Manchurian
  "Veg Manchurian": "/assets/generated/veg-manchurian.dim_400x400.jpg",
  "Veg Soya Chilli": "/assets/uploads/images-2.jpeg",
  "Mushroom Chilli": "/assets/generated/mushroom-chilli.dim_400x400.jpg",
  "Paneer Chilli": "/assets/uploads/chilli-paneer-recipe-1-1.jpg",
  "Mushroom 65": "/assets/generated/mushroom-65.dim_400x400.jpg",
  "Paneer 65": "/assets/generated/paneer-65.dim_400x400.jpg",
  // Rice
  "Veg Fry Rice": "/assets/generated/veg-fry-rice.dim_400x400.jpg",
  "Paneer Fry Rice": "/assets/generated/paneer-fry-rice.dim_400x400.jpg",
  // Soup
  "Hot & Sour Soup": "/assets/generated/hot-sour-soup.dim_400x400.jpg",
};

const FALLBACK_GRADIENT =
  "linear-gradient(135deg, oklch(0.20 0.10 150) 0%, oklch(0.30 0.16 145) 100%)";

type CartItem = { name: string; price: number; quantity: number };
type OfferState = { discountPercent: number; active: boolean };

const OFFER_KEY = "hcy_offer";
const ADMIN_PASSWORD = "8228096793";

function getOffer(): OfferState {
  try {
    const raw = localStorage.getItem(OFFER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { discountPercent: 0, active: false };
}

function saveOffer(offer: OfferState) {
  localStorage.setItem(OFFER_KEY, JSON.stringify(offer));
}

// ---------- Admin Page ----------
function AdminPage({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [offer, setOffer] = useState<OfferState>(getOffer);
  const [saved, setSaved] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Wrong password. Please try again.");
    }
  };

  const handleSave = () => {
    saveOffer(offer);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      data-ocid="admin.page"
      className="min-h-screen font-body flex flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.08 0.04 150), oklch(0.05 0.02 150))",
      }}
    >
      {/* Back button */}
      <button
        type="button"
        data-ocid="admin.back_button"
        onClick={onBack}
        className="absolute top-5 left-5 flex items-center gap-2 font-body text-sm transition-opacity hover:opacity-80"
        style={{ color: "oklch(0.75 0.15 80)" }}
      >
        ← Back to Menu
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.20 150), oklch(0.35 0.14 150))",
              boxShadow: "0 8px 24px oklch(0.48 0.20 150 / 0.4)",
            }}
          >
            <span className="text-2xl">🔐</span>
          </div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: "oklch(0.96 0.015 70)" }}
          >
            Admin Panel
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "oklch(0.55 0.08 140)" }}
          >
            The Hot Chilly Yammy
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.12 0.05 150), oklch(0.09 0.03 150))",
            border: "1px solid oklch(0.55 0.20 150 / 0.25)",
            boxShadow: "0 8px 40px oklch(0.04 0.02 150 / 0.6)",
          }}
        >
          {!authed ? (
            /* Login form */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="admin-pass"
                  className="font-body font-semibold text-sm"
                  style={{ color: "oklch(0.80 0.05 70)" }}
                >
                  Password
                </Label>
                <Input
                  id="admin-pass"
                  data-ocid="admin.input"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="font-body"
                  style={{
                    background: "oklch(0.16 0.06 150 / 0.7)",
                    border: "1px solid oklch(0.30 0.10 150 / 0.8)",
                    color: "oklch(0.96 0.015 70)",
                  }}
                />
              </div>
              {error && (
                <p
                  data-ocid="admin.error_state"
                  className="text-sm font-body"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                data-ocid="admin.submit_button"
                onClick={handleLogin}
                className="w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.50 0.20 150) 0%, oklch(0.38 0.16 150) 100%)",
                  color: "oklch(0.97 0.01 70)",
                  boxShadow: "0 4px 20px oklch(0.50 0.20 150 / 0.40)",
                }}
              >
                Login
              </button>
            </div>
          ) : (
            /* Offer control panel */
            <div className="space-y-5">
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: "oklch(0.16 0.07 150 / 0.5)",
                  border: "1px solid oklch(0.55 0.20 150 / 0.20)",
                }}
              >
                <p
                  className="font-body text-xs uppercase tracking-widest mb-3"
                  style={{ color: "oklch(0.75 0.15 80 / 0.8)" }}
                >
                  ✦ Offer Settings
                </p>

                {/* Discount percent */}
                <div className="space-y-2 mb-4">
                  <Label
                    htmlFor="discount-pct"
                    className="font-body font-semibold text-sm"
                    style={{ color: "oklch(0.90 0.05 70)" }}
                  >
                    Discount % (0–100)
                  </Label>
                  <Input
                    id="discount-pct"
                    data-ocid="admin.discount_input"
                    type="number"
                    min={0}
                    max={100}
                    value={offer.discountPercent}
                    onChange={(e) =>
                      setOffer((prev) => ({
                        ...prev,
                        discountPercent: Math.min(
                          100,
                          Math.max(0, Number(e.target.value)),
                        ),
                      }))
                    }
                    className="font-display font-bold text-lg"
                    style={{
                      background: "oklch(0.16 0.06 150 / 0.7)",
                      border: "1px solid oklch(0.30 0.10 150 / 0.8)",
                      color: "oklch(0.75 0.15 80)",
                    }}
                  />
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="offer-active"
                    className="font-body font-semibold text-sm"
                    style={{ color: "oklch(0.90 0.05 70)" }}
                  >
                    Offer Active
                  </Label>
                  <Switch
                    id="offer-active"
                    data-ocid="admin.offer_switch"
                    checked={offer.active}
                    onCheckedChange={(v) =>
                      setOffer((prev) => ({ ...prev, active: v }))
                    }
                  />
                </div>
              </div>

              {/* Preview */}
              {offer.active && offer.discountPercent > 0 && (
                <div
                  className="rounded-xl px-4 py-3 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.18 0.10 80 / 0.3), oklch(0.14 0.08 80 / 0.2))",
                    border: "1px solid oklch(0.75 0.15 80 / 0.4)",
                  }}
                >
                  <p
                    className="font-display font-bold text-sm"
                    style={{ color: "oklch(0.75 0.15 80)" }}
                  >
                    🎉 {offer.discountPercent}% OFF — Live Preview
                  </p>
                </div>
              )}

              <button
                type="button"
                data-ocid="admin.save_button"
                onClick={handleSave}
                className="w-full py-3 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
                style={{
                  background: saved
                    ? "linear-gradient(135deg, oklch(0.50 0.18 150), oklch(0.38 0.14 150))"
                    : "linear-gradient(135deg, oklch(0.68 0.14 80), oklch(0.55 0.16 75))",
                  color: "oklch(0.08 0.03 150)",
                  boxShadow: "0 4px 20px oklch(0.68 0.14 80 / 0.35)",
                }}
              >
                {saved ? "✓ Saved!" : "Save Offer"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ---------- QR Code Page ----------
function QrPage({ onBack }: { onBack: () => void }) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://thehot chillyyammy.app";

  const handleDownload = () => {
    const canvas = document.querySelector(
      "#qr-canvas canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "HotChillyYammy-QR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      data-ocid="qr.page"
      className="min-h-screen font-body flex flex-col items-center justify-center px-4 py-16"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.08 0.04 150), oklch(0.05 0.02 150))",
      }}
    >
      <button
        type="button"
        data-ocid="qr.back_button"
        onClick={onBack}
        className="absolute top-5 left-5 flex items-center gap-2 font-body text-sm transition-opacity hover:opacity-80"
        style={{ color: "oklch(0.75 0.15 80)" }}
      >
        ← Back to Menu
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs text-center"
      >
        {/* Title */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.14 80), oklch(0.55 0.16 75))",
              boxShadow: "0 8px 24px oklch(0.68 0.14 80 / 0.4)",
            }}
          >
            <QrCode
              className="w-8 h-8"
              style={{ color: "oklch(0.08 0.03 150)" }}
            />
          </div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: "oklch(0.96 0.015 70)" }}
          >
            App QR Code
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "oklch(0.55 0.08 140)" }}
          >
            The Hot Chilly Yammy
          </p>
        </div>

        {/* QR Code card */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "oklch(0.97 0.01 70)",
            boxShadow: "0 16px 48px oklch(0.04 0.02 150 / 0.7)",
          }}
        >
          <div id="qr-canvas" className="flex items-center justify-center">
            <QRCodeCanvas
              ref={qrRef}
              value={appUrl}
              size={220}
              bgColor="oklch(0.97 0.01 70)"
              fgColor="oklch(0.10 0.04 150)"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        <p
          className="font-display text-sm mb-6 leading-relaxed"
          style={{ color: "oklch(0.75 0.10 70)" }}
        >
          📱 Yeh QR code scan karke seedha app khulega
        </p>

        <button
          type="button"
          data-ocid="qr.download_button"
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl font-display font-bold text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.68 0.14 80), oklch(0.55 0.16 75))",
            color: "oklch(0.08 0.03 150)",
            boxShadow: "0 4px 20px oklch(0.68 0.14 80 / 0.35)",
          }}
        >
          ⬇ Download QR Code
        </button>

        <p
          className="mt-4 text-xs font-body break-all"
          style={{ color: "oklch(0.40 0.05 140)" }}
        >
          {appUrl}
        </p>
      </motion.div>
    </div>
  );
}

// ---------- Offer Banner ----------
function OfferBanner({ offer }: { offer: OfferState }) {
  if (!offer.active || offer.discountPercent <= 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="menu.offer_banner"
      className="mx-4 mt-4 rounded-xl px-4 py-3 text-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.10 80 / 0.35), oklch(0.14 0.08 80 / 0.25))",
        border: "1px solid oklch(0.75 0.15 80 / 0.5)",
        boxShadow:
          "0 4px 20px oklch(0.68 0.14 80 / 0.15), inset 0 1px 0 oklch(0.75 0.15 80 / 0.15)",
      }}
    >
      <p
        className="font-display font-bold text-base tracking-wide"
        style={{
          color: "oklch(0.80 0.18 80)",
          textShadow: "0 0 16px oklch(0.75 0.15 80 / 0.4)",
        }}
      >
        🎉 Special Offer: {offer.discountPercent}% OFF on all items!
      </p>
      <p
        className="text-xs font-body mt-0.5"
        style={{ color: "oklch(0.75 0.15 80 / 0.75)" }}
      >
        Aaj sirf limited time ke liye!
      </p>
    </motion.div>
  );
}

// ---------- Menu Item Card ----------
function MenuItemCard({
  item,
  index,
  onAdd,
  offer,
}: {
  item: MenuItem;
  index: number;
  onAdd: (item: MenuItem) => void;
  offer: OfferState;
}) {
  const markerIndex = index + 1;
  const dishImage = DISH_IMAGES[item.name];
  const originalPrice = Number(item.price);
  const discounted =
    offer.active && offer.discountPercent > 0
      ? Math.round(originalPrice * (1 - offer.discountPercent / 100))
      : null;

  return (
    <motion.div
      data-ocid={`menu.item.${markerIndex}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="dish-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* Square photo area */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        {dishImage ? (
          <img
            src={dishImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: FALLBACK_GRADIENT }}
          />
        )}
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.07 0.04 150 / 0.10) 0%, oklch(0.07 0.04 150 / 0.55) 100%)",
          }}
        />
        {/* Veg dot */}
        <div
          className="absolute top-2 left-2 w-5 h-5 rounded-sm border-2 flex items-center justify-center"
          style={{
            borderColor: "oklch(0.60 0.22 145)",
            background: "oklch(0.07 0.04 150 / 0.7)",
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "oklch(0.60 0.22 145)" }}
          />
        </div>
        {/* Offer badge */}
        {discounted !== null && (
          <div
            className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-xs font-display font-bold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.14 80), oklch(0.55 0.16 75))",
              color: "oklch(0.08 0.03 150)",
            }}
          >
            -{offer.discountPercent}%
          </div>
        )}
      </div>

      {/* Card bottom info */}
      <div
        className="px-2.5 pt-2.5 pb-2 flex flex-col gap-1.5 flex-1 relative"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.13 0.05 150) 0%, oklch(0.10 0.04 150) 100%)",
        }}
      >
        {/* Top gold accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.75 0.15 80 / 0.5), transparent)",
          }}
        />

        <p
          className="font-display font-bold text-sm leading-tight"
          style={{ color: "oklch(0.96 0.015 70)" }}
        >
          {item.name}
          {(item as { note?: string }).note && (
            <span
              className="block font-body font-normal text-xs italic mt-0.5"
              style={{ color: "oklch(0.60 0.08 150)" }}
            >
              {(item as { note?: string }).note}
            </span>
          )}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {discounted !== null ? (
              <>
                <span
                  className="font-body text-xs line-through"
                  style={{ color: "oklch(0.50 0.06 140)" }}
                >
                  ₹{originalPrice}/-
                </span>
                <span
                  className="font-display font-bold text-sm tracking-wide"
                  style={{
                    color: "oklch(0.75 0.15 80)",
                    textShadow: "0 0 12px oklch(0.75 0.15 80 / 0.4)",
                  }}
                >
                  ₹{discounted}/-
                </span>
              </>
            ) : (
              <span
                className="font-display font-bold text-sm tracking-wide"
                style={{
                  color: "oklch(0.75 0.15 80)",
                  textShadow: "0 0 12px oklch(0.75 0.15 80 / 0.4)",
                }}
              >
                ₹{originalPrice}/-
              </span>
            )}
          </div>

          <button
            type="button"
            data-ocid={`menu.item.button.${markerIndex}`}
            onClick={() => onAdd(item)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.20 150), oklch(0.35 0.14 150))",
              border: "1px solid oklch(0.60 0.20 150 / 0.5)",
              boxShadow: "0 2px 8px oklch(0.04 0.02 150 / 0.6)",
            }}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus
              className="w-3.5 h-3.5"
              style={{ color: "oklch(0.97 0.01 70)" }}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection({
  category,
  sectionIndex,
  onAdd,
  offer,
}: {
  category: Category;
  sectionIndex: number;
  onAdd: (item: MenuItem) => void;
  offer: OfferState;
}) {
  const icon = CATEGORY_ICONS[category.name] || "🍽️";
  return (
    <motion.div
      data-ocid={`menu.category.item.${sectionIndex + 1}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.6,
        delay: sectionIndex * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="menu-card-bg rounded-xl overflow-hidden mb-5"
    >
      {/* Category header */}
      <div className="category-stripe px-5 py-3.5 flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={category.name}>
          {icon}
        </span>
        <h2
          className="font-display font-bold text-xl sm:text-2xl tracking-[0.12em]"
          style={{
            color: "oklch(0.96 0.015 70)",
            textShadow: "0 1px 3px oklch(0.04 0.02 150 / 0.8)",
          }}
        >
          {category.name}
        </h2>
        <div
          className="ml-auto text-xs tracking-[0.4em] font-display"
          style={{ color: "oklch(0.75 0.15 80 / 0.7)" }}
        >
          ✦
        </div>
      </div>

      {/* Square grid */}
      <div className="p-3 grid grid-cols-2 gap-3">
        {category.items.map((item, idx) => (
          <MenuItemCard
            key={item.name}
            item={item}
            index={idx}
            onAdd={onAdd}
            offer={offer}
          />
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
          <Skeleton className="h-14 w-full bg-muted" />
          <div className="p-3 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="rounded-xl overflow-hidden">
                <Skeleton
                  className="w-full bg-muted"
                  style={{ aspectRatio: "1 / 1" }}
                />
                <Skeleton className="h-10 w-full bg-muted mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const UPI_ID = "8582024063@paytm";

function UpiPanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      data-ocid="order.upi_panel"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="mt-3 rounded-xl px-4 py-3.5"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.08 150 / 0.4), oklch(0.13 0.05 150 / 0.5))",
        border: "1px solid oklch(0.75 0.15 80 / 0.40)",
        boxShadow: "inset 0 1px 0 oklch(0.75 0.15 80 / 0.12)",
      }}
    >
      <p
        className="text-xs font-body font-semibold uppercase tracking-wider mb-2.5"
        style={{ color: "oklch(0.75 0.15 80 / 0.85)" }}
      >
        ✦ UPI Payment ID
      </p>
      <div className="flex items-center justify-between gap-3">
        <span
          className="font-display font-bold text-base tracking-wide select-all"
          style={{ color: "oklch(0.96 0.015 70)" }}
        >
          {UPI_ID}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy UPI ID"
          className="flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
          style={{
            background: "oklch(0.55 0.20 150 / 0.15)",
            border: "1px solid oklch(0.75 0.15 80 / 0.45)",
            color: "oklch(0.96 0.015 70)",
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <p
        className="text-xs font-body mt-2"
        style={{ color: "oklch(0.55 0.20 150 / 0.55)" }}
      >
        Is ID pe payment karke order bhejein.
      </p>
    </motion.div>
  );
}

function OrderSheet({
  open,
  onClose,
  cart,
  onIncrease,
  onDecrease,
  onRemove,
  offer,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onIncrease: (name: string) => void;
  onDecrease: (name: string) => void;
  onRemove: (name: string) => void;
  offer: OfferState;
}) {
  const [naam, setNaam] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const originalTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount =
    offer.active && offer.discountPercent > 0
      ? Math.round(originalTotal * (offer.discountPercent / 100))
      : 0;
  const grandTotal = originalTotal - discountAmount;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!naam.trim()) errs.naam = "Naam zaroori hai";
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone.trim()))
      errs.phone = "10 digit phone number daalein";
    if (!address.trim()) errs.address = "Address zaroori hai";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const itemLines = cart
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`,
      )
      .join("\n");

    const discountLine =
      discountAmount > 0
        ? `\nDiscount Applied: ${offer.discountPercent}%\nDiscount Amount: ₹${discountAmount}\nOriginal Total: ₹${originalTotal}\nFinal Total: ₹${grandTotal}`
        : `\nTotal: ₹${grandTotal}`;

    const message = `🛒 New Order - The Hot Chilly Yammy\n\nItems:\n${itemLines}${discountLine}\n\nCustomer:\nName: ${naam}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/918582024063?text=${encoded}`, "_blank");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        data-ocid="order.sheet"
        className="rounded-t-2xl max-h-[90vh] flex flex-col p-0"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.12 0.05 150), oklch(0.08 0.03 150))",
          borderTop: "1px solid oklch(0.55 0.20 150 / 0.35)",
          boxShadow: "0 -8px 40px oklch(0.04 0.02 150 / 0.8)",
        }}
      >
        <SheetHeader
          className="px-5 pt-5 pb-3.5"
          style={{ borderBottom: "1px solid oklch(0.55 0.20 150 / 0.2)" }}
        >
          <SheetTitle
            className="font-display font-bold text-xl flex items-center gap-2.5"
            style={{
              color: "oklch(0.96 0.015 70)",
              textShadow: "0 0 20px oklch(0.55 0.20 150 / 0.4)",
            }}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "oklch(0.75 0.15 80)" }}
            />
            Aapka Order
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {cart.length === 0 ? (
              <p
                data-ocid="order.empty_state"
                className="text-center py-8 font-body text-lg"
                style={{ color: "oklch(0.52 0.05 140)" }}
              >
                Cart khali hai. Menu se items add karein.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {cart.map((item, idx) => (
                    <div
                      key={item.name}
                      data-ocid={`order.item.${idx + 1}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{
                        background: "oklch(0.16 0.06 150 / 0.6)",
                        border: "1px solid oklch(0.55 0.20 150 / 0.18)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-base text-foreground truncate">
                          {item.name}
                        </p>
                        <p
                          className="text-sm font-display"
                          style={{ color: "oklch(0.75 0.15 80)" }}
                        >
                          ₹{item.price} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          data-ocid={`order.item.delete_button.${idx + 1}`}
                          onClick={() => onDecrease(item.name)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            background: "oklch(0.16 0.05 150)",
                            border: "1px solid oklch(0.28 0.10 150)",
                          }}
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus
                            className="w-3 h-3 text-foreground"
                            strokeWidth={3}
                          />
                        </button>
                        <span className="font-display font-bold text-sm text-foreground w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrease(item.name)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.48 0.20 150), oklch(0.35 0.14 150))",
                            border: "1px solid oklch(0.55 0.20 150 / 0.35)",
                          }}
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus
                            className="w-3 h-3"
                            style={{ color: "oklch(0.97 0.01 70)" }}
                            strokeWidth={3}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(item.name)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-1"
                          style={{
                            background: "oklch(0.16 0.08 25 / 0.5)",
                            border: "1px solid oklch(0.50 0.22 25 / 0.4)",
                          }}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2
                            className="w-3 h-3"
                            style={{ color: "oklch(0.65 0.22 25)" }}
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order total */}
                <div
                  className="rounded-xl px-4 py-3 space-y-1.5"
                  style={{
                    background: "oklch(0.16 0.06 150 / 0.5)",
                    border: "1px solid oklch(0.55 0.20 150 / 0.18)",
                  }}
                >
                  {discountAmount > 0 ? (
                    <>
                      <div className="flex justify-between text-sm font-body">
                        <span style={{ color: "oklch(0.65 0.07 140)" }}>
                          Original Total
                        </span>
                        <span style={{ color: "oklch(0.65 0.07 140)" }}>
                          ₹{originalTotal}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-body">
                        <span style={{ color: "oklch(0.75 0.15 80)" }}>
                          Discount ({offer.discountPercent}%)
                        </span>
                        <span style={{ color: "oklch(0.75 0.15 80)" }}>
                          - ₹{discountAmount}
                        </span>
                      </div>
                      <Separator
                        style={{ background: "oklch(0.55 0.20 150 / 0.2)" }}
                      />
                      <div className="flex justify-between font-display font-bold text-base">
                        <span style={{ color: "oklch(0.96 0.015 70)" }}>
                          Final Total
                        </span>
                        <span style={{ color: "oklch(0.75 0.15 80)" }}>
                          ₹{grandTotal}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-display font-bold text-base">
                      <span style={{ color: "oklch(0.96 0.015 70)" }}>
                        Total
                      </span>
                      <span style={{ color: "oklch(0.75 0.15 80)" }}>
                        ₹{grandTotal}
                      </span>
                    </div>
                  )}
                </div>

                <Separator
                  style={{ background: "oklch(0.55 0.20 150 / 0.2)" }}
                />

                {/* Customer details */}
                <div className="space-y-3">
                  <p
                    className="font-display font-bold text-base"
                    style={{ color: "oklch(0.96 0.015 70)" }}
                  >
                    Delivery Details
                  </p>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="order-naam"
                      className="font-body font-semibold text-sm text-foreground/80"
                    >
                      Naam *
                    </Label>
                    <Input
                      id="order-naam"
                      data-ocid="order.name_input"
                      type="text"
                      placeholder="Aapka naam"
                      value={naam}
                      onChange={(e) => setNaam(e.target.value)}
                      className="font-body text-foreground placeholder:text-muted-foreground/60"
                      style={{
                        background: "oklch(0.16 0.06 150 / 0.7)",
                        border: "1px solid oklch(0.30 0.10 150 / 0.8)",
                      }}
                    />
                    {errors.naam && (
                      <p
                        data-ocid="order.name_error"
                        className="text-destructive text-xs font-body"
                      >
                        {errors.naam}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="order-phone"
                      className="font-body font-semibold text-sm text-foreground/80"
                    >
                      Phone *
                    </Label>
                    <Input
                      id="order-phone"
                      data-ocid="order.phone_input"
                      type="tel"
                      placeholder="10 digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="font-body text-foreground placeholder:text-muted-foreground/60"
                      style={{
                        background: "oklch(0.16 0.06 150 / 0.7)",
                        border: "1px solid oklch(0.30 0.10 150 / 0.8)",
                      }}
                    />
                    {errors.phone && (
                      <p
                        data-ocid="order.phone_error"
                        className="text-destructive text-xs font-body"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="order-address"
                      className="font-body font-semibold text-sm text-foreground/80"
                    >
                      Address *
                    </Label>
                    <Textarea
                      id="order-address"
                      data-ocid="order.address_input"
                      placeholder="Ghar ka pura address daalein"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="font-body text-foreground placeholder:text-muted-foreground/60 resize-none"
                      style={{
                        background: "oklch(0.16 0.06 150 / 0.7)",
                        border: "1px solid oklch(0.30 0.10 150 / 0.8)",
                      }}
                    />
                    {errors.address && (
                      <p
                        data-ocid="order.address_error"
                        className="text-destructive text-xs font-body"
                      >
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="space-y-2">
                    <Label className="font-body font-semibold text-sm text-foreground/80">
                      Payment Method *
                    </Label>
                    <RadioGroup
                      value={payment}
                      onValueChange={setPayment}
                      className="flex gap-3"
                    >
                      <div
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 cursor-pointer transition-all"
                        style={{
                          background:
                            payment === "Cash on Delivery"
                              ? "oklch(0.20 0.09 150 / 0.7)"
                              : "oklch(0.14 0.04 150 / 0.5)",
                          border:
                            payment === "Cash on Delivery"
                              ? "1px solid oklch(0.55 0.20 150 / 0.55)"
                              : "1px solid oklch(0.26 0.08 150 / 0.6)",
                        }}
                      >
                        <RadioGroupItem
                          value="Cash on Delivery"
                          id="pay-cod"
                          data-ocid="order.radio"
                          className="border-primary text-primary"
                        />
                        <Label
                          htmlFor="pay-cod"
                          className="font-body font-semibold text-base text-foreground cursor-pointer"
                        >
                          💵 Cash
                        </Label>
                      </div>
                      <div
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 flex-1 cursor-pointer transition-all"
                        style={{
                          background:
                            payment === "UPI"
                              ? "oklch(0.20 0.09 150 / 0.7)"
                              : "oklch(0.14 0.04 150 / 0.5)",
                          border:
                            payment === "UPI"
                              ? "1px solid oklch(0.55 0.20 150 / 0.55)"
                              : "1px solid oklch(0.26 0.08 150 / 0.6)",
                        }}
                      >
                        <RadioGroupItem
                          value="UPI"
                          id="pay-upi"
                          data-ocid="order.radio"
                          className="border-primary text-primary"
                        />
                        <Label
                          htmlFor="pay-upi"
                          className="font-body font-semibold text-base text-foreground cursor-pointer"
                        >
                          📱 UPI
                        </Label>
                      </div>
                    </RadioGroup>
                    <AnimatePresence>
                      {payment === "UPI" && <UpiPanel />}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  data-ocid="order.submit_button"
                  onClick={handleSubmit}
                  className="w-full h-13 rounded-xl font-display font-bold text-base uppercase tracking-widest transition-all active:scale-[0.98] py-3.5"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.50 0.20 150) 0%, oklch(0.38 0.16 150) 100%)",
                    border: "1px solid oklch(0.65 0.20 150 / 0.5)",
                    color: "oklch(0.97 0.01 70)",
                    boxShadow:
                      "0 4px 20px oklch(0.50 0.20 150 / 0.40), inset 0 1px 0 oklch(0.96 0.015 70 / 0.20)",
                  }}
                >
                  <span className="text-lg mr-2">📲</span>
                  WhatsApp pe Order Bhejo
                </button>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ---------- Main App ----------
export default function App() {
  const { data: menu, isLoading, isError } = useGetMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [offer, setOffer] = useState<OfferState>(getOffer);
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : "",
  );

  // Hash routing
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Reload offer when returning to menu (so discount updates live)
  useEffect(() => {
    if (hash === "" || hash === "#") {
      setOffer(getOffer());
    }
  }, [hash]);

  const navigate = (newHash: string) => {
    window.location.hash = newHash;
  };

  // Render sub-pages based on hash
  if (hash === "#admin") {
    return <AdminPage onBack={() => navigate("")} />;
  }
  if (hash === "#qr") {
    return <QrPage onBack={() => navigate("")} />;
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleAdd = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) {
        return prev.map((c) =>
          c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [
        ...prev,
        { name: item.name, price: Number(item.price), quantity: 1 },
      ];
    });
  };

  const handleIncrease = (name: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.name === name ? { ...c, quantity: c.quantity + 1 } : c,
      ),
    );
  };

  const handleDecrease = (name: string) => {
    setCart((prev) => {
      const item = prev.find((c) => c.name === name);
      if (!item) return prev;
      if (item.quantity <= 1) return prev.filter((c) => c.name !== name);
      return prev.map((c) =>
        c.name === name ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const handleRemove = (name: string) => {
    setCart((prev) => prev.filter((c) => c.name !== name));
  };

  return (
    <div data-ocid="menu.page" className="min-h-screen bg-background font-body">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="relative h-52 sm:h-64">
          <img
            src="/assets/generated/hero-chinese-veg-green.dim_800x400.jpg"
            alt="Chinese vegetarian food spread"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        {/* Restaurant name panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative px-4 pt-5 pb-6 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.08 0.04 150) 0%, oklch(0.10 0.04 150) 100%)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.15 80 / 0.7), transparent)",
            }}
          />

          <div className="flex justify-center mb-4">
            <Badge
              className="border-0 font-body font-semibold uppercase tracking-widest text-xs px-4 py-1.5 gap-1.5"
              style={{
                background: "oklch(0.55 0.20 150 / 0.15)",
                border: "1px solid oklch(0.55 0.20 150 / 0.35)",
                color: "oklch(0.75 0.22 150)",
              }}
            >
              <Leaf className="w-3 h-3" />
              100% Veg · Chinese
            </Badge>
          </div>

          <h1
            className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight mb-1"
            style={{
              color: "oklch(0.96 0.015 70)",
              textShadow:
                "0 2px 12px oklch(0.04 0.02 150 / 0.8), 0 0 30px oklch(0.55 0.20 150 / 0.3)",
            }}
          >
            The Hot Chilly Yammy
          </h1>

          <p
            className="font-display text-sm tracking-[0.35em] uppercase mb-4"
            style={{ color: "oklch(0.75 0.15 80 / 0.9)" }}
          >
            ✦ Premium Chinese Vegetarian ✦
          </p>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px flex-1 max-w-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.75 0.15 80 / 0.5))",
              }}
            />
            <span
              className="text-xs font-display tracking-[0.5em] uppercase"
              style={{ color: "oklch(0.75 0.15 80 / 0.8)" }}
            >
              ✦ ✦ ✦
            </span>
            <div
              className="h-px flex-1 max-w-20"
              style={{
                background:
                  "linear-gradient(270deg, transparent, oklch(0.75 0.15 80 / 0.5))",
              }}
            />
          </div>

          <p
            className="font-body italic text-sm tracking-widest"
            style={{ color: "oklch(0.52 0.06 140)" }}
          >
            Fresh · Spicy · Delicious
          </p>
        </motion.div>
      </header>

      {/* Offer Banner */}
      <OfferBanner offer={offer} />

      {/* Menu Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-center mb-6"
        >
          <p
            className="font-display text-xs tracking-[0.45em] uppercase mb-2"
            style={{ color: "oklch(0.75 0.15 80 / 0.7)" }}
          >
            ✦ Our Menu ✦
          </p>
          <div
            className="h-px mx-auto w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.15 80 / 0.5), transparent)",
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && <LoadingSkeleton />}

          {isError && (
            <motion.div
              data-ocid="menu.error_state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p
                className="font-body text-base"
                style={{ color: "oklch(0.52 0.05 140)" }}
              >
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
                  <p style={{ color: "oklch(0.52 0.05 140)" }}>
                    Abhi koi items nahi hain.
                  </p>
                </div>
              ) : (
                menu.map((category, idx) => (
                  <CategorySection
                    key={category.name}
                    category={category}
                    sectionIndex={idx}
                    onAdd={handleAdd}
                    offer={offer}
                  />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer
        className="mt-4 px-4 py-8 text-center"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.04 150) 0%, oklch(0.06 0.02 150) 100%)",
          borderTop: "1px solid oklch(0.55 0.20 150 / 0.2)",
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <div
            className="h-px flex-1 max-w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.75 0.15 80 / 0.35))",
            }}
          />
          <span
            className="text-xs font-display tracking-[0.4em]"
            style={{ color: "oklch(0.75 0.15 80 / 0.6)" }}
          >
            ✦
          </span>
          <div
            className="h-px flex-1 max-w-20"
            style={{
              background:
                "linear-gradient(270deg, transparent, oklch(0.75 0.15 80 / 0.35))",
            }}
          />
        </div>

        <p
          className="font-display text-xs uppercase tracking-[0.4em] mb-4"
          style={{ color: "oklch(0.75 0.15 80 / 0.75)" }}
        >
          📞 Order Karein
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <a
            href="tel:8228096793"
            data-ocid="menu.primary_button"
            className="flex items-center gap-2 rounded-full px-5 py-2 font-display font-semibold tracking-wide transition-all text-sm hover:scale-105"
            style={{
              background: "oklch(0.50 0.20 150 / 0.12)",
              border: "1px solid oklch(0.55 0.20 150 / 0.40)",
              color: "oklch(0.90 0.05 70)",
              boxShadow: "0 2px 12px oklch(0.04 0.02 150 / 0.4)",
            }}
          >
            <Phone className="w-4 h-4" />
            8228096793
          </a>
          <a
            href="tel:8582024063"
            data-ocid="menu.secondary_button"
            className="flex items-center gap-2 rounded-full px-5 py-2 font-display font-semibold tracking-wide transition-all text-sm hover:scale-105"
            style={{
              background: "oklch(0.50 0.20 150 / 0.12)",
              border: "1px solid oklch(0.55 0.20 150 / 0.40)",
              color: "oklch(0.90 0.05 70)",
              boxShadow: "0 2px 12px oklch(0.04 0.02 150 / 0.4)",
            }}
          >
            <Phone className="w-4 h-4" />
            8582024063
          </a>
        </div>

        {/* QR Code button */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <button
            type="button"
            data-ocid="menu.qr_button"
            onClick={() => navigate("#qr")}
            className="flex items-center gap-2 rounded-full px-5 py-2 font-display font-semibold tracking-wide transition-all text-sm hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.68 0.14 80 / 0.15), oklch(0.55 0.16 75 / 0.10))",
              border: "1px solid oklch(0.68 0.14 80 / 0.40)",
              color: "oklch(0.80 0.15 80)",
            }}
          >
            <QrCode className="w-4 h-4" />📱 QR Code
          </button>
        </div>

        <div
          className="pt-4"
          style={{ borderTop: "1px solid oklch(0.55 0.20 150 / 0.12)" }}
        >
          <p
            className="text-xs font-body"
            style={{ color: "oklch(0.38 0.05 140)" }}
          >
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.55 0.18 150)" }}
              className="hover:opacity-80 transition-opacity"
            >
              caffeine.ai
            </a>
          </p>
          {/* Hidden admin link */}
          <a
            href="#admin"
            data-ocid="menu.admin_link"
            className="mt-2 inline-block text-xs font-body opacity-20 hover:opacity-60 transition-opacity"
            style={{ color: "oklch(0.55 0.08 140)" }}
          >
            Admin
          </a>
        </div>
      </footer>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            data-ocid="order.open_modal_button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOrderOpen(true)}
            className="fixed bottom-6 right-5 z-50 flex items-center gap-2.5 rounded-full px-5 py-3.5 font-display font-bold text-sm uppercase tracking-wide transition-colors"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.20 150) 0%, oklch(0.38 0.16 150) 100%)",
              color: "oklch(0.97 0.01 70)",
              boxShadow:
                "0 4px 20px oklch(0.50 0.20 150 / 0.55), 0 8px 32px oklch(0.04 0.02 150 / 0.5)",
              border: "1px solid oklch(0.65 0.20 150 / 0.5)",
            }}
            aria-label={`View cart: ${totalItems} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Cart</span>
            <span
              className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-black"
              style={{ background: "oklch(0.08 0.04 150 / 0.40)" }}
            >
              {totalItems}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Order Sheet */}
      <OrderSheet
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        cart={cart}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
        offer={offer}
      />
    </div>
  );
}
