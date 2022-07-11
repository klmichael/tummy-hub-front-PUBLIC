/* /components/Layout.js */
import React, { useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import { Badge } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppContext from "./context";
import { logout } from "../lib/auth";


const Layout = (props) => {
const {user, logout:uiLogout, cart, authenticate} = useContext(AppContext);
  return (
    <div>
      <Head>
        <title>Tummy Hub</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
        <script src="https://js.stripe.com/v3" />
      </Head>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
          <div className="navbar-nav">
            <Link href="/">
              <a className="navbar-brand">Tummy Hub</a>
            </Link>
            <Link href="/about">
                  <a className="nav-link nav-item">About</a>
            </Link>
            <Link href="/contact">
                  <a className="nav-link nav-item">Contact</a>
            </Link>
            </div>
            <div className="navbar-nav">
              {user ? (
                <span className="navbar-text">Hi, {user.username}!&nbsp;&nbsp;</span>
              ) : (
                <Link href="/register">
                  <a className="nav-link"> Sign up</a>
                </Link>
              )}
              { <Link href="/checkout">
                <a className="nav-link">
                    <FontAwesomeIcon icon="fa-solid fa-utensils" color="white" size="lg"/>&nbsp;&nbsp;
                    <Badge color="success">{cart.items.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0)}</Badge>
                </a>
              </Link> }
              {user ? (
                <Link href="/">
                  <a
                    className="nav-link"
                    onClick={() => {
                      logout();
                      uiLogout();
                      authenticate(false);
                    }}
                  >
                    Logout
                  </a>
                </Link>
              ) : (
                <Link href="/login">
                  <a className="nav-link">Sign in</a>
                </Link>
              )}
              
            </div>
            
          </div>
        </nav>
      </header>
      <div>{props.children}</div>
    </div>
    
  );
};

export default Layout;