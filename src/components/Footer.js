import { Link } from "react-router-dom";
import { FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import Logo from "../assets/Logo.png";

const links = [
  { name: "Home", href: "/" },
  { name: "ADA Store", href: "/ada-store" },
  { name: "Materials", href: "/materials" },
  { name: "ADA History", href: "/ada-history" },
  { name: "Alumni Hub", href: "/alumni-hub" },
];

export default function Footer() {
  return (
    <footer
      className="relative mt-16 text-[#F7F4F0]"
      style={{
        background: "linear-gradient(160deg, #3D1220 0%, #6E1F35 100%)",
      }}
    >
      {/* Signature hairline — wine to blue, ties EB maroon to the brand accent */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, #6E1F35 0%, #2F5D9E 55%, #5B85C0 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="ADA Hub"
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-bold text-base leading-none">ADA Hub</p>
              <p className="text-xs text-[#F7F4F0]/60 mt-1">
                AIESEC in Baku ADA
              </p>
            </div>
          </div>
          <p className="text-sm text-[#F7F4F0]/60 max-w-xs leading-relaxed">
            One home for members — track goals, browse the store, and stay up to
            date with EB Valyria.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5B85C0]">
            Quick links
          </p>
          <ul className="flex flex-col gap-2">
            {links.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-sm text-[#F7F4F0]/75 hover:text-[#F7F4F0] transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5B85C0]">
            Contact
          </p>
          <div className="flex flex-col gap-2 text-sm text-[#F7F4F0]/75">
            <a
              href="mailto:info@aiesec-ada.org"
              className="flex items-center gap-2 hover:text-[#F7F4F0] transition-colors"
            >
              <FaEnvelope className="text-[#5B85C0]" />
              info@aiesec-ada.org
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-[#F7F4F0] transition-colors"
            >
              <FaInstagram className="text-[#5B85C0]" />
              @aiesec.ada
            </a>
            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#5B85C0]" />
              Baku, Azerbaijan
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F7F4F0]/10">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#F7F4F0]/50">
          <p>© {new Date().getFullYear()} ADA Hub. All rights reserved.</p>
          <p>
            Made by{" "}
            <span className="text-[#5B85C0] font-semibold">Aqil Safarli</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
