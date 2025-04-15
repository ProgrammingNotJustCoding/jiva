import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import Bento from "@/components/home/Bento";
import Hero from "@/components/home/Hero";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Bento />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
