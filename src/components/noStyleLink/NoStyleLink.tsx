import { FC, ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";

interface NoStyleLinkProps extends LinkProps {
    children: ReactNode;
  }

  const NoStyleLink: FC<NoStyleLinkProps> = ({ children, to, ...props }) => {
    return (
      <Link to={to} style={{ textDecoration: 'none' }} {...props}>
        {children}
      </Link>
    );
  };

export default NoStyleLink