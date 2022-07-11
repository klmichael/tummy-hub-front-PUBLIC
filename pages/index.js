import { useState } from "react";
import {ApolloProvider} from '@apollo/client';
import RestaurantList from '../components/restaurantList';
import Cart from "../components/cart";
import { InputGroup, InputGroupAddon, Input } from "reactstrap";
import client from '../lib/client';


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
      <ApolloProvider client={client}>
        <div className="jumbotron bg-success text-white">
          <h1 className="display-4">Let's Eat!</h1>
          <p className="lead">Food allergies? No problem. We can help you find something delicious and safe to eat.<br />First, find a restaurant that interests you!</p>
          <InputGroup>
          <InputGroupAddon addonType="append"> Search </InputGroupAddon>
            <Input
                onChange={(e) =>setSearchTerm(e.target.value.toLocaleLowerCase())}
                value={searchTerm}
            />
          </InputGroup><br></br>
        </div>
        <RestaurantList searchTerm={searchTerm}/>
        <Cart></Cart>
      </ApolloProvider>
    );
  }

  export default Home;