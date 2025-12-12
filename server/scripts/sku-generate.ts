type Variant = {
  value: string;
  options: string[];
};

type SKU = {
  value: string;
  price: number;
  stock: number;
  image: string;
};

function generateSKUs(variants: Variant[]): SKU[] {
  // Function to get all combinations of options
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? "-" : ""}${y}`)), [""]);
  }

  // Get array of options from variants
  const options = variants.map((variant) => variant.options);

  // Create all combinations
  const combinations = getCombinations(options);

  // Convert combinations to SKU objects
  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: "",
  }));
}

// Example usage, change as needed
const variants: Variant[] = [
  {
    value: "Màu sắc",
    options: ["Đen", "Trắng", "Xanh", "Đỏ"],
  },
  {
    value: "Kích thước",
    options: ["S", "M", "L", "XL"],
  },
];

// Generate SKUs
const skus = generateSKUs(variants);
console.log(JSON.stringify(skus));
