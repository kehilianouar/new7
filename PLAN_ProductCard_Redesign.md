# Product Card Redesign Plan

## Current State Analysis
- Existing ProductCard component has basic functionality but needs modernization
- CartContext already supports variants
- Product type already has variants structure
- Dialog component available for modal functionality

## Required Features
1. **Enhanced Visual Design**
   - Larger, clearer product images
   - Better typography for product name and brand
   - Prominent pricing with discount display
   - Star ratings display

2. **Interactive Elements**
   - Add to cart button with conditional behavior
   - Favorite (heart) icon
   - Quick view functionality

3. **Variant Support Modal**
   - Modal for products with variants (size, flavor, color, etc.)
   - Image and product details in modal
   - Variant selection interface
   - Quantity selector
   - Confirm add to cart button

4. **Responsive Design**
   - Mobile-first approach
   - Touch-friendly interactions
   - Optimized for different screen sizes

## Implementation Steps

### 1. Create Product Variant Modal Component
- New component: `ProductVariantModal.tsx`
- Uses existing Dialog component
- Handles variant selection and quantity
- Displays product image and details

### 2. Redesign ProductCard Component
- Update layout for better visual hierarchy
- Add proper variant detection logic
- Implement conditional add-to-cart behavior
- Enhance hover effects and animations

### 3. Update Types (if needed)
- Check if ProductVariant type needs enhancement
- Ensure proper typing for variant selection

### 4. Testing
- Test with products that have variants
- Test with products without variants
- Test responsive behavior
- Test modal functionality

## Design Specifications
- **Color Scheme**: Black + Gold + White (store identity)
- **Typography**: Clear, readable fonts with proper hierarchy
- **Spacing**: Adequate padding and margins for touch targets
- **Animations**: Smooth transitions and hover effects

## Files to Modify/Create
- `src/components/store/ProductCard.tsx` - Main redesign
- `src/components/store/ProductVariantModal.tsx` - New modal component
- `src/types/store.ts` - Type enhancements (if needed)
- `TODO.md` - Update progress tracking

## Success Criteria
- Modern, attractive product cards
- Functional variant selection modal
- Responsive design across devices
- Improved user experience for adding products to cart
- Consistent with store's black/gold/white color scheme
