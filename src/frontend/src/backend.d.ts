import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    name: string;
    items: Array<MenuItem>;
}
export interface MenuItem {
    name: string;
    note?: string;
    price: bigint;
}
export interface Order {
    customerName: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    discountPercent: bigint;
    orderId: bigint;
    customerAddress: string;
    totalAmount: bigint;
    dateString: string;
    timestamp: bigint;
    items: Array<OrderItem>;
    subtotal: bigint;
}
export interface OrderItem {
    itemName: string;
    quantity: bigint;
    price: bigint;
}
export enum PaymentMethod {
    cod = "cod",
    upi = "upi"
}
export interface backendInterface {
    addOrder(customerName: string, customerPhone: string, customerAddress: string, items: Array<OrderItem>, subtotal: bigint, totalAmount: bigint, paymentMethod: PaymentMethod, dateString: string): Promise<bigint>;
    getDiscount(): Promise<bigint>;
    getMenu(): Promise<Array<Category>>;
    getOrders(): Promise<Array<Order>>;
    getOrdersByDate(dateString: string): Promise<Array<Order>>;
    getTotalByDate(dateString: string): Promise<bigint>;
    setDiscount(discount: bigint): Promise<void>;
}
