export const STUDIO_KEY = 'sarah-cafe-studio-v1';
export const MEMORY_DESIGN_KEY = 'sarah-memory-cafe-design-v1';
export interface MemoryDesignSetting { version: 1; enabled: boolean; design: Design }
export const MAX_ITEMS = 150;
export const categories = ['Seating', 'Tables', 'Coffee bar', 'Architecture', 'Lighting', 'Decor', 'Outdoor', 'Cat equipment'] as const;
export type Category = typeof categories[number];
export const materials = ['Oak', 'Walnut', 'Marble', 'Terrazzo', 'Metal', 'Velvet', 'Linen', 'Rattan', 'Leather', 'Boucle', 'Brass', 'Chrome', 'Ceramic', 'Concrete', 'Glass', 'Cork', 'Grass'] as const;
export type Material = typeof materials[number];
export const patterns = ['Plain', 'Stripes', 'Checks', 'Dots'] as const;
export type Pattern = typeof patterns[number];
export const outdoorFloorStyles = ['Grass', 'Decking', 'Brick pavers', 'Cobblestone', 'Flagstone', 'Gravel', 'Stepping stones', 'Mosaic'] as const;
export type OutdoorFloorStyle = typeof outdoorFloorStyles[number];
export const floorStyles = ['Planks', 'Herringbone', 'Tiles', 'Checkerboard', 'Terrazzo', 'Plain', ...outdoorFloorStyles] as const;
export const wallStyles = ['Paint', 'Paneling', 'Stripes', 'Brick'] as const;
export const fonts = ['sans-serif', 'serif', 'monospace', 'cursive'] as const;

export interface CatalogItem {
  kind: string;
  name: string;
  category: Category;
  width: number;
  depth: number;
  price: number;
  color: string;
  accent: string;
  material: Material;
  style?: string;
  role?: string;
  height?: number;
  shape?: Furnishing['shape'];
}

