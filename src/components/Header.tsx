"use client";
import { useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
export default function Header() {

const [mobileNavOpen, setMobileNavOpen] = useState(false);

const navLinks = [
{ name: 'About', href: '/about' },
{ name: 'Events', href: '/events' },
{ name: 'Gallery', href: '/gallery' },
{ name: 'Blogs', href: '/blogs' },
{ name: 'Forms', href: '/forms' },
{ name: 'Contact', href: '/contact' },
];

return (

<header className="bg-amber-800 text-amber-100 shadow-md sticky top-0 z-50">

<div className="w-full flex items-center justify-between py-4 relative">

{/* Left: CIKV Logo + Name */}


	<Link href="/" className="flex items-center space-x-4 flex-shrink-0 ml-5" onClick={() => setMobileNavOpen(false)}>

<SafeImage src="/assets/cikv_logo.jpeg" alt="CIKV Logo" width={48} height={48} className="h-12 w-auto rounded-full" />

<h1 className="text-xl font-semibold text-amber-100 hidden sm:block">

Centre for Indian Knowledge and Values (CIKV)

</h1>

</Link>



{/* Right: Desktop Navigation + VIPS Logo */}

<div className="hidden md:flex items-center space-x-6 flex-shrink-0 mr-5">

{/* Desktop Navigation */}

<nav className="flex space-x-6">

{navLinks.map((link) => (

<Link key={link.name} href={link.href} className="hover:text-white font-medium">

{link.name}

</Link>

))}

</nav>

{/* VIPS Logo */}

<div className="flex items-center pl-4 border-l border-amber-500">

<a href="https://vips.edu/" target="_blank" rel="noreferrer">

<SafeImage src="/assets/vips_logo.png" alt="VIPS Logo" width={48} height={48} className="h-12 w-auto" />

</a>

</div>

</div>



{/* Mobile menu button */}

<button

className="md:hidden text-amber-100 focus:outline-none mr-5"

onClick={() => setMobileNavOpen(!mobileNavOpen)}

aria-label="Toggle menu"

>

{mobileNavOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}

</button>

</div>



{/* Mobile Navigation Drawer (Colors updated) */}

{mobileNavOpen && (

<nav className="md:hidden bg-amber-800 shadow-inner absolute top-full left-0 w-full z-40">

<Link href="/" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Home</Link>

<Link href="/about" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">About Society</Link>

<Link href="/events" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Events</Link>

<Link href="/gallery" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Gallery</Link>

<Link href="/blogs" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Blogs</Link>

<Link href="/forms" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Forms</Link>

<Link href="/contact" onClick={() => setMobileNavOpen(false)} className="block px-6 py-3 text-amber-100 hover:bg-amber-800">Contact Us</Link>

<div className="px-6 py-4 border-t border-amber-500">

			<a href="https://vips.edu/" target="_blank" rel="noreferrer">

<SafeImage src="/assets/vips_logo.png" alt="VIPS Logo" width={40} height={40} className="h-10 w-auto mx-auto" />

</a>

</div>

</nav>

)}

</header>

);

}