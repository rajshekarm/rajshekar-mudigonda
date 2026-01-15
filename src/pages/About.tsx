import { Link } from "react-router-dom"

const About = () => {
  return (
    <main className="h-[calc(100vh-64px)] flex font-sans bg-white">
      {/* Left Section */}
      <div className="w-1/2 bg-[#2F5D62]/10 relative">
        {/* Profile Card */}
       
        <div className="absolute right-[-72px] top-1/2 -translate-y-1/2 bg-[#faf9f7] w-[320px] shadow-2xl rounded-md p-8 text-center">

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

  <div className="mt-6">
    <a
      href="https://linkedin.com"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:border-[#2F5D62] hover:text-[#2F5D62] transition"
    >
      in
    </a>
  </div>
</div>

      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center px-24">
        <div className="max-w-lg">
          <h1 className="text-6xl font-bold mb-6 tracking-tight text-gray-900">
            Hello
          </h1>

          <p className="text-base text-gray-700 leading-relaxed mb-10">
            I completed my Master’s in Computer Science at Illinois Institute of
            Technology, Chicago. I am currently working as a Backend Developer
            Intern at Fashion AI, where I focus on building scalable and
            reliable backend systems.
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
    </main>
  )
}

export default About