export const catalog: CatalogItem[] = [
  { kind: 'chair', name: 'Dining chair', category: 'Seating', width: 48, depth: 48, price: 140, color: '#b5c3a3', accent: '#896345', material: 'Linen' },
  { kind: 'armchair', name: 'Lounge chair', category: 'Seating', width: 80, depth: 80, price: 390, color: '#ce9e89', accent: '#785541', material: 'Velvet' },
  { kind: 'stool', name: 'Bar stool', category: 'Seating', width: 38, depth: 38, price: 110, color: '#cfb38a', accent: '#65544a', material: 'Rattan' },
  { kind: 'sofa', name: 'Two-seat sofa', category: 'Seating', width: 155, depth: 80, price: 780, color: '#a5b49b', accent: '#6b5140', material: 'Velvet' },
  { kind: 'bench', name: 'Banquette', category: 'Seating', width: 180, depth: 60, price: 650, color: '#b68973', accent: '#886349', material: 'Linen' },
  { kind: 'table', name: 'Bistro table', category: 'Tables', width: 80, depth: 80, price: 240, color: '#e8d9bf', accent: '#8b715a', material: 'Marble' },
  { kind: 'dining', name: 'Communal table', category: 'Tables', width: 190, depth: 85, price: 620, color: '#b98a5e', accent: '#775843', material: 'Oak' },
  { kind: 'side', name: 'Side table', category: 'Tables', width: 45, depth: 45, price: 120, color: '#d6b590', accent: '#775843', material: 'Oak' },
  { kind: 'counter', name: 'Service counter', category: 'Coffee bar', width: 220, depth: 70, price: 1400, color: '#d8d1bb', accent: '#80957c', material: 'Marble' },
  { kind: 'cabinet', name: 'Storage cabinet', category: 'Coffee bar', width: 110, depth: 50, price: 480, color: '#b68c64', accent: '#ddc49b', material: 'Oak' },
  { kind: 'machine', name: 'Espresso machine', category: 'Coffee bar', width: 65, depth: 40, price: 1600, color: '#b9c3bd', accent: '#6a6c64', material: 'Metal' },
  { kind: 'grinder', name: 'Coffee grinder', category: 'Coffee bar', width: 25, depth: 30, price: 280, color: '#65736c', accent: '#b58758', material: 'Metal' },
  { kind: 'display', name: 'Pastry display', category: 'Coffee bar', width: 90, depth: 50, price: 850, color: '#c4ddd5', accent: '#9b795a', material: 'Metal' },
  { kind: 'sink', name: 'Bar sink', category: 'Coffee bar', width: 50, depth: 40, price: 260, color: '#c0c6c3', accent: '#71817d', material: 'Metal' },
  { kind: 'fridge', name: 'Under-counter fridge', category: 'Coffee bar', width: 60, depth: 60, price: 650, color: '#d7dfd8', accent: '#63776b', material: 'Metal' },
  { kind: 'shelf', name: 'Display shelving', category: 'Coffee bar', width: 120, depth: 35, price: 320, color: '#b58d68', accent: '#f0dbc1', material: 'Walnut' },
  { kind: 'door', name: 'Entrance door', category: 'Architecture', width: 90, depth: 20, price: 650, color: '#8caa96', accent: '#e7dabf', material: 'Oak' },
  { kind: 'window', name: 'Window & curtains', category: 'Architecture', width: 160, depth: 22, price: 580, color: '#c6e0d9', accent: '#dbc9b0', material: 'Linen' },
  { kind: 'partition', name: 'Slatted divider', category: 'Architecture', width: 140, depth: 20, price: 380, color: '#ac8059', accent: '#d9bd94', material: 'Oak' },
  { kind: 'pendant', name: 'Pendant light', category: 'Lighting', width: 45, depth: 45, price: 180, color: '#e6bf77', accent: '#6c6552', material: 'Rattan' },
  { kind: 'sconce', name: 'Wall sconce', category: 'Lighting', width: 28, depth: 28, price: 95, color: '#e9d39f', accent: '#947850', material: 'Metal' },
  { kind: 'lamp', name: 'Floor lamp', category: 'Lighting', width: 42, depth: 42, price: 190, color: '#e8d8ba', accent: '#806344', material: 'Linen' },
  { kind: 'rug', name: 'Area rug', category: 'Decor', width: 210, depth: 150, price: 260, color: '#d5a48b', accent: '#f1dfba', material: 'Linen' },
  { kind: 'plant', name: 'Potted greenery', category: 'Decor', width: 65, depth: 65, price: 75, color: '#789773', accent: '#bc8b6c', material: 'Rattan' },
  { kind: 'vase', name: 'Flowers & vase', category: 'Decor', width: 28, depth: 28, price: 35, color: '#dca8b1', accent: '#e0cfac', material: 'Marble' },
  { kind: 'art', name: 'Framed artwork', category: 'Decor', width: 70, depth: 45, price: 140, color: '#b5bca0', accent: '#a57853', material: 'Oak' },
  { kind: 'mirror', name: 'Statement mirror', category: 'Decor', width: 70, depth: 40, price: 180, color: '#cbdcdb', accent: '#b8955e', material: 'Metal' },
  { kind: 'books', name: 'Books & magazines', category: 'Decor', width: 32, depth: 25, price: 25, color: '#ad7a65', accent: '#ebd6b2', material: 'Linen' },
  { kind: 'cups', name: 'Cup & saucer', category: 'Decor', width: 22, depth: 22, price: 15, color: '#f6eddb', accent: '#845e43', material: 'Marble' },
  { kind: 'cushion', name: 'Scatter cushion', category: 'Decor', width: 32, depth: 32, price: 30, color: '#d6af72', accent: '#f0debd', material: 'Velvet' },
  { kind: 'clock', name: 'Wall clock', category: 'Decor', width: 35, depth: 35, price: 65, color: '#f4e4c4', accent: '#7a6450', material: 'Oak' },
  { kind: 'menu', name: 'Menu board', category: 'Decor', width: 75, depth: 55, price: 95, color: '#41574b', accent: '#d8ba8d', material: 'Oak' },
  { kind: 'sign', name: 'Custom lettering', category: 'Decor', width: 150, depth: 40, price: 160, color: '#e3b18d', accent: '#695343', material: 'Metal' },
  { kind: 'umbrella', name: 'Terrace parasol', category: 'Outdoor', width: 155, depth: 155, price: 290, color: '#dcc6a0', accent: '#91a38d', material: 'Linen' },
  { kind: 'outdoor', name: 'Terrace table', category: 'Outdoor', width: 75, depth: 75, price: 210, color: '#91a38d', accent: '#e5d6b9', material: 'Metal' },
  { kind: 'planter', name: 'Long planter', category: 'Outdoor', width: 120, depth: 35, price: 120, color: '#78936c', accent: '#ba8b64', material: 'Oak' },
  { kind: 'bentwood', name: 'Bentwood cafe chair', category: 'Seating', width: 46, depth: 48, price: 175, color: '#bc9367', accent: '#77563f', material: 'Walnut' },
  { kind: 'canechair', name: 'Cane-back chair', category: 'Seating', width: 52, depth: 52, price: 220, color: '#d8bc88', accent: '#936e4e', material: 'Rattan' },
  { kind: 'tubchair', name: 'Curved accent chair', category: 'Seating', width: 85, depth: 78, price: 440, color: '#e1d3bb', accent: '#a18d70', material: 'Boucle' },
  { kind: 'ottoman', name: 'Round pouf', category: 'Seating', width: 60, depth: 60, price: 160, color: '#c69976', accent: '#886046', material: 'Leather' },
  { kind: 'coffeetable', name: 'Low coffee table', category: 'Tables', width: 120, depth: 65, price: 320, color: '#c6a381', accent: '#765e49', material: 'Oak' },
  { kind: 'kettle', name: 'Gooseneck kettle', category: 'Coffee bar', width: 28, depth: 24, price: 95, color: '#c4a26a', accent: '#746047', material: 'Brass' },
  { kind: 'dripper', name: 'Pour-over station', category: 'Coffee bar', width: 30, depth: 28, price: 80, color: '#e3d3b7', accent: '#966a4d', material: 'Ceramic' },
  { kind: 'toaster', name: 'Countertop toaster', category: 'Coffee bar', width: 38, depth: 30, price: 140, color: '#b5c2b5', accent: '#6e7c6d', material: 'Chrome' },
  { kind: 'tray', name: 'Serving tray', category: 'Decor', width: 40, depth: 30, price: 28, color: '#b89164', accent: '#805e3e', material: 'Cork' },
  { kind: 'candle', name: 'Sculptural candle', category: 'Decor', width: 18, depth: 18, price: 24, color: '#ead1a0', accent: '#ae8a5a', material: 'Ceramic' },
  { kind: 'sculpture', name: 'Abstract ceramic sculpture', category: 'Decor', width: 35, depth: 25, price: 90, color: '#d8bb9b', accent: '#a18061', material: 'Ceramic' },
  { kind: 'basket', name: 'Woven storage basket', category: 'Decor', width: 45, depth: 40, price: 45, color: '#c6a16c', accent: '#947044', material: 'Rattan' },
  { kind: 'recordplayer', name: 'Record player', category: 'Decor', width: 48, depth: 35, price: 220, color: '#b48766', accent: '#59483c', material: 'Walnut' },
  { kind: 'tablelamp', name: 'Mushroom table lamp', category: 'Lighting', width: 32, depth: 32, price: 110, color: '#cc9a7e', accent: '#a17658', material: 'Ceramic' },
  { kind: 'wishbone', name: 'Wishbone dining chair', category: 'Seating', style: 'bentwood', role: 'chair', width: 55, depth: 51, height: 82, price: 240, color: '#c5a67a', accent: '#8a6945', material: 'Oak' },
  { kind: 'spindle', name: 'Spindle-back chair', category: 'Seating', style: 'spindle', role: 'chair', width: 49, depth: 48, height: 95, price: 180, color: '#879b84', accent: '#5e705b', material: 'Oak' },
  { kind: 'shellchair', name: 'Sculpted shell chair', category: 'Seating', style: 'tubchair', role: 'armchair', width: 63, depth: 62, height: 80, price: 275, color: '#cb9e89', accent: '#82684f', material: 'Velvet' },
  { kind: 'wingback', name: 'Wingback reading chair', category: 'Seating', style: 'wingback', role: 'armchair', width: 85, depth: 90, height: 118, price: 620, color: '#a2ad8d', accent: '#69543e', material: 'Linen' },
  { kind: 'loveseat', name: 'Curved velvet loveseat', category: 'Seating', style: 'sofa', role: 'sofa', width: 170, depth: 82, height: 88, shape: 'Round', price: 920, color: '#b67e75', accent: '#775044', material: 'Velvet' },
  { kind: 'booth', name: 'High-back dining booth', category: 'Seating', style: 'booth', role: 'bench', width: 190, depth: 70, height: 135, price: 1100, color: '#849a85', accent: '#596d56', material: 'Leather' },
  { kind: 'saddlestool', name: 'Saddle counter stool', category: 'Seating', style: 'stool', role: 'stool', width: 48, depth: 35, height: 72, price: 145, color: '#bb8d58', accent: '#70503d', material: 'Walnut' },
  { kind: 'footstool', name: 'Upholstered footstool', category: 'Seating', style: 'ottoman', role: 'stool', width: 72, depth: 48, height: 42, shape: 'Square', price: 190, color: '#d8cbb1', accent: '#9e9276', material: 'Boucle' },
  { kind: 'squarebistro', name: 'Square marble bistro table', category: 'Tables', style: 'table', role: 'table', width: 75, depth: 75, height: 74, shape: 'Square', price: 290, color: '#e6e2d6', accent: '#777a70', material: 'Marble' },
  { kind: 'ovaldining', name: 'Oval communal table', category: 'Tables', style: 'table', role: 'dining', width: 220, depth: 95, height: 75, shape: 'Round', price: 790, color: '#b18967', accent: '#71513a', material: 'Walnut' },
  { kind: 'hightop', name: 'High-top gathering table', category: 'Tables', style: 'dining', role: 'dining', width: 150, depth: 65, height: 105, shape: 'Square', price: 480, color: '#ac8c68', accent: '#54605a', material: 'Oak' },
  { kind: 'consoletable', name: 'Entry console table', category: 'Tables', style: 'console', role: 'side', width: 140, depth: 35, height: 85, price: 360, color: '#c2a181', accent: '#8a694b', material: 'Oak' },
  { kind: 'nestingtables', name: 'Nesting side-table pair', category: 'Tables', style: 'nesting', role: 'side', width: 80, depth: 60, height: 55, price: 250, color: '#d4c8b3', accent: '#a08553', material: 'Brass' },
  { kind: 'glasstable', name: 'Glass pedestal table', category: 'Tables', style: 'table', role: 'table', width: 90, depth: 90, height: 74, shape: 'Round', price: 420, color: '#bcd4d2', accent: '#829e9d', material: 'Glass' },
  { kind: 'terrazzoisland', name: 'Terrazzo service island', category: 'Tables', style: 'counter', role: 'counter', width: 180, depth: 85, height: 98, price: 980, color: '#e0cfb9', accent: '#8a9b88', material: 'Terrazzo' },
  { kind: 'pedestalside', name: 'Sculptural plinth table', category: 'Tables', style: 'plinth', role: 'side', width: 50, depth: 50, height: 52, price: 210, color: '#c4bcb0', accent: '#89867c', material: 'Concrete' },
  { kind: 'blender', name: 'Smoothie blender', category: 'Coffee bar', style: 'blender', role: 'grinder', width: 25, depth: 25, height: 48, price: 240, color: '#9baea2', accent: '#55695e', material: 'Glass' },
  { kind: 'teapot', name: 'Tea service pot', category: 'Coffee bar', style: 'teapot', role: 'kettle', width: 30, depth: 24, height: 26, price: 65, color: '#d2bc9e', accent: '#91765d', material: 'Ceramic' },
  { kind: 'scale', name: 'Digital brew scale', category: 'Coffee bar', style: 'scale', role: 'tray', width: 24, depth: 22, height: 8, price: 70, color: '#68756d', accent: '#314b3c', material: 'Metal' },
  { kind: 'oven', name: 'Countertop pastry oven', category: 'Coffee bar', style: 'oven', role: 'toaster', width: 65, depth: 50, height: 45, price: 650, color: '#b6beba', accent: '#58665f', material: 'Chrome' },
  { kind: 'dispenser', name: 'Infused-water dispenser', category: 'Coffee bar', style: 'dispenser', role: 'kettle', width: 30, depth: 30, height: 55, price: 95, color: '#c4ddd3', accent: '#9a7c52', material: 'Glass' },
  { kind: 'beanjar', name: 'Coffee-bean storage jar', category: 'Coffee bar', style: 'jar', role: 'vase', width: 22, depth: 22, height: 35, price: 30, color: '#bca585', accent: '#6e4a32', material: 'Glass' },
  { kind: 'teatins', name: 'Tea-tin collection', category: 'Coffee bar', style: 'tins', role: 'books', width: 55, depth: 20, height: 25, price: 55, color: '#879f87', accent: '#c7ae7b', material: 'Metal' },
  { kind: 'bakeryrack', name: 'Bakery display rack', category: 'Coffee bar', style: 'bakeryrack', role: 'cabinet', width: 85, depth: 40, height: 160, price: 420, color: '#ba956f', accent: '#80634b', material: 'Oak' },
  { kind: 'archway', name: 'Open arched doorway', category: 'Architecture', style: 'archway', role: 'door', width: 130, depth: 25, height: 250, price: 850, color: '#c9b698', accent: '#957c61', material: 'Concrete' },
  { kind: 'frenchdoor', name: 'Double French doors', category: 'Architecture', style: 'frenchdoor', role: 'door', width: 160, depth: 20, height: 235, price: 1250, color: '#a9baa8', accent: '#6e856d', material: 'Oak' },
  { kind: 'archedwindow', name: 'Arched picture window', category: 'Architecture', style: 'archedwindow', role: 'window', width: 155, depth: 20, height: 190, price: 820, color: '#b9d5cf', accent: '#ae8d65', material: 'Glass' },
  { kind: 'curtains', name: 'Full-height drapery', category: 'Architecture', style: 'curtains', role: 'window', width: 180, depth: 25, height: 230, price: 350, color: '#d8ccb4', accent: '#a49073', material: 'Linen' },
  { kind: 'column', name: 'Fluted interior column', category: 'Architecture', style: 'column', role: 'partition', width: 45, depth: 45, height: 260, price: 480, color: '#d9d3c2', accent: '#a79c87', material: 'Marble' },
  { kind: 'wallpanel', name: 'Decorative wall panel', category: 'Architecture', style: 'wallpanel', role: 'art', width: 120, depth: 15, height: 170, price: 230, color: '#c4b99e', accent: '#8d846f', material: 'Oak' },
  { kind: 'glassdivider', name: 'Reeded-glass divider', category: 'Architecture', style: 'glassdivider', role: 'partition', width: 140, depth: 20, height: 185, price: 680, color: '#c0d7ca', accent: '#99835b', material: 'Glass' },
  { kind: 'halfwall', name: 'Half-height partition', category: 'Architecture', style: 'wallpanel', role: 'partition', width: 180, depth: 25, height: 110, price: 390, color: '#a7b49c', accent: '#72826b', material: 'Concrete' },
  { kind: 'globependant', name: 'Opal globe pendant', category: 'Lighting', style: 'globe', role: 'pendant', width: 38, depth: 38, height: 80, price: 160, color: '#f1e7ce', accent: '#a58a56', material: 'Glass' },
  { kind: 'domependant', name: 'Wide brass dome pendant', category: 'Lighting', style: 'pendant', role: 'pendant', width: 75, depth: 75, height: 60, price: 280, color: '#c69b50', accent: '#8a6633', material: 'Brass' },
  { kind: 'chandelier', name: 'Three-globe chandelier', category: 'Lighting', style: 'chandelier', role: 'pendant', width: 130, depth: 45, height: 85, price: 580, color: '#ece0c5', accent: '#b28a46', material: 'Brass' },
  { kind: 'tracklight', name: 'Three-spot track light', category: 'Lighting', style: 'tracklight', role: 'pendant', width: 150, depth: 30, height: 40, price: 310, color: '#77857a', accent: '#495a4e', material: 'Metal' },
  { kind: 'lantern', name: 'Hanging paper lantern', category: 'Lighting', style: 'lantern', role: 'pendant', width: 55, depth: 55, height: 90, price: 95, color: '#f2e6cb', accent: '#b2a183', material: 'Linen' },
  { kind: 'arclamp', name: 'Arc reading lamp', category: 'Lighting', style: 'arclamp', role: 'lamp', width: 100, depth: 45, height: 185, price: 340, color: '#dbccb0', accent: '#a08a5b', material: 'Brass' },
  { kind: 'doublesconce', name: 'Double globe wall light', category: 'Lighting', style: 'doublesconce', role: 'sconce', width: 50, depth: 25, height: 65, price: 185, color: '#f2e6ca', accent: '#a58b59', material: 'Brass' },
  { kind: 'desklamp', name: 'Task desk lamp', category: 'Lighting', style: 'desklamp', role: 'tablelamp', width: 40, depth: 30, height: 55, price: 125, color: '#8da38f', accent: '#556e57', material: 'Metal' },
  { kind: 'cactus', name: 'Tall sculptural cactus', category: 'Decor', style: 'cactus', role: 'plant', width: 55, depth: 55, height: 130, price: 85, color: '#7d9d73', accent: '#c08e71', material: 'Ceramic' },
  { kind: 'fern', name: 'Cascading fern', category: 'Decor', style: 'fern', role: 'plant', width: 75, depth: 65, height: 80, price: 65, color: '#79975b', accent: '#b99567', material: 'Rattan' },
  { kind: 'wallplates', name: 'Decorative plate trio', category: 'Decor', style: 'wallplates', role: 'art', width: 115, depth: 15, height: 65, price: 95, color: '#d5ba95', accent: '#779487', material: 'Ceramic' },
  { kind: 'roundmirror', name: 'Round brass wall mirror', category: 'Decor', style: 'roundmirror', role: 'mirror', width: 85, depth: 15, height: 85, price: 250, color: '#bdd3d2', accent: '#b69754', material: 'Brass' },
  { kind: 'juterug', name: 'Round woven jute rug', category: 'Decor', style: 'rug', role: 'rug', width: 200, depth: 200, height: 5, shape: 'Round', price: 180, color: '#c1a477', accent: '#947c50', material: 'Rattan' },
  { kind: 'gallery', name: 'Gallery-wall triptych', category: 'Decor', style: 'gallery', role: 'art', width: 160, depth: 15, height: 85, price: 290, color: '#b59f7e', accent: '#7f6750', material: 'Walnut' },
  { kind: 'vasepair', name: 'Sculptural vase pair', category: 'Decor', style: 'vasepair', role: 'vase', width: 45, depth: 25, height: 48, price: 85, color: '#c8aa8a', accent: '#8d9277', material: 'Ceramic' },
  { kind: 'menustand', name: 'Tabletop menu holder', category: 'Decor', style: 'menustand', role: 'sign', width: 25, depth: 18, height: 35, price: 35, color: '#eee1c5', accent: '#876a4a', material: 'Oak' },
  { kind: 'gardenbench', name: 'Slatted garden bench', category: 'Outdoor', style: 'gardenbench', role: 'bench', width: 180, depth: 55, height: 90, price: 390, color: '#a4b29a', accent: '#687d5f', material: 'Oak' },
  { kind: 'patiochair', name: 'Woven patio armchair', category: 'Outdoor', style: 'canechair', role: 'armchair', width: 62, depth: 65, height: 88, price: 230, color: '#cfb183', accent: '#8d7653', material: 'Rattan' },
  { kind: 'picnictable', name: 'Terrace picnic table', category: 'Outdoor', style: 'picnictable', role: 'dining', width: 210, depth: 120, height: 75, price: 590, color: '#ba946e', accent: '#846344', material: 'Oak' },
  { kind: 'patioheater', name: 'Freestanding patio heater', category: 'Outdoor', style: 'patioheater', role: 'partition', width: 65, depth: 65, height: 220, price: 450, color: '#aeb8af', accent: '#65736a', material: 'Metal' },
  { kind: 'fence', name: 'Terrace picket fence', category: 'Outdoor', style: 'fence', role: 'partition', width: 200, depth: 20, height: 100, price: 210, color: '#d9d7c6', accent: '#a29f88', material: 'Oak' },
  { kind: 'chalkboard', name: 'Pavement chalkboard', category: 'Outdoor', style: 'chalkboard', role: 'menu', width: 65, depth: 45, height: 110, price: 120, color: '#415b4d', accent: '#b49369', material: 'Oak' },
  { kind: 'olivetree', name: 'Terracotta olive tree', category: 'Outdoor', style: 'olivetree', role: 'plant', width: 95, depth: 95, height: 190, price: 230, color: '#85987a', accent: '#b78263', material: 'Ceramic' },
  { kind: 'outdoorlantern', name: 'Floor hurricane lantern', category: 'Outdoor', style: 'outdoorlantern', role: 'tablelamp', width: 35, depth: 35, height: 65, price: 80, color: '#c1d5ca', accent: '#8d7854', material: 'Glass' },
  { kind: 'monstera', name: 'Split-leaf monstera', category: 'Decor', role: 'plant', width: 85, depth: 80, height: 120, price: 95, color: '#48794d', accent: '#95633f', material: 'Ceramic' },
  { kind: 'snakeplant', name: 'Upright snake plant', category: 'Decor', role: 'plant', width: 45, depth: 45, height: 95, price: 55, color: '#648443', accent: '#95633f', material: 'Ceramic' },
  { kind: 'succulent', name: 'Rosette succulent', category: 'Decor', role: 'plant', width: 30, depth: 30, height: 30, price: 30, color: '#8bad88', accent: '#95633f', material: 'Ceramic' },
  { kind: 'rubbertree', name: 'Broad-leaf rubber tree', category: 'Decor', role: 'plant', width: 75, depth: 70, height: 160, price: 145, color: '#416f50', accent: '#95633f', material: 'Ceramic' },
  { kind: 'bamboo', name: 'Clustered bamboo', category: 'Decor', role: 'plant', width: 65, depth: 60, height: 180, price: 120, color: '#83a55f', accent: '#95633f', material: 'Ceramic' },
  { kind: 'palm', name: 'Feather-leaf patio palm', category: 'Outdoor', role: 'plant', width: 110, depth: 100, height: 210, price: 190, color: '#638b51', accent: '#95633f', material: 'Ceramic' },
  { kind: 'cattree', name: 'Multi-level cat tree', category: 'Cat equipment', width: 85, depth: 75, height: 170, price: 180, color: '#c8b596', accent: '#987859', material: 'Boucle' },
  { kind: 'scratchpost', name: 'Sisal scratching post', category: 'Cat equipment', width: 45, depth: 45, height: 90, price: 45, color: '#cdb78e', accent: '#8e7052', material: 'Linen' },
  { kind: 'catbed', name: 'Round cat bed', category: 'Cat equipment', width: 60, depth: 60, height: 25, price: 55, color: '#b5bfa3', accent: '#8d9c7d', material: 'Velvet' },
  { kind: 'catcave', name: 'Cozy cat cave', category: 'Cat equipment', width: 55, depth: 60, height: 50, price: 65, color: '#c1b69e', accent: '#8f816c', material: 'Boucle' },
  { kind: 'catbowls', name: 'Raised food and water bowls', category: 'Cat equipment', width: 50, depth: 30, height: 18, price: 35, color: '#e3d9c5', accent: '#9b7755', material: 'Ceramic' },
  { kind: 'catfountain', name: 'Cat drinking fountain', category: 'Cat equipment', width: 35, depth: 35, height: 25, price: 60, color: '#c3d5cd', accent: '#789e98', material: 'Ceramic' },
  { kind: 'cattunnel', name: 'Play tunnel', category: 'Cat equipment', width: 120, depth: 40, height: 40, price: 40, color: '#c6a48e', accent: '#91715b', material: 'Linen' },
  { kind: 'litterbox', name: 'Covered litter box', category: 'Cat equipment', width: 65, depth: 55, height: 55, price: 70, color: '#d4d3bf', accent: '#929b85', material: 'Concrete' },
  { kind: 'cantileverumbrella', name: 'Cantilever shade umbrella', category: 'Outdoor', role: 'umbrella', width: 300, depth: 280, height: 270, price: 420, color: '#d7c9a9', accent: '#6f7569', material: 'Linen' },
  { kind: 'squareumbrella', name: 'Square market umbrella', category: 'Outdoor', role: 'umbrella', width: 260, depth: 260, height: 250, price: 290, color: '#c4b38d', accent: '#806849', material: 'Linen', shape: 'Square' },
  { kind: 'fanpalm', name: 'Potted fan palm', category: 'Outdoor', role: 'plant', width: 120, depth: 110, height: 155, price: 160, color: '#6f9558', accent: '#95633f', material: 'Ceramic' },
  { kind: 'datepalm', name: 'Tall date palm', category: 'Outdoor', role: 'plant', width: 150, depth: 140, height: 280, price: 310, color: '#608747', accent: '#95633f', material: 'Ceramic' },
  { kind: 'pergola', name: 'Slatted shade pergola', category: 'Outdoor', role: 'partition', width: 340, depth: 300, height: 280, price: 950, color: '#b29470', accent: '#7c6146', material: 'Oak' },
  { kind: 'sunlounger', name: 'Reclining sun lounger', category: 'Outdoor', style: 'chaise', role: 'bench', width: 75, depth: 195, height: 85, price: 320, color: '#c3c4a4', accent: '#967854', material: 'Linen' },
  { kind: 'outdoorsofa', name: 'Patio lounge sofa', category: 'Outdoor', style: 'sofa', role: 'sofa', width: 220, depth: 95, height: 90, price: 690, color: '#c4c7ae', accent: '#8b7150', material: 'Rattan' },
  { kind: 'firepit', name: 'Round patio fire bowl', category: 'Outdoor', width: 100, depth: 100, height: 55, price: 350, color: '#6d7167', accent: '#444e48', material: 'Concrete' },
  { kind: 'waterfeature', name: 'Tiered garden water fountain', category: 'Outdoor', width: 110, depth: 110, height: 140, price: 460, color: '#b3b8a4', accent: '#82928b', material: 'Concrete' },
  { kind: 'patiostorage', name: 'Outdoor storage cabinet', category: 'Outdoor', style: 'cabinet', role: 'cabinet', width: 140, depth: 55, height: 100, price: 280, color: '#9b9476', accent: '#6c735e', material: 'Oak' },
];

