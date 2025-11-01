import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const teamImage = "/assets/generated_images/About_us_team_image_6afd18db.png";

// TODO: Make content editable by admin via admin panel
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <BackButton fallbackPath="/" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-8">About Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                CommerceCanvas was founded with a simple mission: to provide customers with access to premium products at competitive prices. We believe in quality, transparency, and exceptional customer service.
              </p>
              <p className="text-muted-foreground mb-4">
                Since our inception, we've grown from a small startup to a trusted e-commerce platform serving thousands of satisfied customers worldwide. Our commitment to excellence drives everything we do.
              </p>
              <p className="text-muted-foreground">
                We carefully curate our product selection, working directly with manufacturers and suppliers to ensure the highest quality standards. Every item in our catalog is tested and verified before it reaches your doorstep.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={teamImage}
                alt="Our Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div className="text-center p-6 bg-card rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on quality. Every product meets our strict standards.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We're here to help every step of the way.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly evolve to bring you the latest and best products.
                </p>
              </div>
              <div className="p-6 bg-card rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We're committed to environmentally responsible business practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
