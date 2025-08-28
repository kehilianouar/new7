"use client"

// React & Next
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Firebase
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/firebase/firebaseConfig"
import { getUserProfile } from "@/firebase/authActions"

// UI Components
import { Button } from "@/components/ui/button"
import { Search, Home, Film, Tv, Clock } from "lucide-react"
import { ShoppingCart, User, Package } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

const iconSize = "w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"

const navLinks = [
  { label: "الرئيسية", icon: Home, path: "/" },
  { label: "المكملات", icon: Package, path: "/categories/supplements" },
  { label: "الملابس", icon: Package, path: "/categories/clothing" },
  { label: "حسابي", icon: User, path: "/profile" },
]

export default function Navbar({ queryS }: { queryS?: string }) {
  const router = useRouter()
  const { getCartItemsCount } = useCart()

  // States
  const [showInput, setShowInput] = useState(Boolean(queryS));
  const [query, setQuery] = useState(queryS || '')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        const userProfile = await getUserProfile(firebaseUser.uid)
        setProfile(userProfile)
      } else {
        setUser(null)
        setProfile(null)
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Handle Focus on Input
  useEffect(() => {
    if (showInput && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [showInput])

  // Close Input When Clicked Outside
  useEffect(() => {
    const closeInput = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowInput(false)
      }
    }
    if (showInput) {
      setTimeout(() => window.addEventListener("click", closeInput), 100)
    }
    return () => window.removeEventListener("click", closeInput)
  }, [showInput])

  // Handle Search
  const handleSearch = () => {
    if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleSearchButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showInput) {
      handleSearch()
    } else {
      setShowInput(true)
    }
  }

  const renderAuthSection = (isMobile: boolean) => {
    if (isLoading) return null

    return (
      <div className="flex items-center gap-2">
        {/* Always show cart button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/cart")}
          className="relative"
        >
          <ShoppingCart size={16} />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {getCartItemsCount()}
            </span>
          )}
        </Button>

        {/* Admin button for admin users */}
        {profile?.role === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin")}
            className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-500/30"
          >
            مدير
          </Button>
        )}

        {user && (!profile || Object.keys(profile).length <= 2) ? (
          <Button variant="outline" onClick={() => router.push("/auth/complete-profile")}>
            اكمال البيانات
          </Button>
        ) : user && profile && Object.keys(profile).length > 2 ? (
          <Image
            src={profile.avatar || user.photoURL}
            alt="User Avatar"
            width={36}
            height={36}
            unoptimized
            className="w-[36px] h-[36px] rounded-full cursor-pointer"
            onClick={() => router.push("/profile")}
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/login")}
            className="bg-transparent"
          >
            تسجيل دخول
          </Button>
        )}
      </div>
    )
  }

  const renderDesktopLinks = () => {
    const links = [...navLinks];
    
    // Add admin link if user is admin
    if (profile?.role === 'admin') {
      links.push({ label: "لوحة التحكم", icon: Package, path: "/admin" });
    }
    
    return links.map((link, i) => (
      <li
        key={i}
        className="cursor-pointer hover:text-primary duration-200 text-sm xl:text-base"
        onClick={() => router.push(link.path)}
      >
        {link.label}
      </li>
    ));
  }

  const renderMobileLinks = () => {
    let links = navLinks.map((link, i) => (
      <li
        key={i}
        onClick={() => router.push(link.path)}
        className="w-12 h-12 flex flex-col items-center justify-center text-[10px] sm:text-xs hover:text-primary duration-200 cursor-pointer"
      >
        <link.icon className={iconSize} />
        <span>{link.label}</span>
      </li>
    ))

    // Add admin link if user is admin
    if (profile?.role === 'admin') {
      links = [
        ...links,
        <li
          key="admin"
          onClick={() => router.push("/admin")}
          className="w-12 h-12 flex flex-col items-center justify-center text-[10px] sm:text-xs hover:text-primary duration-200 cursor-pointer"
        >
          <Package className={iconSize} />
          <span>الإدارة</span>
        </li>
      ];
    }

    // Add cart to bottom navigation if user is logged in
    if (user && profile && Object.keys(profile).length > 2) {
      links.splice(Math.floor(links.length / 2), 0,
        <li
          key="cart"
          onClick={() => router.push("/cart")}
          className="w-12 h-12 flex flex-col items-center justify-center text-[10px] sm:text-xs hover:text-primary duration-200 cursor-pointer relative"
        >
          <ShoppingCart className={iconSize} />
          <span>السلة</span>
          {getCartItemsCount() > 0 && (
            <span className="absolute top-0 right-2 bg-primary text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {getCartItemsCount()}
            </span>
          )}
        </li>
      )
    }

    return links
  }

  return (
    <>
      {/* Desktop Navbar */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 hidden md:flex w-[95%] max-w-7xl h-15 px-6 justify-between items-center rounded-full border-2 backdrop-blur-xl bg-white/10 shadow-md"
      >
        <div className="flex items-center gap-2">
          {renderAuthSection(false)}
          {/* Search */}
          <div className="relative" ref={searchContainerRef}>
            <div
              className={`transition-all duration-300 overflow-hidden ${showInput ? "opacity-100 md:w-50 lg:w-80 xl:w-120" : "opacity-0 w-0"
                }`}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="أكتب هنا للبحث عن اي منتج"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus={true}
                className="w-full border-2 py-1 px-3 pr-10 rounded-full bg-white/10 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              className="absolute top-0 right-0"
              size="icon"
              variant="icon"
              onClick={handleSearchButtonClick}
            >
              <Search className={iconSize} />
            </Button>
          </div>
        </div>
        <ul className="flex items-center gap-5">{renderDesktopLinks()}</ul>
        <Image
          src="/images/gymdada.png"
          alt="logo"
          width={80}
          height={80}
          priority
          unoptimized
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </header>

      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed w-full px-2 h-13 bg-gradient-to-b from-black/80 to-transparent rounded-b-xl flex items-center justify-between z-50">
        <Image
          src="/images/gymdada.png"
          alt="logo"
          width={60}
          height={60}
          unoptimized
          onClick={() => router.push("/")}
        />
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="relative w-auto flex-1 mr-2" ref={searchContainerRef}>
            <div
              className={` transition-all duration-300 transform rounded-full backdrop-blur-md origin-left overflow-hidden ${showInput ? "scale-x-100 opacity-100 w-40" : "scale-x-0 opacity-0 w-0"
                }`}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="أكتب هنا للبحث عن اي منتج"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-9 border-2 py-1 px-3 pl-10 rounded-full bg-white/10 outline-none text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <Button
              className="absolute top-0 left-0"
              size="icon"
              variant="icon"
              onClick={handleSearchButtonClick}
            >
              <Search className={iconSize} />
            </Button>
          </div>
          {/* Show cart and user avatar in top navbar for mobile */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/cart")}
              className="relative min-w-0 p-1"
            >
              <ShoppingCart size={14} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {getCartItemsCount()}
                </span>
              )}
            </Button>
            
            {user && profile && Object.keys(profile).length > 2 && (
              <Image
                src={profile.avatar || user.photoURL}
                alt="User Avatar"
                width={28}
                height={28}
                unoptimized
                className="w-[28px] h-[28px] rounded-full cursor-pointer"
                onClick={() => router.push("/profile")}
              />
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-2 left-0 w-full px-4 z-50">
        <ul className="w-full h-13 backdrop-blur-md bg-white/10 rounded-full border-2 flex items-center justify-around">
          {renderMobileLinks()}
        </ul>
      </div>
    </>
  )
}
