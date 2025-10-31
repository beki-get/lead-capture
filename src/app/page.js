import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import Section from '@/components/Section';
import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
     <>
      <Hero />
       <Section />
      <Features />
      <LeadForm />

      <Pricing />
      <Testimonials />
      <Footer />

   </> 
  );
}
