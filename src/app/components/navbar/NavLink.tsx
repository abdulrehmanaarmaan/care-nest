import Link from 'next/link';
import React, { ComponentProps } from 'react';

type NavLinkProps = ComponentProps<typeof Link>

const NavLink = ({ href, children }: NavLinkProps) => {
    return (
        <Link href={href} className='text-sm font-bold text-slate-700 transition hover:text-teal-600'>{children}</Link>
    );
};

export default NavLink;