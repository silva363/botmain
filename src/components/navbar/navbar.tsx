import Link from "next/link";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaPowerOff } from "react-icons/fa";

const Navbar = () => {
  const currentRoute = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { push } = useRouter();

  const handleLogout = () => {
    if (window.confirm("Tem certeza que você deseja sair?")) {
      localStorage.clear();
      push('/');
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div>
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <span className="nav-header-mobile">
          {currentRoute === "/dashboard/home" ? "Início" : ""}
          {currentRoute.includes("/dashboard/tokens/") ? "Tokens" : ""}
          {currentRoute.includes("/dashboard/seed-bots/") ? "Alimentação" : ""}
          {currentRoute.includes("/dashboard/old-trade-bots/") ? "Compra/Venda (Old)" : ""}
          {currentRoute.includes("/dashboard/trade-bots/") ? "Compra/Venda" : ""}
          {currentRoute.includes("/dashboard/distribution-bots/") ? "Distribuição" : ""}
          {currentRoute.includes("/dashboard/volume-bots/") ? "Volume" : ""}
        </span>
      </div>
      <ul className={`navList ${isMenuOpen ? 'open' : ''}`}>
        <li className="navItem">
          <Link href="/dashboard/home" className={`${currentRoute === "/dashboard/home" ? "active" : ""}`}>
            Início
          </Link>
        </li>
        {
          <>
            <li className="navItem">
              <Link href="/dashboard/tokens/list" className={`${currentRoute.includes("/dashboard/tokens/") ? "active" : ""}`}>
                Tokens
              </Link>
            </li>
            <hr style={{ margin: "10px 15px 10px -20px", border: "4px solid white" }} />
          </>
        }
        <li className="navItem">
          <Link href="/dashboard/seed-bots/list" className={`${currentRoute.includes("/dashboard/seed-bots/") ? "active" : ""}`}>
            Alimentação
          </Link>
        </li>
        <li className="navItem">
          <Link href="/dashboard/old-trade-bots/list" className={`${currentRoute.includes("/dashboard/old-trade-bots/") ? "active" : ""}`}>
            Compra/Venda (Old)
          </Link>
        </li>
        <li className="navItem">
          <Link href="/dashboard/trade-bots/list" className={`${currentRoute.includes("/dashboard/trade-bots/") ? "active" : ""}`}>
            Compra/Venda
          </Link>
        </li>
        {
          <>
            <li className="navItem">
              <Link href="/dashboard/distribution-bots/list" className={`${currentRoute.includes("/dashboard/distribution-bots/") ? "active" : ""}`}>
                Distribuição
              </Link>
            </li>
            <li className="navItem">
              <Link href="/dashboard/volume-bots/list" className={`${currentRoute.includes("/dashboard/volume-bots/") ? "active" : ""}`}>
                Volume
              </Link>
            </li>
          </>
        }
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FaPowerOff size={18} />
      </button>
    </nav>
  );
};

export default Navbar;
