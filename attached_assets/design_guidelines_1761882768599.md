# Premium eCommerce Template Design Guidelines

## Design Approach

**Reference-Based Approach**: Gumroad-inspired minimalist aesthetic
- Primary inspiration: Gumroad's clean, product-focused interface
- Secondary influences: Stripe's restraint, Apple's clarity
- Key principle: Remove everything that doesn't serve the product

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (weights: 400, 500, 600, 700) - for UI, navigation, product info
- Accent: Space Grotesk (weights: 500, 600) - for hero headlines and section titles

**Type Scale**:
- Hero headline: text-5xl md:text-6xl lg:text-7xl (Space Grotesk 600)
- Section titles: text-3xl md:text-4xl (Space Grotesk 600)
- Product titles: text-xl md:text-2xl (Inter 600)
- Body text: text-base md:text-lg (Inter 400)
- Labels/metadata: text-sm (Inter 500)
- Micro-copy: text-xs (Inter 400)

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-12 md:py-20 lg:py-24
- Grid gaps: gap-4 md:gap-6 lg:gap-8
- Card spacing: p-6 md:p-8

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Padding: px-4 md:px-6 lg:px-8
- Full-width sections with contained inner content

## Component Library

### Navigation
**Header**:
- Fixed position with backdrop blur (sticky top-0 backdrop-blur-md)
- Minimal height: h-16 md:h-20
- Logo left, navigation center, user actions right
- Search icon triggers expanding search bar
- Cart icon with item count badge
- Dark/light mode toggle (moon/sun icon)

### Home Page Structure

**Hero Section**:
- Full-width carousel (h-[500px] md:h-[600px] lg:h-[700px])
- Overlaid headline and CTA with blurred background button treatment
- Auto-rotating slides with smooth fade transitions
- Minimal navigation dots below

**Product Grid**:
- 1 column mobile, 2 tablet, 3-4 desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Card-based design with generous whitespace
- Product image (aspect-ratio-square with object-cover)
- Title, price, quick view button on hover
- Subtle lift animation on hover (hover:translate-y-[-4px])

**Filter Sidebar**:
- Sticky on desktop (sticky top-24)
- Collapsible on mobile (slide-in drawer)
- Category checkboxes, price range slider, delivery options
- Clean, spacious layout with section dividers

### Product Detail Page

**Layout**:
- Two-column on desktop: 60% image gallery, 40% product info
- Single column on mobile with gallery first

**Image Gallery**:
- Large primary image with thumbnail strip below
- Zoom on hover for desktop
- Swipe gallery on mobile
- 4-5 images showing product from different angles

**Product Info Panel**:
- Product title (text-3xl)
- Price (text-4xl, bold)
- Star rating + review count
- Short description (2-3 lines)
- Specifications list (expandable)
- Quantity selector (- input +)
- Add to cart button (w-full, large)
- Shipping info, return policy (collapsible sections)

### Authentication Pages

**Login/Signup**:
- Centered card layout (max-w-md)
- Minimal form fields with generous spacing (space-y-6)
- Social login options (Google, Apple)
- Clean input fields with focus states
- Single prominent CTA button

### Dashboard

**Layout**:
- Left sidebar navigation (w-64, hidden on mobile)
- Main content area with stats cards at top
- Tab navigation for orders/products/settings

**Order Cards**:
- Timeline-style layout showing order progression
- Product thumbnail, title, status badge
- Order details expandable

**Stats Overview**:
- 3-4 card grid showing key metrics
- Large numbers with trend indicators
- Minimal chart visualizations

## Design Patterns

### Cards
- Rounded corners: rounded-lg (8px)
- Subtle shadow: shadow-sm with hover:shadow-md transition
- Padding: p-4 md:p-6
- Border: Optional subtle border when needed

### Buttons
**Primary CTA**:
- Large tap target: px-8 py-3 md:px-10 md:py-4
- Rounded: rounded-full
- Font weight: font-semibold
- Smooth transitions on all states

**Secondary/Ghost**:
- Border style with transparent background
- Same sizing as primary

**Image Overlay Buttons** (Hero/Banners):
- Backdrop blur background: backdrop-blur-md
- Semi-transparent treatment
- No custom hover states (rely on button component)

### Form Elements
- Input height: h-12 md:h-14
- Rounded: rounded-lg
- Focus ring with smooth transition
- Floating labels or placeholder text
- Clear error states below inputs

### Icons
- Library: Heroicons (via CDN)
- Size: w-5 h-5 for navigation, w-6 h-6 for features
- Consistent stroke width throughout

## Animations

**Micro-interactions** (use sparingly):
- Product card hover lift: 150ms ease
- Button hover scale: scale-105, 200ms
- Page transitions: fade-in with slight upward motion
- Cart addition: Brief scale pulse on cart icon

**Carousel**:
- Smooth crossfade between slides (duration-700)
- Auto-advance every 5 seconds
- Pause on hover

**Mode Toggle**:
- Smooth transition: transition-colors duration-300
- Rotate icon animation when switching

## Images

**Hero Carousel Images** (5 slides):
1. Lifestyle shot: Product in aspirational setting, wide angle
2. Close-up: Detail shot showing craftsmanship/texture
3. Use case: Product being used in real scenario
4. Flat lay: Product with complementary items, overhead
5. Environment: Product in styled, minimalist background

**Product Grid Images**:
- Clean product photography on neutral/white background
- Consistent lighting and perspective across all products
- Square aspect ratio for grid uniformity

**Product Detail Gallery**:
- Front view (hero image)
- Back/side angles
- Detail shots (materials, features)
- Scale reference (product in hand or with common object)
- Packaging shot

## Responsive Breakpoints

- Mobile: < 768px (single column, collapsible filters, hamburger menu)
- Tablet: 768px - 1024px (2-column grid, slide-in filters)
- Desktop: > 1024px (3-4 column grid, sidebar filters, full navigation)

## Dashboard Specifics

**Seller View**:
- Product management table with inline editing
- Add product CTA prominent in top-right
- Sales analytics with simple bar/line charts

**Buyer View**:
- Order history with status tracking
- Wishlist grid (same style as product grid)
- Saved addresses, payment methods

## Documentation Page

**Setup.html Structure**:
- Three-column layout showing: Frontend → Backend API → Database
- Code snippets with syntax highlighting
- Visual diagrams showing data flow
- Clear section markers for integration points
- Example API response formats in expandable blocks