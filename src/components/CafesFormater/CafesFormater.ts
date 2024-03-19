// cafesFormatter.js

const formatCafesData = (cafesData) => {
    return cafesData.data.map(({ name, price, addressShop, position, hours }) => ({
      name,
      price,
      address: addressShop,
      rating: null, // Vous pouvez définir un rating par défaut si nécessaire
      closing: hours ? hours.split(',') : [], // Convertir les heures en tableau s'il y en a
      lat: parseFloat(position.split(',')[0].replace('(', '')),
      lng: parseFloat(position.split(',')[1].replace(')', '')),
      key: JSON.stringify({ name, price, addressShop, position, hours }),
    }));
  };
  
  export default formatCafesData;
  