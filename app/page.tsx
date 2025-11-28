"use client";

import { useState, useEffect } from "react";
import Aurora from './components/aurora';
import GooeyNav from './components/nav/GooeyNav';
import DecryptedText from './components/DecryptedText';
import Particles from '@/components/Particles';
import SpotlightCard from './components/SpotLightCard';
import LetterGlitch from './components/LetterGlitch';
import Folder from './components/Folder';
import BounceCards from './components/BounceCards'

export default function Home() {

  const navItems = [
    { label: "Hero", href: "#hero" },
    { label: "About me", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Project", href: "#projects" },
    { label: "Waifu", href: "#waifus" },
  ];

  // ✅ your arrays must be used here (not inside JSX)
  const waifuImages: string[] = [
    "/Kouko.png",
    "/Kaguya.png",
    "/Shikimori.png",
    "/Miku.png",
    "/Waguri.png"
  ];

  const waifuTransforms: string[] = [
  "rotate(5deg) translate(-150px)",
  "rotate(0deg) translate(-70px)",
  "rotate(0deg)",          // <-- fixed index 2
  "rotate(5deg) translate(70px)",
  "rotate(-5deg) translate(150px)"
];

  // ✅ State to detect mobile viewport
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="scroll-smooth relative">
      <div className="fixed left-0 w-full z-20 flex justify-center top-6 overflow-visible">
        <div
          className="
      w-full max-w-6xl flex justify-center items-center
      h-8 sm:h-10 md:h-12
      transform
      sm:transform-none
      origin-top
      sm:origin-center
      overflow-visible
    "
        >
          <GooeyNav items={navItems} />
        </div>
      </div>




      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen relative flex flex-col items-center justify-center bg-black overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#7cff67", "#b19eef", "#5227ff"]}
            amplitude={1.0}
            blend={0.5}
            speed={0.5}
          />
        </div>

        <div className="relative z-10 text-center px-4 text-white">
          <DecryptedText
            text="Get to know me in developer’s way"
            animateOn="view"
            revealDirection="center"
            speed={150}
            maxIterations={20}
            characters="ABCD1234!?"
            className="revealed text-white text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
            parentClassName="all-letters"
            encryptedClassName="encrypted"
          />
          <DecryptedText
            text="Personal life powered by code"
            animateOn="view"
            revealDirection="center"
            speed={150}
            maxIterations={20}
            characters="ABCD1234!?"
            className="revealed text-white text-2xl sm:text-4xl md:text-5xl font-semibold mt-4"
            parentClassName="all-letters"
            encryptedClassName="encrypted"
          />
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative w-full min-h-screen bg-black"
      >
        <div className="absolute inset-0 w-full h-full z-0">
          <Particles
            particleColors={['#ffffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={200}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Karl's Personal Info
          </h2>

          <div className="relative z-10 w-full flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              About Me
            </h2>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
              {[
                { label: "Name", value: "Karl Emanuel Carandang" },
                { label: "Nickname", value: "Sarge/Eman/Karlito" },
                { label: "In-Game Name", value: "GokouTheGamer" },
                { label: "Birthday", value: "February 12, 2005" },
                { label: "Email", value: "karlemanuelcarandang@cmdi.edu.ph / karlcarandang5@gmail.com" },
                { label: "Hobby", value: "Sports, Programming, Watching Anime/Movie" },
                { label: "Languages", value: "English, Tagalog, a bit of Japanese" },
                { label: "Favorites", value: "Coffee, Blue, Mt. Dew, Counter Strike" },
                // ⭐ Your new additions
                { label: "Personality", value: "Shy that's why I let my code introduce myself but friendly once comfortable" },
                { label: "Coding Mindset", value: "Loves exploring, experimenting, and debugging codes to learn more" },
                { label: "Mindset", value: "Still learning, still improving, still trying" },
                { label: "Goals", value: "Become a great developer someday" },
                { label: "Fun Fact", value: "Will fix bugs at 3AM but can't wake up at 7AM" },
                { label: "Helpful Side", value: "Always ready to assist to the best of my ability and share what I know" },
              ].map((item, index) => (
                <SpotlightCard
                  key={index}
                  className="w-full min-h-[100px] flex flex-col items-center justify-center p-4"
                  spotlightColor="rgba(0, 229, 255, 0.2)"
                >
                  <span className="text-sm opacity-70">{item.label}</span>
                  <span className="font-medium text-base mt-1">{item.value}</span>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="relative w-full min-h-screen bg-transparent flex items-center justify-center"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center w-full h-full">
          <LetterGlitch
            glitchColors={['#00ff00', '#00ffff', '#008000']}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-white text-center">
          <h2 className="text-3xl font-bold mb-6">
            My skills
          </h2>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
            {[
              { label: "Programming Languages", value: "Java, Python, SQL, HTML, CSS, JavaScript, C++" },
              { label: "Frameworks & Tools", value: "Android Studio, XAMPP, FastAPI, VS Code, JWT Auth, API Integration" },
              { label: "Database Management", value: "MySQL, SQLite (Room Database)" },
              { label: "Web Development Basics", value: "Next.js (Beginner Level)" },
              { label: "Prompt Engineer", value: "Efficient working capability with AI" },
              { label: "Technical Problem Solving", value: "Debugging, Optimizing workflows, Troubleshooting across multiple languages and tools" }
            ].map((item, index) => (
              <SpotlightCard
                key={index}
                className="w-full min-h-[100px] flex flex-col items-center justify-center p-4"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <span className="text-sm opacity-70">{item.label}</span>
                <span className="font-medium text-base mt-1">{item.value}</span>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen relative flex items-center justify-center overflow-hidden px-4"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center w-full h-full">
          <LetterGlitch
            glitchColors={['#00ff00', '#00ffff', '#008000']}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
          />
        </div>

        <div
          className="
    w-full flex flex-col md:flex-row 
    justify-center items-center md:items-center
    gap-6 md:gap-6
    mt-10
  "
        >
          {/* Folder (left side) */}
          <div
            className="w-full md:w-[40%] flex justify-center items-center mb-6 md:mb-0"
          >
            <Folder
              color="#5227FF"
              size={2}
              items={[
                "/AMSLogo.png",
                "/GMSLogo.png",
                "/GrainTrackLogo.png",
              ]}
            />
          </div>

          {/* Project Descriptions */}
          <div className="w-full md:w-1/2 max-w-xl text-left space-y-4">
            <h2 className="text-3xl font-bold mb-4 text-white tracking-wide text-center md:text-left">
              Projects
            </h2>

            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-300">GrainTrack</h3>
              <p className="text-sm mt-1 text-gray-200">
                A POS and Inventory Management Android app built using Java, XML, and SQLite.
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-300">
                Healthcare Appointment Scheduling
              </h3>
              <p className="text-sm mt-1 text-gray-200">
                A scheduling optimization system improving appointment flow.
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-300">
                Attendance Checker System
              </h3>
              <p className="text-sm mt-1 text-gray-200">
                Uses FastAPI + MySQL, with date-based attendance logging.
              </p>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-300">Banking System</h3>
              <p className="text-sm mt-1 text-gray-200">
                A Next.js banking system using JWT + MySQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waifus Section */}
      <section
        id="waifus"
        className="min-h-screen relative flex items-center justify-center overflow-hidden px-4"
      >
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={['#6a00ff', '#00d4ff', '#0088ff']}
            amplitude={1.0}
            blend={0.5}
            speed={0.5}
          />
        </div>

        <div className="relative z-10 flex justify-center items-center w-full">
          <BounceCards
            className="custom-bounceCards"
            images={waifuImages}
            containerWidth={isMobile ? 300 : 500}
            containerHeight={isMobile ? 150 : 250}
            animationDelay={1}
            animationStagger={0.08}
            easeType="elastic.out(1, 0.5)"
            transformStyles={waifuTransforms}
            enableHover={true}
          />
        </div>
      </section>
    </main>
  );
}
