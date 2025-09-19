
export interface Ingredient {
  url: string;
  name: string;
  inci_name: string;
  thai_name: string;
  english_name: string;
  function: string;
  description: string;
  price_range: string;
  usage_percentage: string;
  cas_number: string;
  properties: string[];
  applications: string[];
  benefits: string[];
  specifications: Record<string, string>;
  source: string;
  extraction_date: string;
}

export interface FormulaIngredient {
  name: string;
  inci_name: string;
  percentage: number;
  function: string;
  phase: 'A' | 'B' | 'C' | 'D';
}

export interface GeneratedFormula {
  name: string;
  type: string;
  description: string;
  ingredients: FormulaIngredient[];
  instructions: string[];
  properties: {
    ph: string;
    viscosity: string;
    stability: string;
    shelfLife: string;
  };
  claims: string[];
  cost_estimate: string;
  mockup_image?: string;
}

export interface FormData {
  productDescription: string;
  productType?: string;
  targetBenefits?: string[];
  constraints?: string[];
}
