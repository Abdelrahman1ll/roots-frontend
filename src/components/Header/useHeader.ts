import { AuthContext } from "../../context/AuthContext";
import { useGetCartQuery } from "../../redux/Cart/apiCart";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignupContext } from "../../context/SignupContext";

const countries = [
  { name: "Egypt", flag: "/eg.svg" },
  // { name: "Saudi", flag: "https://flagcdn.com/sa.svg" },
  // { name: "Morocco", flag: "https://flagcdn.com/ma.svg" },
  // { name: "Jordan", flag: "https://flagcdn.com/jo.svg" },
  // { name: "Kuwait", flag: "https://flagcdn.com/kw.svg" },
];
export default function useHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);
  const [nameInput, setNameInput] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);
  const navigate = useNavigate();
  const [isSearchLocal, setIsSearchLocal] = useState(false);

  useEffect(() => {
    const value = localStorage.getItem("isSearch") === "true";
    setIsSearchLocal(value);
  }, []);
  const { openSignup } = useContext(SignupContext);
  const { user, logout: handleLogout } = useContext(AuthContext);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // 👇 Click-outside to close the country dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutsideDesktop =
        !desktopDropdownRef.current ||
        !desktopDropdownRef.current.contains(event.target as Node);
      const isOutsideMobile =
        !mobileDropdownRef.current ||
        !mobileDropdownRef.current.contains(event.target as Node);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👇 تحميل القيمة من URL وتحديثها عند أي تغيير
  useEffect(() => {
    const nameFromUrl = searchParams.get("name") || "";
    setNameInput(nameFromUrl);
    initialized.current = true;
  }, [searchParams]);

  // 👇 تحديث URL مع debounce
  useEffect(() => {
    if (!initialized.current) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (nameInput.trim()) {
        params.set("name", nameInput.trim());
      } else {
        params.delete("name");
      }

      // 👇 فقط نحدث إذا كان هناك فرق فعلي
      const currentName = searchParams.get("name") || "";
      if (currentName !== nameInput.trim()) {
        setSearchParams(params, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [nameInput, setSearchParams, searchParams]);

  const { data: cart } = useGetCartQuery({}, { skip: user?.role !== "user" });

  const totalItems: number = cart?.carts?.items.length || 0;

  const toggleCountryDropdown = () => setIsOpen((prev) => !prev);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isSearch,
    setSearch,
    isOpen,
    setIsOpen,
    selected,
    setSelected,
    nameInput,
    setNameInput,
    handleLogout,
    user,
    totalItems,
    countries,
    openSignup,
    isSearchLocal,
    navigate,
    setIsSearchLocal,
    toggleCountryDropdown,
    desktopDropdownRef,
    mobileDropdownRef,
  };
}
