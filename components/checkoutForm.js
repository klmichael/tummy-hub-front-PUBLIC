
import React, { useState, useContext } from "react";
import { FormGroup, Label, Input, Container, Form, Col, Row, Button } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "isomorphic-fetch";
import Cookies from "js-cookie";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CreditCard from "./creditCard";
import AppContext from "./context";


function CheckoutForm() {
  const [data, setData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    stripe_id: "",
  });
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const appContext = useContext(AppContext);
  const router = useRouter();

  //As user fills out the checkout form, state updates.
  function onChange(e) {
    const updateItem = (data[e.target.name] = e.target.value);
    setData({ ...data, updateItem });
  }

  function validate(name, address, city, state, zip) {
    const zipReg = /^\d{5}$/;
    if (name.length === 0 || 
        address.length === 0 ||
        city.length === 0 ||
        state.length === 0 ||
        zip.length === 0) 
        {
          setError("All fields are required");
          return false;
      }
    if (state.length !== 2) {
      setError("Please use your state's two character abbreviation.");
      return false;
    }
    console.log(zipReg.test(zip));
    //Reference: https://regexlib.com/Search.aspx?k=us+zip+code&c=-1&m=-1&ps=20&AspxAutoDetectCookieSupport=1
    if (zipReg.exec(zip) === null) {
      setError("Please enter your 5-digit ZIP-code.");
      return false;
    }
      return true;
  }

  async function submitOrder() {
    // event.preventDefault();
    if (validate(data.name, data.address, data.city, data.state, data.zip) === true) 
    {
      const API_URL = "YOUR_API_URL.com";
      const cardElement = elements.getElement(CardElement); 
      const token = await stripe.createToken(cardElement);
      console.log(token.token)
      if (token.token === undefined) {
        setError("Please fill out all credit card fields.")
      } else {
        const orderBody = {
          amount: (Number(Math.round(appContext.cart.total + "e2") + "e-2")),
          dishes: appContext.cart.items,
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          token: token.token.id,
        };
        const userToken = Cookies.get("token");
        const response = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: userToken && { Authorization: `Bearer ${userToken}` },
          body: JSON.stringify(orderBody),
        });
        if (!response.ok) {
          setError(response.statusText);
        } else {
          appContext.emptyCart();
          router.push("/success");
        }
      }
    }
  }

  return (
    <Container>
      <h3>Delivery and Payment:</h3>
      <Form>
        <FormGroup>
          <Label for="name">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="First Last"
            onChange={onChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="1234 Main St"
            onChange={onChange}
          />
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="city">
                City
              </Label>
              <Input
                id="city"
                name="city"
                placeholder="Chicago"
                onChange={onChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="state">
                State
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="IL"
                onChange={onChange}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="zip">
                5-digit ZIP
              </Label>
              <Input
                id="zip"
                name="zip"
                placeholder="12345"
                onChange={onChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <CreditCard data={data} stripeError={error} submitOrder={submitOrder} />
      </Form>
      
      <style jsx global>
        {`
          form {
            margin-bottom: 40px;
            padding-bottom: 40px;
            border-bottom: 3px solid #e6ebf1;
          }
          input,
          .StripeElement {
            display: block;
            background-color: #f8f9fa !important;
            margin: 10px 0 20px 0;
            max-width: 500px;
            padding: 10px 14px;
            font-size: 1em;
            font-family: "Source Code Pro", monospace;
            box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px,
              rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
            border: 0;
            outline: 0;
            border-radius: 4px;
            background: white;
          }
          input::placeholder {
            color: #aab7c4;
          }
          input:focus,
          .StripeElement--focus {
            box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px,
              rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
            -webkit-transition: all 150ms ease;
            transition: all 150ms ease;
          }
          .StripeElement.IdealBankElement,
          .StripeElement.PaymentRequestButton {
            padding: 0;
          }
        `}
      </style>
    </Container>
  );
}
export default CheckoutForm;