import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import NextLink from "next/link";

function Link({ href, children, ...rest }) {
    if (process.env.NEXT_PUBLIC_IS_NEXT === "yes") {
        return (
            <NextLink href={href} {...rest}>
                {children} 😊
            </NextLink>
        );
    }

    return (
        <ReactRouterLink to={href} {...rest}>
            {children}
        </ReactRouterLink>
    );
}

export default Link;
