import Array "mo:core/Array";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";



actor {
  // Types for menu (not persisted)
  type MenuItem = {
    name : Text;
    price : Nat;
    note : ?Text;
  };

  type Category = {
    name : Text;
    items : [MenuItem];
  };

  // Order types and payments
  type OrderItem = {
    itemName : Text;
    quantity : Nat;
    price : Nat;
  };

  type PaymentMethod = {
    #cod;
    #upi;
  };

  type Order = {
    orderId : Nat;
    customerName : Text;
    customerPhone : Text;
    customerAddress : Text;
    items : [OrderItem];
    subtotal : Nat;
    discountPercent : Nat;
    totalAmount : Nat;
    paymentMethod : PaymentMethod;
    timestamp : Int;
    dateString : Text;
  };

  // Stable persistent storage definitions
  var nextOrderId = 1;

  var orders = List.empty<Order>();
  var currentDiscountPercent = 0;
  var isOnline : Bool = true;

  // Constant menu data
  let menu : [Category] = [
    {
      name = "Spring Roll";
      items = [
        { name = "Veg Roll"; price = 30; note = null },
        { name = "Veg Spring Roll"; price = 49; note = null },
        { name = "Paneer Roll"; price = 40; note = null },
        { name = "Cheese Roll"; price = 40; note = null },
      ];
    },
    {
      name = "Momos";
      items = [
        {
          name = "Veg Momo";
          price = 49;
          note = ?"Fry +5";
        },
        { name = "Veg Chilli Momo"; price = 59; note = null },
        { name = "Paneer Momo Fry"; price = 49; note = null },
        { name = "Saucy Momos"; price = 40; note = null },
      ];
    },
    {
      name = "Noodles";
      items = [
        { name = "Veg Noodles"; price = 40; note = null },
        {
          name = "Veg Schezwan Noodles";
          price = 49;
          note = null;
        },
        { name = "Hakka Noodles"; price = 40; note = null },
        { name = "Paneer Noodles"; price = 45; note = null },
      ];
    },
    {
      name = "Rice";
      items = [
        { name = "Veg Fry Rice"; price = 70; note = null },
        { name = "Paneer Fry Rice"; price = 90; note = null },
        { name = "Schezwan Fry Rice"; price = 79; note = null },
      ];
    },
    {
      name = "Manchurian";
      items = [
        { name = "Veg Manchurian"; price = 69; note = null },
        { name = "Veg Soya Chilli"; price = 60; note = null },
        { name = "Mushroom Chilli"; price = 149; note = null },
        { name = "Paneer Chilli"; price = 149; note = null },
        { name = "Mushroom 65"; price = 149; note = null },
        { name = "Paneer 65"; price = 149; note = null },
      ];
    },
    {
      name = "Soup";
      items = [
        { name = "Hot & Sour Soup"; price = 10; note = null },
      ];
    },
  ];

  // Menu queries
  public query ({ caller }) func getMenu() : async [Category] {
    menu;
  };

  // Order management
  public shared ({ caller }) func addOrder(
    customerName : Text,
    customerPhone : Text,
    customerAddress : Text,
    items : [OrderItem],
    subtotal : Nat,
    totalAmount : Nat,
    paymentMethod : PaymentMethod,
    dateString : Text,
  ) : async Nat {
    let order : Order = {
      orderId = nextOrderId;
      customerName;
      customerPhone;
      customerAddress;
      items;
      subtotal;
      discountPercent = currentDiscountPercent;
      totalAmount;
      paymentMethod;
      timestamp = Time.now();
      dateString;
    };

    orders.add(order);
    nextOrderId += 1;
    order.orderId;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    orders.toArray();
  };

  public query ({ caller }) func getOrdersByDate(dateString : Text) : async [Order] {
    let filtered = orders.filter(func(order) { order.dateString == dateString });
    filtered.toArray();
  };

  public query ({ caller }) func getTotalByDate(dateString : Text) : async Nat {
    let filtered = orders.filter(func(order) { order.dateString == dateString });
    filtered.foldLeft(
      0,
      func(acc, order) {
        acc + order.totalAmount;
      },
    );
  };

  // Discount management
  public query ({ caller }) func getDiscount() : async Nat {
    currentDiscountPercent;
  };

  public shared ({ caller }) func setDiscount(discount : Nat) : async () {
    currentDiscountPercent := discount;
  };

  // Online/Offline status
  public query ({ caller }) func getOnlineStatus() : async Bool {
    isOnline;
  };

  public shared ({ caller }) func setOnlineStatus(status : Bool) : async () {
    isOnline := status;
  };
};