export interface FrameImage { src: string; fit: 'Cover' | 'Contain' }
export const MAX_FRAME_IMAGE_LENGTH = 600_000;
export function framePanels(kind: string) {
  if (kind === 'art') return [{ x: 4, y: 3, width: 92, height: 94, inset: 7 }];
  if (kind === 'gallery') return [2, 36, 70].map((x, i) => ({ x, y: i === 1 ? 6 : 20, width: 28, height: 73, inset: 4 }));
  return [];
}

export interface Furnishing {
  id: string;
  kind: string;
  name: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  rotation: number;
  height?: number;
  elevation?: number;
  color: string;
  accent: string;
  material: Material;
  legColor?: string;
  legMaterial?: Material;
  images?: (FrameImage | null)[];
  pattern: Pattern;
  shape: 'Rounded' | 'Square' | 'Round';
  text: string;
  font: typeof fonts[number];
  detail: number;
  lightPower: number;
  lightWarmth: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
}

export function furnishingRole(kind: string): string {
  const entry = catalog.find((entry) => entry.kind === kind);
  if (entry?.role) return furnishingRole(entry.role);
  const roles: Record<string, string> = {
    bentwood: 'chair', canechair: 'chair', tubchair: 'armchair', ottoman: 'stool',
    coffeetable: 'side', tablelamp: 'lamp',
  };
  return roles[kind] ?? kind;
}

