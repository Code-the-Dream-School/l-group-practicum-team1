import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { label: "Home", to: "/" },
    { label: "Tournaments", to: "/tournaments" },
    { label: "Users", to: "/users" },
  ];

  return (
    <nav className="flex gap-10 py-6 text-lg">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? "font-bold text-black" : "text-gray-700 hover:text-black"
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
