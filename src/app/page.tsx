import Navbar from "@/components/Navbar";
import HeroSequence from "@/components/HeroSequence";
import About from "@/components/About";
import Products from "@/components/Products";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-luxury-bg text-luxury-text-primary">
      {/* Minimalism Header Nav */}
      <Navbar />

      {/* Cinematic scroll sequence container */}
      <HeroSequence />

      {/* Editorial space */}
      <About />

      {/* Portfolio product showcase */}
      <Products />

      {/* Infrastructure services showcase */}
      <Services />

      {/* Architectural timeline checks */}
      <WhyChooseUs />

      {/* Masonry filter gallery */}
      <Projects />

      {/* Client Speccing and Contact Form */}
      <Contact />

      {/* Bottom info section */}
      <Footer />
    </main>
  );
}
