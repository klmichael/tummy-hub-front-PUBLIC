import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import { Button } from "reactstrap";

function CreditCard(props) {
  return (
    <div>
      <div>
        <label htmlFor="card-element">Credit or debit card & billing ZIP</label>
        <div>
          <fieldset style={{ border: "none" }}>
            <div className="form-row">
              <div id="card-element" style={{ width: "100%" }}>
                <CardElement
                  options={{
                    style: { width: "100%", base: { fontSize: "18px" } },
                  }}
                />
              </div>
              <br />
              <div className="order-button-wrapper">
                <Button onClick={props.submitOrder} color="success">Confirm order</Button>
              </div>
              {props.stripeError ? (
                <div style={{color: "red"}}><b>{props.stripeError.toString()}</b></div>
              ) : null}
              <div id="card-errors" role="alert" />
            </div>
          </fieldset>
        </div>
      </div>
      <style jsx>
        {`
          .order-button-wrapper {
            display: flex;
            width: 100%;
            align-items: flex-end;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
}
export default CreditCard;