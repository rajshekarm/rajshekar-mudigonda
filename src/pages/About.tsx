import { Link } from "react-router-dom"
// You might need to install 'lucide-react' or use an SVG for the arrow
// npm install lucide-react
import { ArrowDown } from "lucide-react" 



const About = () => {
  return (
    // Changed main to min-h-screen and flex-col to allow scrolling
    <main className="min-h-screen flex flex-col font-sans bg-white">
      
      {/* --- SECTION 1: HERO (The existing split layout) --- */}
      {/* Kept h-[calc(100vh-64px)] so it fills the initial view */}
      <section className="h-[calc(100vh-64px)] flex relative">
        
        {/* Left Section */}
        <div className="w-1/2 bg-[#2F5D62]/10 relative">
          
          {/* Profile Card - Kept exactly as is */}
          <div className="absolute right-[-72px] top-1/2 -translate-y-1/2 bg-[#faf9f7] w-[320px] shadow-2xl rounded-md p-8 text-center z-10">
            {/* Image */}
            <div className="w-42 h-42 rounded-full overflow-hidden mx-auto mb-8">
              <img
                src="/profile.png"
                alt="Profile"
                className="mt-2  w-48 h-48 object-cover scale-110 object-[50%_20%] "
              />
            </div>

            {/* Name */}
            <h2 className="text-xl font-semibold leading-tight text-gray-900">
              Rajashekar
              <br />
              Mudigonda
            </h2>

            <div className="w-8 h-[2px] bg-[#2F5D62] mx-auto my-4" />

            <p className="text-xs tracking-[0.3em] text-gray-600">
              BACKEND ENGINEER
            </p>

            <div className="mt-6 flex justify-center gap-4">
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/rajshekarmudigonda/"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-[#2F5D62] hover:text-[#2F5D62] transition"
  >
    <span className="font-bold pb-1">in</span>
  </a>

  {/* GitHub - Add your username below */}
  <a
    href="https://github.com/rajshekarm" 
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-[#2F5D62] hover:text-[#2F5D62] transition"
  >
    {/* Simple GitHub SVG Icon */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  </a>
</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex items-center px-24 pl-32"> {/* Increased left padding slightly to clear the card */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 tracking-tight text-gray-900">
              Hi, I'm Rajashekar.
            </h1>

             <p className="text-base text-gray-700 leading-relaxed mb-4">
                I worked as a Software Engineer on the EMS team at Eze Software, where I built and optimized high-performance trading systems capable of processing massive order volumes with ultra-low latency. My core strengths include distributed systems, streaming pipelines, and API design.
              </p>

              <p className="text-base text-gray-700 leading-relaxed mb-10">
                I recently completed my Master’s degree in Computer Science from Illinois Institute of Technology, Chicago. Currently, I’m a Backend Developer Intern in the fashion e-commerce industry, building scalable backend services and developing features for Generative AI–driven applications.
              </p>


            <div className="flex gap-4">
              <Link
                to="/resume"
                className="px-6 py-3 rounded-full bg-[#3576c0] text-white font-medium hover:bg-[#042030] transition"
              >
                Resume
              </Link>

              <Link
                to="/projects"
                className="px-6 py-3 rounded-full border border-gray-800 font-medium hover:bg-gray-100 transition"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-400">
             <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
             <ArrowDown className="w-4 h-4 mx-auto mt-1" />
        </div>
      </section>


      {/* --- SECTION 2: BIO / EXPERIENCE (The new part) --- */}
      <section className="bg-white py-24 px-8 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#2F5D62] mb-6">
                My Journey
            </h3>
            <p className="text-xl text-gray-800 leading-loose font-light">
                Over the past few years, I’ve had the chance to work on cloud infrastructure, secure data systems, and full-stack platforms mainly using <span className="font-semibold">C#</span>, <span className="font-semibold">.NET</span>, <span className="font-semibold">React</span>, <span className="font-semibold">Azure</span>, <span className="font-semibold">AWS</span> and occasionally <span className="font-semibold">Python</span> or <span className="font-semibold">FastAPI</span> depending on the project.
            </p>
            <p className="text-xl text-gray-800 leading-loose font-light mt-6">
                I’ve worked across different environments: a high-paced startup culture at <span className="font-semibold">Fashion AI</span>, and enterprise-scale systems at <span className="font-semibold">SS&C Eze</span>.
            </p>
        </div>
      </section>

    </main>
  )
}



export default About