import React, { forwardRef } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import NextLink from "next/link";

const Link = forwardRef(({ children, to, ...rest }, ref) => {
    if (process.env.NEXT_PUBLIC_IS_NEXT === "yes") {
        return (
            <NextLink href={to} {...rest}>
                {children}
            </NextLink>
        );
    }

    return (
        <ReactRouterLink to={to} {...rest}>
            {children}
        </ReactRouterLink>
    );
});

export default Link;
