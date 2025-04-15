import React from "react";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <section className="w-full h-[80vh] bg-white py-20 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full z-0 opacity-70"
        style={{
          clipPath: "polygon(0 10%, 50% 0, 0 100%)",
        }}
      >
        <Image
          src="/images/gradient.webp"
          alt="Background gradient"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-8 mb-10 md:mb-0">
            <div className="max-w-lg">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Making Coal Mine Operations Safer and More Productive
              </h1>

              <p className="text-lg md:text-xl text-neutral-900 mb-6">
                Jiva simplifies daily tasks and enhances safety compliance for
                everyone working in coal mines. Move away from paper logs and
                complex tracking spreadsheets with an easy-to-use digital
                solution.
              </p>

              <div className="flex gap-4">
                <button className="bg-cyan-500 hover:bg-cyan-700 text-white px-6 py-3 rounded-md text-lg font-medium transition-colors">
                  Get Started
                </button>
                <button className="border border-cyan-500 text-cyan-500 hover:bg-cyan-50 px-6 py-3 rounded-md text-lg font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl h-[400px] md:h-[500px]">
              <Image
                src="/images/logo.png"
                alt="Coal mine operations"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
