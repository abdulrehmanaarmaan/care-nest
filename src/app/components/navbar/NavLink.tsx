import Link from 'next/link';
import React, { ComponentProps } from 'react';

type NavLinkProps = ComponentProps<typeof Link>

const NavLink = ({ href, children, ...rest }: NavLinkProps) => {
    return (
        <Link href={href} className='hover:text-teal-600 transition' {...rest}>{children}</Link>
    );
};

export default NavLink;