export const PLANT_POT_COLOR = '#95633f';
export const isPlant = (kind: string) => ['plant', 'planter'].includes(furnishingRole(kind));
export const hasFurnitureLegs = (kind: string) => (catalog.find((entry) => entry.kind === kind)?.style ?? kind) !== 'ottoman' && ['chair', 'armchair', 'sofa', 'bench', 'stool', 'table', 'dining', 'side', 'outdoor'].includes(furnishingRole(kind));
export function furnitureLegFinish(item: Furnishing) {
  const plinth = catalog.find((entry) => entry.kind === item.kind)?.style === 'plinth';
  return { legColor: item.legColor ?? (plinth ? item.color : item.accent), legMaterial: item.legMaterial ?? item.material };
}

export interface Room {
  name: string;
  nameColor?: string;
  width: number;
  depth: number;
  wall: string;
  trim: string;
  floor: string;
  floorAccent: string;
  floorStyle: typeof floorStyles[number];
  wallStyle: typeof wallStyles[number];
  wallHeight: number;
  floorScale: number;
  light: number;
  warmth: number;
  night: boolean;
  facade: string;
  awning: string;
  awningStyle: 'Striped' | 'Solid' | 'None';
  font: typeof fonts[number];
}
export interface CafeArea { id: string; outdoor: boolean; room: Room; items: Furnishing[] }
export interface Design { room: Room; items: Furnishing[]; areas?: CafeArea[] }
export const MAX_AREAS = 8;
export function syncOutdoorAreas(design: Design): Design {
  if (!design.areas?.some((area) => area.outdoor && area.room.width !== design.room.width)) return design;
  return { ...design, areas: design.areas.map((area) => {
    if (!area.outdoor || area.room.width === design.room.width) return area;
    const room = { ...area.room, width: design.room.width };
    return { ...area, room, items: area.items.map((item) => fitItem(item, room)) };
  }) };
}
export function designAreas(design: Design): CafeArea[] {
  return [{ id: 'main', outdoor: false, room: design.room, items: design.items }, ...(syncOutdoorAreas(design).areas ?? [])];
}
export function layoutAreas(design: Design) {
  const areas = designAreas(design);
  const front = design.room.depth / 2;
  let indoorLeft = -design.room.width / 2;
  let outdoorBack = front;
  return areas.map((area) => {
    const x = area.outdoor ? 0 : indoorLeft + area.room.width / 2;
    const z = area.outdoor ? outdoorBack + area.room.depth / 2 : (area.room.depth - design.room.depth) / 2;
    if (area.outdoor) outdoorBack += area.room.depth;
    else indoorLeft += area.room.width;
    return { ...area, x, z };
  });
}
export function layoutBounds(design: Design) {
  const areas = layoutAreas(design);
  const left = Math.min(...areas.map((area) => area.x - area.room.width / 2));
  const right = Math.max(...areas.map((area) => area.x + area.room.width / 2));
  const back = Math.min(...areas.map((area) => area.z - area.room.depth / 2));
  const front = Math.max(...areas.map((area) => area.z + area.room.depth / 2));
  return { width: right - left, depth: front - back, x: (left + right) / 2, z: (back + front) / 2 };
}
export const totalItems = (design: Design) => designAreas(design).reduce((count, area) => count + area.items.length, 0);
export function areaAtFloor(design: Design, x: number, z: number) {
  for (const area of layoutAreas(design)) {
    const localX = x - area.x + area.room.width / 2;
    const localY = z - area.z + area.room.depth / 2;
    if (localX >= 0 && localX <= area.room.width && localY >= 0 && localY <= area.room.depth) return { areaId: area.id, x: localX, y: localY };
  }
  return null;
}

