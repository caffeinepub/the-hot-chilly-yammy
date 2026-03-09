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
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Copy,
  Leaf,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Category, MenuItem } from "./backend";
import { useGetMenu } from "./hooks/useQueries";

const CATEGORY_ICONS: Record<string, string> = {
  "Spring Roll": "🥢",
  Momos: "🥟",
  Noodles: "🍜",
  Manchurian: "🥦",
  Soup: "🍲",
};

const CATEGORY_IMAGES: Record<string, string> = {
  "Spring Roll": "/assets/generated/food-spring-roll.dim_400x300.jpg",
  Momos: "/assets/generated/food-momos.dim_400x300.jpg",
  Noodles: "/assets/generated/food-noodles.dim_400x300.jpg",
  Manchurian: "/assets/generated/food-manchurian.dim_400x300.jpg",
  Soup: "/assets/generated/food-soup.dim_400x300.jpg",
};

type CartItem = { name: string; price: number; quantity: number };

function MenuItemRow({
  item,
  index,
  onAdd,
}: {
  item: MenuItem;
  index: number;
  onAdd: (item: MenuItem) => void;
}) {
  const markerIndex = index + 1;
  return (
    <motion.div
      data-ocid={`menu.item.row.${markerIndex}`}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between py-3 px-1 border-b border-primary/10 last:border-0 group"
    >
      <div className="flex-1 min-w-0 pr-3">
        <span className="text-foreground font-body font-semibold text-base sm:text-lg leading-snug">
          {item.name}
        </span>
        {item.note && (
          <span className="ml-2 text-sm text-accent/80 font-body italic">
            ({item.note})
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-display font-bold text-primary text-base sm:text-lg tracking-wide">
          ₹{Number(item.price)}/-
        </span>
        <button
          type="button"
          data-ocid={`menu.item.button.${markerIndex}`}
          onClick={() => onAdd(item)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.16 22), oklch(0.28 0.13 18))",
            border: "1px solid oklch(0.78 0.14 72 / 0.25)",
            boxShadow: "0 2px 8px oklch(0.05 0.02 18 / 0.5)",
          }}
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus
            className="w-4 h-4"
            style={{ color: "oklch(0.86 0.17 68)" }}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </motion.div>
  );
}

