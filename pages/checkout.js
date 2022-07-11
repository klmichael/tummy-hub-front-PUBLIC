import React, { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { Row, Col } from "reactstrap";
import CheckoutForm from "../components/checkoutForm";
import AppContext from "../components/context";
import Cart from "../components/cart";


function Checkout() {
  const {authentication, cart} = useContext(AppContext);
  
  // load stripe to inject into elements components
  const stripePromise = loadStripe(
    "pk_test_YOUR KEY HERE"
  );

  return ( 
    <>{cart.items.length === 0 ? 
    <div className="redirect">
    <h3>You haven't ordered yet!<br/>
    Please fill your cart before trying to check out.</h3>
    </div> : 
    <Row xs="1" sm="2" style={{margin: "20px"}}>
      <Col>
        <Cart/>
      </Col>
      {authentication === true ? 
      <Col>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements> 
      </Col>  : 
      <Col>
        <h3>Delivery and Payment:</h3>
        <h5>Please <Link href="/login"><a>login</a></Link> or <Link href="/register"><a>register</a></Link> to continue with this order...</h5>
        <style jsx>
          {`
            a, Link {
              color: blue;
              text-decoration: underline;
            }
            a:link {
              text-decoration: underline;
              color: blue;
            }
          `}
        </style>
      </Col> }
    </Row>}</>
  );
}
export default Checkout;