export function findFreePlacement(item: Furnishing, design: Design, snap = true): Furnishing | null {
  const candidate = fitItem(item, design.room, snap);
  const bounds = (value: Furnishing) => {
    const angle = value.rotation * Math.PI / 180;
    return { width: Math.abs(Math.cos(angle)) * value.width + Math.abs(Math.sin(angle)) * value.depth,
      depth: Math.abs(Math.sin(angle)) * value.width + Math.abs(Math.cos(angle)) * value.depth };
  };
  const own = bounds(candidate);
  const others = design.items.filter((other) => !other.hidden && furnishingRole(other.kind) !== 'rug').map((other) => ({ ...other, ...bounds(other) }));
  for (let y = own.depth / 2 + 10; y <= design.room.depth - own.depth / 2; y += 20) {
    for (let x = own.width / 2 + 10; x <= design.room.width - own.width / 2; x += 20) {
      const placed = fitItem({ ...candidate, x, y }, design.room, snap);
      if (others.every((other) => Math.abs(placed.x - other.x) >= (own.width + other.width) / 2 + 10
        || Math.abs(placed.y - other.y) >= (own.depth + other.depth) / 2 + 10)) return placed;
    }
  }
  return null;
}
export interface SavedDesign { id: string; name: string; design: Design }
export interface StudioSave { version: 1; current: Design; slots: SavedDesign[] }
export interface Theme { name: string; description: string; wall: string; trim: string; floor: string; accent: string; upholstery: string; floorStyle: Room['floorStyle'] }
export const themes: Theme[] = [
  { name: 'Slow Sunday', description: 'Warm oak, soft sage, a little sunshine.', wall: '#efe8d8', trim: '#a78c6e', floor: '#c5a17c', accent: '#70886e', upholstery: '#b6c2a3', floorStyle: 'Planks' },
  { name: 'Parisian', description: 'Cream marble and rose-colored afternoons.', wall: '#f3e4da', trim: '#b79b79', floor: '#e8dec9', accent: '#704d50', upholstery: '#c98e98', floorStyle: 'Checkerboard' },
  { name: 'Japandi', description: 'Quiet lines, natural textures, room to breathe.', wall: '#e9e5d9', trim: '#8c8069', floor: '#cdbb9c', accent: '#565e4d', upholstery: '#bbbda5', floorStyle: 'Herringbone' },
  { name: 'Botanical', description: 'A green escape for coffee and daydreams.', wall: '#d9e3ce', trim: '#728264', floor: '#c0a184', accent: '#3e684c', upholstery: '#91ac7e', floorStyle: 'Tiles' },
  { name: 'Industrial', description: 'Brick, dark metal, and honest materials.', wall: '#bb8d73', trim: '#514d47', floor: '#a6a39b', accent: '#414c4b', upholstery: '#a87950', floorStyle: 'Plain' },
  { name: 'Coastal', description: 'Sea glass, linen, and salt-air blues.', wall: '#edf0e3', trim: '#9dbaa9', floor: '#d9c8a9', accent: '#508f99', upholstery: '#abd0cd', floorStyle: 'Planks' },
  { name: 'Vintage', description: 'Honey wood and collected little treasures.', wall: '#e9d8ae', trim: '#8a6550', floor: '#ad8059', accent: '#8f6249', upholstery: '#be9857', floorStyle: 'Terrazzo' },
];