function CategorySection({
  category,
  sectionIndex,
  onAdd,
}: {
  category: Category;
  sectionIndex: number;
  onAdd: (item: MenuItem) => void;
}) {
  const icon = CATEGORY_ICONS[category.name] || "🍽️";
  const categoryImage = CATEGORY_IMAGES[category.name];
  return (
    <motion.div
      data-ocid={`menu.category.item.${sectionIndex + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="menu-card-bg rounded-xl overflow-hidden mb-5"
    >
      {/* Category header stripe */}
      <div className="category-stripe px-5 py-3.5 flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={category.name}>
          {icon}
        </span>
        <h2
          className="font-display font-bold text-xl sm:text-2xl tracking-wider"
          style={{
            color: "oklch(0.90 0.13 72)",
            textShadow: "0 1px 3px oklch(0.05 0.02 18 / 0.8)",
          }}
        >
          {category.name}
        </h2>
        <div className="ml-auto text-primary/40 text-xs tracking-[0.4em] font-display">
          ✦
        </div>
      </div>

      {/* Category food photo */}
      {categoryImage && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={categoryImage}
            alt={`${category.name} dish`}
            className="w-full h-full object-cover"
          />
          {/* Bottom gradient overlay to blend into card */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.05 0.02 18 / 0.05) 0%, oklch(0.05 0.02 18 / 0.1) 50%, oklch(0.16 0.06 18 / 0.85) 100%)",
            }}
          />
        </div>
      )}

      {/* Menu items list */}
      <div className="px-4 py-2">
        {category.items.map((item, idx) => (
          <MenuItemRow key={item.name} item={item} index={idx} onAdd={onAdd} />
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
          <Skeleton className="h-40 w-full bg-muted" />
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
          "linear-gradient(135deg, oklch(0.22 0.07 55 / 0.3), oklch(0.18 0.06 40 / 0.4))",
        border: "1px solid oklch(0.78 0.14 72 / 0.4)",
        boxShadow: "inset 0 1px 0 oklch(0.78 0.14 72 / 0.15)",
      }}
    >
      <p
        className="text-xs font-body font-semibold uppercase tracking-wider mb-2.5"
        style={{ color: "oklch(0.78 0.14 72 / 0.85)" }}
      >
        ✦ UPI Payment ID
      </p>
      <div className="flex items-center justify-between gap-3">
        <span
          className="font-display font-bold text-base tracking-wide select-all"
          style={{ color: "oklch(0.90 0.15 72)" }}
        >
          {UPI_ID}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy UPI ID"
          className="flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all"
          style={{
            background: "oklch(0.78 0.14 72 / 0.15)",
            border: "1px solid oklch(0.78 0.14 72 / 0.4)",
            color: "oklch(0.90 0.13 72)",
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
        style={{ color: "oklch(0.78 0.14 72 / 0.55)" }}
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
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onIncrease: (name: string) => void;
  onDecrease: (name: string) => void;
  onRemove: (name: string) => void;
}) {
  const [naam, setNaam] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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

    const message = `🛒 New Order - The Hot Chilly Yammy\n\nItems:\n${itemLines}\nTotal: ₹${grandTotal}\n\nCustomer:\nName: ${naam}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}`;

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
            "linear-gradient(160deg, oklch(0.18 0.065 20), oklch(0.13 0.05 18))",
          borderTop: "1px solid oklch(0.78 0.14 72 / 0.3)",
          boxShadow: "0 -8px 40px oklch(0.05 0.02 18 / 0.8)",
        }}
      >
        <SheetHeader
          className="px-5 pt-5 pb-3.5"
          style={{ borderBottom: "1px solid oklch(0.78 0.14 72 / 0.2)" }}
        >
          <SheetTitle
            className="font-display font-bold text-xl flex items-center gap-2.5"
            style={{
              color: "oklch(0.90 0.13 72)",
              textShadow: "0 0 20px oklch(0.78 0.14 72 / 0.4)",
            }}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "oklch(0.78 0.14 72)" }}
            />
            Aapka Order
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Cart Items */}
            {cart.length === 0 ? (
              <p
                data-ocid="order.empty_state"
                className="text-center py-8 font-body text-lg"
                style={{ color: "oklch(0.62 0.055 45)" }}
              >
                Cart khali hai. Menu se items add karein.
              </p>
            ) : (
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div
                    key={item.name}
                    data-ocid={`order.item.${idx + 1}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{
                      background: "oklch(0.22 0.075 18 / 0.6)",
                      border: "1px solid oklch(0.78 0.14 72 / 0.15)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-base text-foreground truncate">
                        {item.name}
                      </p>
                      <p
                        className="text-sm font-display"
                        style={{ color: "oklch(0.78 0.14 72)" }}
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
                          background: "oklch(0.25 0.07 20)",
                          border: "1px solid oklch(0.35 0.08 22)",
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
                            "linear-gradient(135deg, oklch(0.35 0.16 22), oklch(0.28 0.13 18))",
                          border: "1px solid oklch(0.78 0.14 72 / 0.25)",
                        }}
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus
                          className="w-3 h-3"
                          style={{ color: "oklch(0.86 0.17 68)" }}
                          strokeWidth={3}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item.name)}
                        className="w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-1"
                        style={{
                          background: "oklch(0.25 0.1 22 / 0.5)",
                          border: "1px solid oklch(0.55 0.22 27 / 0.4)",
                        }}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                    <div className="flex-shrink-0 w-16 text-right">
                      <span
                        className="font-display font-bold text-sm"
                        style={{ color: "oklch(0.86 0.17 68)" }}
                      >
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}

                <div
                  className="flex justify-between items-center px-4 py-3 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.22 0.07 55 / 0.25), oklch(0.18 0.06 40 / 0.3))",
                    border: "1px solid oklch(0.78 0.14 72 / 0.35)",
                    boxShadow: "inset 0 1px 0 oklch(0.78 0.14 72 / 0.1)",
                  }}
                >
                  <span className="font-display font-bold text-base text-foreground">
                    Total
                  </span>
                  <span
                    className="font-display font-black text-xl text-shadow-gold"
                    style={{ color: "oklch(0.90 0.15 72)" }}
                  >
                    ₹{grandTotal}
                  </span>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div
                  className="ornamental-divider text-xs font-display tracking-[0.3em]"
                  style={{ color: "oklch(0.78 0.14 72 / 0.4)" }}
                >
                  ✦ ✦ ✦
                </div>

                {/* Order Form */}
                <div className="space-y-4">
                  <h3
                    className="font-display font-bold text-base uppercase tracking-wider"
                    style={{ color: "oklch(0.86 0.14 72)" }}
                  >
                    Delivery Details
                  </h3>

                  {/* Naam */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="order-naam"
                      className="font-body font-semibold text-sm text-foreground/80"
                    >
                      Naam (Name) *
                    </Label>
                    <Input
                      id="order-naam"
                      data-ocid="order.name_input"
                      placeholder="Apna naam daalein"
                      value={naam}
                      onChange={(e) => setNaam(e.target.value)}
                      className="font-body text-foreground placeholder:text-muted-foreground/60"
                      style={{
                        background: "oklch(0.22 0.075 18 / 0.7)",
                        border: "1px solid oklch(0.35 0.08 22 / 0.8)",
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
                        background: "oklch(0.22 0.075 18 / 0.7)",
                        border: "1px solid oklch(0.35 0.08 22 / 0.8)",
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
                        background: "oklch(0.22 0.075 18 / 0.7)",
                        border: "1px solid oklch(0.35 0.08 22 / 0.8)",
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
                              ? "oklch(0.26 0.08 22 / 0.7)"
                              : "oklch(0.22 0.075 18 / 0.5)",
                          border:
                            payment === "Cash on Delivery"
                              ? "1px solid oklch(0.78 0.14 72 / 0.5)"
                              : "1px solid oklch(0.35 0.08 22 / 0.6)",
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
                              ? "oklch(0.26 0.08 22 / 0.7)"
                              : "oklch(0.22 0.075 18 / 0.5)",
                          border:
                            payment === "UPI"
                              ? "1px solid oklch(0.78 0.14 72 / 0.5)"
                              : "1px solid oklch(0.35 0.08 22 / 0.6)",
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
                      "linear-gradient(135deg, oklch(0.30 0.16 22) 0%, oklch(0.22 0.12 18) 100%)",
                    border: "1px solid oklch(0.78 0.14 72 / 0.5)",
                    color: "oklch(0.90 0.13 72)",
                    textShadow: "0 0 12px oklch(0.78 0.14 72 / 0.4)",
                    boxShadow:
                      "0 4px 20px oklch(0.05 0.02 18 / 0.6), inset 0 1px 0 oklch(0.78 0.14 72 / 0.2)",
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

export default function App() {
  const { data: menu, isLoading, isError } = useGetMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);

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
            src="/assets/generated/hero-chinese-veg-food.dim_800x400.jpg"
            alt="Chinese vegetarian food spread"
            className="w-full h-full object-cover"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>

        {/* Restaurant name panel */}
        <div
          className="relative px-4 pt-5 pb-6 text-center overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.13 0.055 18) 0%, oklch(0.15 0.06 18) 100%)",
          }}
        >
          {/* Top decorative line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.14 72 / 0.7), transparent)",
            }}
          />

          {/* Veg badge */}
          <div className="flex justify-center mb-4">
            <Badge className="bg-green-700/90 text-white border-0 font-body font-semibold uppercase tracking-widest text-xs px-4 py-1.5 gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              Only Veg Food
            </Badge>
          </div>

          {/* Main restaurant title */}
          <div className="mb-3 relative">
            {/* Decorative Chinese-inspired corner marks */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 text-2xl font-display select-none">
              ❰
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 text-2xl font-display select-none">
              ❱
            </div>

            <h1 className="font-display font-bold leading-none tracking-tight text-shadow-gold">
              <span
                className="block text-4xl sm:text-5xl"
                style={{ color: "oklch(0.92 0.14 72)" }}
              >
                The Hot
              </span>
              <span
                className="block text-5xl sm:text-6xl mt-0.5"
                style={{
                  color: "oklch(0.96 0.10 75)",
                  textShadow:
                    "0 0 40px oklch(0.78 0.14 72 / 0.5), 0 2px 4px oklch(0.05 0.02 18 / 0.8)",
                }}
              >
                Chilly Yammy
              </span>
            </h1>
          </div>

          {/* Ornamental separator */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px flex-1 max-w-20"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.14 72 / 0.5))",
              }}
            />
            <span
              className="text-xs font-display tracking-[0.5em] uppercase"
              style={{ color: "oklch(0.78 0.14 72 / 0.7)" }}
            >
              ✦ ✦ ✦
            </span>
            <div
              className="h-px flex-1 max-w-20"
              style={{
                background:
                  "linear-gradient(270deg, transparent, oklch(0.78 0.14 72 / 0.5))",
              }}
            />
          </div>

          <p
            className="font-body italic text-sm tracking-widest"
            style={{ color: "oklch(0.62 0.055 45)" }}
          >
            Fresh · Spicy · Delicious
          </p>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p
            className="font-display text-xs tracking-[0.45em] uppercase mb-2"
            style={{ color: "oklch(0.78 0.14 72 / 0.6)" }}
          >
            ✦ Our Menu ✦
          </p>
          <div
            className="h-px mx-auto w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.14 72 / 0.5), transparent)",
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
                style={{ color: "oklch(0.62 0.055 45)" }}
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
                  <p style={{ color: "oklch(0.62 0.055 45)" }}>
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
            "linear-gradient(180deg, oklch(0.15 0.06 18) 0%, oklch(0.11 0.04 18) 100%)",
          borderTop: "1px solid oklch(0.78 0.14 72 / 0.2)",
        }}
      >
        {/* Top ornament */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div
            className="h-px flex-1 max-w-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.78 0.14 72 / 0.35))",
            }}
          />
          <span
            className="text-xs font-display tracking-[0.4em]"
            style={{ color: "oklch(0.78 0.14 72 / 0.5)" }}
          >
            ✦
          </span>
          <div
            className="h-px flex-1 max-w-20"
            style={{
              background:
                "linear-gradient(270deg, transparent, oklch(0.78 0.14 72 / 0.35))",
            }}
          />
        </div>

        <p
          className="font-display text-xs uppercase tracking-[0.4em] mb-4"
          style={{ color: "oklch(0.78 0.14 72 / 0.65)" }}
        >
          📞 Order Karein
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <a
            href="tel:8228096793"
            data-ocid="menu.primary_button"
            className="flex items-center gap-2 rounded-full px-5 py-2 font-display font-semibold tracking-wide transition-all text-sm hover:scale-105"
            style={{
              background: "oklch(0.78 0.14 72 / 0.12)",
              border: "1px solid oklch(0.78 0.14 72 / 0.35)",
              color: "oklch(0.90 0.13 72)",
              boxShadow: "0 2px 12px oklch(0.05 0.02 18 / 0.4)",
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
              background: "oklch(0.78 0.14 72 / 0.12)",
              border: "1px solid oklch(0.78 0.14 72 / 0.35)",
              color: "oklch(0.90 0.13 72)",
              boxShadow: "0 2px 12px oklch(0.05 0.02 18 / 0.4)",
            }}
          >
            <Phone className="w-4 h-4" />
            8582024063
          </a>
        </div>

        <div
          className="pt-4"
          style={{ borderTop: "1px solid oklch(0.78 0.14 72 / 0.12)" }}
        >
          <p
            className="text-xs font-body"
            style={{ color: "oklch(0.45 0.04 30)" }}
          >
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.60 0.08 55)" }}
              className="hover:opacity-80 transition-opacity"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Floating Cart Button — gold/amber */}
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
                "linear-gradient(135deg, oklch(0.70 0.16 68) 0%, oklch(0.62 0.18 58) 100%)",
              color: "oklch(0.12 0.04 20)",
              boxShadow:
                "0 4px 20px oklch(0.78 0.14 72 / 0.45), 0 8px 32px oklch(0.05 0.02 18 / 0.5)",
              border: "1px solid oklch(0.86 0.17 72 / 0.5)",
            }}
            aria-label={`View cart: ${totalItems} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Cart</span>
            <span
              className="rounded-full w-6 h-6 flex items-center justify-center text-xs font-black"
              style={{ background: "oklch(0.12 0.04 20 / 0.3)" }}
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
      />
    </div>
  );
}
