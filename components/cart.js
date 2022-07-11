import React, { useContext } from "react";
import AppContext from "./context";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Table} from "reactstrap";
import { useRouter } from "next/router";


function Cart() {
  let {cart,addItem,removeItem} = useContext(AppContext);
  let {items} = cart;
  const router = useRouter();
  
  //If the cart holds items, the Cart component will populate.
  //If the user is not already on the checkout page, a checkout button will be included in the final row.
  
  if(cart.items && items.length){
    var itemList = cart.items.map((item) => {
        if (item.quantity > 0) {
          return (
            <tr key={item.id}>
              <td><FontAwesomeIcon icon="fa-square-minus" onClick={() => removeItem(item)}/> {item.quantity} <FontAwesomeIcon icon="fa-square-plus" onClick={() => addItem(item, [])}/></td>
              <td>
                <b>{item.name}</b><br/>
                <em>from: {item.restaurant.name}</em><br/>
                {item.customerAllergies.length > 0 ? 
                <>CUSTOMER FOOD ALLERGIES: {item.customerAllergies.join(", ")}<br/></> : 
                <></>}
              </td>
              <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity) }</td>
            </tr>
          );
        }
      });

  return(
    <div style={{margin: "20px"}}>
      <h3>Your Order:</h3>
      <Table responsive>
        <thead>
        <tr>
          <th>Quantity</th>
          <th>Item</th>
          <th>Subtotal</th>
        </tr>
        </thead>
        <tbody>{itemList}</tbody>
        <tfoot>
          <tr>
          <td></td>
          <td></td>
          <td>
            <b>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cart.total)}</b><br/><br/>
            {router.route === "/checkout" ? <></> :
          <Link href="/checkout/"><Button color="success"><FontAwesomeIcon icon="fa-solid fa-utensils" color="white" size="lg"/>&nbsp;&nbsp;Checkout&nbsp;&nbsp;<FontAwesomeIcon icon="fa-solid fa-utensils" color="white" size="lg"/></Button></Link>  
        }
          </td>
          </tr>
        </tfoot>
        
      </Table>
    </div>
    );}
  else {
      return (<div></div>);
  }
}
export default Cart;
