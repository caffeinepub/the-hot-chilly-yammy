import Array "mo:core/Array";

actor {
  type MenuItem = {
    name : Text;
    price : Nat;
    note : ?Text;
  };

  type Category = {
    name : Text;
    items : [MenuItem];
  };

  let menu = [
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
        { name = "Sweet Corn Soup"; price = 10; note = null },
        { name = "Hot & Sour Soup"; price = 10; note = null },
        { name = "Manchow Soup"; price = 10; note = null },
      ];
    },
  ];

  public query ({ caller }) func getMenu() : async [Category] {
    menu;
  };
};