export function newItem(kind: string, id: string, x: number, y: number): Furnishing {
  const entry = catalog.find((item) => item.kind === kind);
  if (!entry) throw new Error(`Unknown furnishing: ${kind}`);
  const role = furnishingRole(kind);
  return {
    id, kind, name: entry.name, x, y, width: entry.width, depth: entry.depth, rotation: 0,
    color: entry.color, accent: entry.accent, material: entry.material, pattern: 'Plain',
    ...(hasFurnitureLegs(kind) ? { legColor: entry.style === 'plinth' ? entry.color : entry.accent, legMaterial: entry.material } : {}),
    shape: entry.shape ?? (['table', 'side', 'stool', 'outdoor', 'plant', 'pendant', 'clock', 'umbrella', 'cups', 'vase'].includes(role) ? 'Round' : 'Rounded'),
    text: role === 'menu' ? 'COFFEE\nEspresso  3\nLatte  4\nMatcha  4\nMade with love' : role === 'sign' ? 'stay a little' : '',
    font: 'serif', detail: 55, lightPower: 70, lightWarmth: 65, opacity: 100, locked: false, hidden: false,
  };
}

export function createDesign(): Design {
  const theme = themes[0];
  const room: Room = {
    name: "Sarah's little cafe", width: 900, depth: 640, wall: theme.wall, trim: theme.trim,
    floor: theme.floor, floorAccent: '#e8d6b8', floorStyle: theme.floorStyle, wallStyle: 'Paneling',
    wallHeight: 90, floorScale: 60, light: 85, warmth: 35, night: false,
    facade: '#92a48a', awning: '#f4e7ca', awningStyle: 'Striped', font: 'serif',
  };
  const placements: [string, number, number][] = [
    ['rug', 590, 360], ['counter', 240, 110], ['machine', 200, 105], ['grinder', 270, 105],
    ['display', 390, 105], ['shelf', 240, 30], ['window', 650, 16],
    ['bench', 680, 125], ['table', 650, 235], ['chair', 650, 315],
    ['table', 270, 380], ['chair', 270, 300], ['chair', 270, 460],
    ['sofa', 680, 480], ['side', 560, 480], ['plant', 815, 80], ['plant', 80, 550],
    ['pendant', 270, 380], ['cups', 650, 235], ['vase', 560, 480], ['door', 500, 20],
  ];
  return { room, items: placements.map(([kind, x, y], i) => newItem(kind, `starter-${i}`, x, y)) };
}

