const places = [
  ["L'étoile, bar", 3, "2 Bd Gassendi", 4, ["opn"], 44.0911, 6.231845],
  [
    "Le Barjoc, bar à jeux",
    2.7,
    "3 rue du dr Honnorat",
    5,
    ["dim"],
    44.09252,
    6.2324,
  ],
  ["Farge, Boulangerie", 2, "9 Bvd Gassendi", 3, ["lun"], 44.09147, 6.23215],
  [
    "Oh grain de Blé II, Boulangerie",
    2.9,
    "5 Bd Victor Hugo",
    4.2,
    ["dim"],
    44.09422,
    6.23593,
  ],
  [
    "Test, c'est un test",
    5000,
    "5 rue du prévu",
    3,
    ["dim", "lun", "mer", "ven"],
    44.09522,
    6.23893,
  ],
];

const formatted = places.map(
  ([name, price, adress, rating, closing, lat, lng]) => ({
    name,
    price,
    adress,
    rating,
    closing,
    lat,
    lng,
    key: JSON.stringify({ name, price, adress, rating, closing, lat, lng }),
  })
);

export default formatted;
