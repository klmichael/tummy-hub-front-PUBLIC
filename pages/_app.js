import { useEffect, useState } from "react";
import Head from "next/head";
import Cookie from "js-cookie"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSquareMinus, faSquarePlus, faUtensils, faWheatAwn, faCow, faEgg, faFish, faShrimp, faTree, faP, faS, faDoorOpen, faDoorClosed} from '@fortawesome/free-solid-svg-icons';
import AppContext from '../components/context';
import Layout from "../components/layout";
import '../styles/globals.css'

//Required to use these specific Font Awesome icons throughout the app.
library.add(faSquareMinus, faSquarePlus, faUtensils, faWheatAwn, faCow, faEgg, faFish, faShrimp, faTree, faP, faS, faDoorOpen, faDoorClosed);
config.autoAddCss = false;

const API_URL = "YOUR_API_URL.com";

function MyApp(props) {
  const [user, setUser] = useState(null);
  const [authentication, setAuthentication] = useState(false);
  const [cart, setCart] = useState({items: [], total: 0});
  const { Component, pageProps } = props;
  const token = Cookie.get("token");
  console.log("Token", token);
  console.log("User", user);
  console.log("Authentication", authentication);

  //user and authentication client functions
  const login = (user) => setUser(user);
  const logout = () => setUser(null);
  const authenticate = (boolean) => setAuthentication(boolean);
  
  //cart client functions

  function emptyCart() {
    setCart({items: [], total: 0});
  }
  
  function addItem(newItem, allergenList) {
    //First, get a handle on all items currently in the cart.
    let {items} = cart;
    let newCart = {};
    
    //Check if the new item's id is already in the existing items list. If so, alreadyInCart will be reset to true.
    let alreadyInCart = false;
    if (items.length > 0) {
      alreadyInCart = items.find(i => i.id === newItem.id);
    }
    //If brand new, add it with an initial quantity of 1 and adjust the total.
    if (!alreadyInCart) {
      let temp = JSON.parse(JSON.stringify(newItem));
      temp.quantity = 1;
      temp.customerAllergies = allergenList;
      newCart = {
        items: [...cart.items, temp],
        total: cart.total + newItem.price,
      }
      setCart(newCart);
    } else {
    //If existing, update the quantity of the existing item by 1 and adjust the total.
      newCart = {
        items: items.map((item) => {
          if (item.id === newItem.id) {
            let combinedAllergens = [...item.customerAllergies, ...allergenList];
            let dedupedAllergens = [...new Set(combinedAllergens)];
            return Object.assign(
              {}, 
              item, 
              {
                quantity: item.quantity + 1,
                customerAllergies: dedupedAllergens,
              }
            )
          } else {
            return item;
          }
        }),
        total: cart.total + newItem.price
      }
      setCart(newCart);
    }
  }

  function removeItem(unwantedItem) {
    //First, get a handle on all items currently in the cart.
    let { items } = cart;
    let newCart = {};

    //Then find the unwanted item in the cart so that we can check it's current quantity.
    let itemToUpdate = items.find((item) => item.id === unwantedItem.id);

    //If there's more than 1 of the item, we'll simply decrease the quantity.
    if (itemToUpdate.quantity > 1) {
      newCart = {
        items: items.map((item) => { 
          if (item.id === itemToUpdate.id) {
            return Object.assign({}, item, { quantity: item.quantity - 1 })
          } else {
            return item;
          }}),
        total: cart.total = unwantedItem.price,
      }
      setCart(newCart);
    } else {
      //Otherwise, if there is only 1 in the cart, we'll just remove the whole item.
      const index = items.findIndex((item) => item.id === itemToUpdate.id);
      items.splice(index, 1);
      newCart = {
        items: items,
        total: cart.total - unwantedItem.price,
      }
      setCart(newCart);
    }
  }

  //When app mounts, confirms if there is an existing valid token from Strapi. Manages state of user and authentication accordingly.
  useEffect(() => {if (token) {
    console.log(token);
    fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      // if res comes back not valid, token is not valid
      // delete the token and log the user out on client
      if (!res.ok) {
        logout();
        authenticate(false);
        Cookie.remove("token");
        return null;
      }
      const currentUser = await res.json();
      login(currentUser);
      authenticate(true);
      console.log(currentUser);
    });
  }
}, []);
   
  return (
    <AppContext.Provider value={{ user: user, login: login, logout: logout, authentication: authentication, authenticate: authenticate, cart: cart, addItem: addItem, removeItem: removeItem, emptyCart:emptyCart}}>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}
export default MyApp;