export function fitItem(item: Furnishing, room: Room, snap = false): Furnishing {
  const angle = item.rotation * Math.PI / 180;
  const boundsWidth = Math.abs(Math.cos(angle)) * item.width + Math.abs(Math.sin(angle)) * item.depth;
  const boundsDepth = Math.abs(Math.sin(angle)) * item.width + Math.abs(Math.cos(angle)) * item.depth;
  const scale = Math.min(1, room.width / boundsWidth, room.depth / boundsDepth);
  const dx = boundsWidth * scale / 2;
  const dy = boundsDepth * scale / 2;
  const x = snap ? Math.round(item.x / 10) * 10 : item.x;
  const y = snap ? Math.round(item.y / 10) * 10 : item.y;
  return { ...item, width: item.width * scale, depth: item.depth * scale, x: Math.max(dx, Math.min(room.width - dx, x)), y: Math.max(dy, Math.min(room.depth - dy, y)) };
}

export function resizeRoom(design: Design, room: Room): Design {
  return syncOutdoorAreas({ ...design, room, items: design.items.map((item) => fitItem(item, room)) });
}

export function applyTheme(design: Design, theme: Theme, furniture: boolean): Design {
  return {
    ...design,
    room: { ...design.room, wall: theme.wall, floor: theme.floor, trim: theme.trim, floorStyle: theme.floorStyle, facade: theme.accent,
      wallStyle: theme.name === 'Industrial' ? 'Brick' : theme.name === 'Parisian' ? 'Paneling' : 'Paint' },
    items: furniture ? design.items.map((item) => ({
      ...item, ...(hasFurnitureLegs(item.kind) ? furnitureLegFinish(item) : {}),
      color: catalog.find((entry) => entry.kind === item.kind)?.category === 'Seating' ? theme.upholstery : item.color,
      accent: theme.accent,
    })) : design.items,
  };
}

export interface History { past: Design[]; present: Design; future: Design[] }
export type HistoryAction = { type: 'edit'; design: Design } | { type: 'undo' } | { type: 'redo' };
export function historyReducer(state: History, action: HistoryAction): History {
  if (action.type === 'undo') {
    const previous = state.past.at(-1);
    return previous ? { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] } : state;
  }
  if (action.type === 'redo') {
    const next = state.future[0];
    return next ? { past: [...state.past, state.present].slice(-50), present: next, future: state.future.slice(1) } : state;
  }
  if (JSON.stringify(state.present) === JSON.stringify(action.design)) return state;
  return { past: [...state.past, state.present].slice(-50), present: action.design, future: [] };
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid saved design object.');
  return value as Record<string, unknown>;
}
function string(value: unknown, max = 100): string {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid saved text.');
  return value;
}
function color(value: unknown): string {
  const text = string(value);
  if (!/^#[0-9a-f]{6}$/i.test(text)) throw new Error('Invalid saved color.');
  return text;
}
function number(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error('Invalid saved measurement.');
  return value;
}
function boolean(value: unknown): boolean {
  if (typeof value !== 'boolean') throw new Error('Invalid saved setting.');
  return value;
}
function option<T extends string>(value: unknown, options: readonly T[]): T {
  const found = options.find((entry) => entry === value);
  if (!found) throw new Error('Unknown saved option.');
  return found;
}
function frameImages(value: unknown, kind: string): (FrameImage | null)[] {
  if (!Array.isArray(value) || !framePanels(kind).length || value.length > framePanels(kind).length) throw new Error('Invalid saved frame images.');
  return value.map((image) => {
    if (image === null) return null;
    const data = record(image);
    const src = string(data.src, MAX_FRAME_IMAGE_LENGTH);
    if (!/^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/]+={0,2}$/.test(src) || (src.length - 'data:image/jpeg;base64,'.length) % 4 !== 0) throw new Error('Invalid saved frame picture. Use a JPEG processed by the studio.');
    return { src, fit: option(data.fit, ['Cover', 'Contain']) };
  });
}
export function decodeDesign(value: unknown, nested = false): Design {
  const data = record(value);
  if (nested && data.areas !== undefined) throw new Error('Nested cafe areas are not supported.');
  const r = record(data.room);
  const room: Room = {
    name: string(r.name, 60), width: number(r.width, 400, 1600), depth: number(r.depth, 350, 1200),
    ...(r.nameColor === undefined ? {} : { nameColor: color(r.nameColor) }),
    wall: color(r.wall), trim: color(r.trim), floor: color(r.floor), floorAccent: color(r.floorAccent),
    floorStyle: option(r.floorStyle, floorStyles), wallStyle: option(r.wallStyle, wallStyles),
    wallHeight: number(r.wallHeight, 30, 180), floorScale: number(r.floorScale, 20, 120),
    light: number(r.light, 0, 100), warmth: number(r.warmth, 0, 100), night: boolean(r.night),
    facade: color(r.facade), awning: color(r.awning), awningStyle: option(r.awningStyle, ['Striped', 'Solid', 'None']),
    font: option(r.font, fonts),
  };
  if (!Array.isArray(data.items) || data.items.length > MAX_ITEMS) throw new Error('Too many saved furnishings.');
  const ids = new Set<string>();
  const items = data.items.map((value): Furnishing => {
    const item = record(value);
    const id = string(item.id);
    if (!id || ids.has(id)) throw new Error('Duplicate or missing furnishing ID.');
    ids.add(id);
    return {
      id, kind: option(item.kind, catalog.map((entry) => entry.kind)), name: string(item.name, 60),
      x: number(item.x, 0, room.width), y: number(item.y, 0, room.depth),
      width: number(item.width, 10, 350), depth: number(item.depth, 10, 300), rotation: number(item.rotation, 0, 360),
      ...(item.height === undefined ? {} : { height: number(item.height, 5, 350) }),
      ...(item.elevation === undefined ? {} : { elevation: number(item.elevation, 0, 300) }),
      color: color(item.color), accent: color(item.accent), material: option(item.material, materials),
      ...(item.legColor === undefined ? {} : { legColor: color(item.legColor) }),
      ...(item.legMaterial === undefined ? {} : { legMaterial: option(item.legMaterial, materials) }),
      ...(item.images === undefined ? {} : { images: frameImages(item.images, String(item.kind)) }),
      pattern: option(item.pattern, patterns), shape: option(item.shape, ['Rounded', 'Square', 'Round']),
      text: string(item.text, 200), font: option(item.font, fonts), detail: number(item.detail, 0, 100),
      lightPower: number(item.lightPower, 0, 100), lightWarmth: number(item.lightWarmth, 0, 100),
      opacity: number(item.opacity, 15, 100), locked: boolean(item.locked), hidden: boolean(item.hidden),
    };
  });
  const result: Design = { room, items };
  if (data.areas !== undefined) {
    if (!Array.isArray(data.areas) || data.areas.length > MAX_AREAS) throw new Error('Too many cafe areas.');
    const areaIds = new Set(['main']);
    result.areas = data.areas.map((value): CafeArea => {
      const area = record(value);
      const id = string(area.id);
      if (!id || areaIds.has(id)) throw new Error('Duplicate or missing cafe area ID.');
      areaIds.add(id);
      const decoded = decodeDesign(area, true);
      for (const item of decoded.items) {
        if (ids.has(item.id)) throw new Error('Duplicate furnishing ID across cafe areas.');
        ids.add(item.id);
      }
      return { id, outdoor: boolean(area.outdoor), ...decoded };
    });
    if (totalItems(result) > MAX_ITEMS) throw new Error('Too many saved furnishings across cafe areas.');
  }
  return syncOutdoorAreas(result);
}
export function decodeStudioSave(value: unknown): StudioSave {
  const data = record(value);
  if (data.version !== 1 || !Array.isArray(data.slots) || data.slots.length > 6) throw new Error('Unsupported studio save.');
  const ids = new Set<string>();
  return { version: 1, current: decodeDesign(data.current), slots: data.slots.map((value) => {
    const slot = record(value);
    const id = string(slot.id);
    if (!id || ids.has(id)) throw new Error('Duplicate or missing saved concept ID.');
    ids.add(id);
    return { id, name: string(slot.name, 60), design: decodeDesign(slot.design) };
  }) };
}

export function decodeMemoryDesign(value: unknown): MemoryDesignSetting {
  const data = record(value);
  if (data.version !== 1) throw new Error('Unsupported memory cafe design.');
  return { version: 1, enabled: boolean(data.enabled), design: decodeDesign(data.design) };
}

export function publishDesign(design: Design): MemoryDesignSetting {
  return decodeMemoryDesign({ version: 1, enabled: true, design });
}

export function designStats(design: Design) {
  const allItems = designAreas(design).flatMap((area) => area.items);
  const visible = allItems.filter((item) => !item.hidden);
  return {
    area: Math.round(designAreas(design).reduce((sum, area) => sum + area.room.width * area.room.depth, 0) / 10000 * 10) / 10,
    seats: visible.reduce((count, item) => count + (['chair', 'armchair', 'stool'].includes(furnishingRole(item.kind)) ? 1 : ['sofa', 'bench'].includes(furnishingRole(item.kind)) ? Math.max(1, Math.floor(item.width / 55)) : 0), 0),
    cost: allItems.reduce((cost, item) => cost + (catalog.find((entry) => entry.kind === item.kind)?.price ?? 0), 0),
    plants: visible.filter((item) => ['plant', 'planter'].includes(furnishingRole(item.kind))).length,
    lights: visible.filter((item) => ['pendant', 'sconce', 'lamp'].includes(furnishingRole(item.kind))).length,
    tables: visible.filter((item) => ['table', 'dining', 'outdoor'].includes(furnishingRole(item.kind))).length,
    coffeeBar: visible.some((item) => furnishingRole(item.kind) === 'counter') && visible.some((item) => item.kind === 'machine'),
    entrance: visible.some((item) => furnishingRole(item.kind) === 'door'),
  };
}
export const briefs = [
  { id: 'free', name: 'Your own little world', description: 'No timer, no rules, no budget limit. Make somewhere you would love to stay.' },
  { id: 'botanical', name: 'The botanical hideaway', description: 'A leafy retreat for six guests. Add four plants, two lights, and a working coffee bar. Concept budget: $9,000.' },
  { id: 'social', name: 'Coffee with company', description: 'A gathering spot for ten guests, with three tables, three lights, a coffee bar, and an entrance. Concept budget: $12,000.' },
  { id: 'tiny', name: 'Small space, big heart', description: 'Design a cafe no larger than 35 square meters with four seats, a table, a light, an entrance, and a coffee bar. Concept budget: $7,000.' },
] as const;
export function briefChecks(design: Design, id: string): { label: string; done: boolean }[] {
  const s = designStats(design);
  if (id === 'free') return [];
  const tiny = id === 'tiny';
  const social = id === 'social';
  return [
    { label: `${tiny ? 4 : social ? 10 : 6} guest seats`, done: s.seats >= (tiny ? 4 : social ? 10 : 6) },
    { label: `${social ? 3 : 1} dining table${social ? 's' : ''}`, done: s.tables >= (social ? 3 : 1) },
    { label: `${tiny ? 1 : social ? 3 : 2} light fixture${tiny ? '' : 's'}`, done: s.lights >= (tiny ? 1 : social ? 3 : 2) },
    { label: 'Counter + espresso machine', done: s.coffeeBar },
    { label: 'Entrance door', done: s.entrance },
    ...(id === 'botanical' ? [{ label: '4 leafy plants', done: s.plants >= 4 }] : []),
    ...(tiny ? [{ label: '35 square meters or less', done: s.area <= 35 }] : []),
    { label: `Within $${tiny ? '7,000' : social ? '12,000' : '9,000'} concept budget`, done: s.cost <= (tiny ? 7000 : social ? 12000 : 9000) },
  ];
}
