import {useRouter} from 'next/router'
import client from '../../lib/client';
import Dishes from '../../components/dishes';
import { useState } from "react";
import {ApolloProvider} from '@apollo/client';
import Cart from "../../components/cart";
import { Button, ButtonToolbar,  Container, InputGroup, InputGroupAddon, Input } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//Reference: https://www.youtube.com/watch?v=RDcW_0iB5UE
export default function Restaurant() {
  const router = useRouter();
  const {id} = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [dangerList, setDangerList] = useState([]);
  const [buttonColor, setButtonColor] = useState({dairy:"success", egg:"success", fish:"success", shellfish:"success", tree_nut:"success", peanut:"success", wheat:"success", soy:"success", })
  const allergenButtons = [
    {value: "dairy", icon:"fa-solid fa-cow", caption: "Dairy", color: buttonColor.dairy},
    {value: "egg", icon:"fa-solid fa-egg", caption: "Egg", color: buttonColor.egg},
    {value: "fish", icon:"fa-solid fa-fish", caption: "Fish", color: buttonColor.fish},
    {value: "shellfish", icon:"fa-solid fa-shrimp", caption: "Shellfish", color: buttonColor.shellfish},
    {value: "tree_nut", icon:"fa-solid fa-tree", caption: "Treenut", color: buttonColor.tree_nut},
    {value: "peanut", icon:"fa-solid fa-p", caption: "Peanut", color: buttonColor.peanut},
    {value: "wheat", icon:"fa-solid fa-wheat-awn", caption: "Wheat", color: buttonColor.wheat},
    {value: "soy", icon: "fa-solid fa-s", caption: "Soy", color: buttonColor.soy}
  ];

  function updateDangers( allergen ) {
    let newColor = buttonColor[allergen] === "success" ? "muted" : "success" ;
    let newButtonColor = {...buttonColor, [allergen]: newColor };
    setButtonColor(newButtonColor);
    if (dangerList.includes(allergen)) {
        let newList = dangerList.filter(danger => danger !== allergen);
        setDangerList(newList);
      } else if (dangerList.length === 0) {
        setDangerList([allergen]);
      } else {
        setDangerList([...dangerList, allergen]);
      }
  }

  return (
      <ApolloProvider client={client}>
      <div className="jumbotron bg-muted text-dark">
          <div><p>Use these buttons to add and remove allergens from the menu.<br/>Green means good to go!  Allergens in green are included.  <b>Allergens in grey are excluded.</b></p>
          <ButtonToolbar>
            {allergenButtons.map((item, index) => {
              return (
                <Button color={item.color} style={{width: "90px", height: "80px", margin: "10px", color: "white"}} value={item.value} id={item.value} key={index} onClick={(e) => updateDangers(e.target.value)}>
                  <FontAwesomeIcon icon={item.icon} color="white" size="lg"/><br/>
                  {item.caption}
                </Button> 
              )
            })}
          </ButtonToolbar>
          <br/><p>Search for dishes by keyword in name or description.</p>
          <InputGroup>
          <InputGroupAddon addonType="append"> Search </InputGroupAddon>
            <Input
                onChange={(e) =>setSearchTerm(e.target.value.toLocaleLowerCase())}
                value={searchTerm}
            />
          </InputGroup>
          </div>
        </div>
      <div>
        <Container>
            <Dishes restId={id} dangerList={dangerList} searchTerm={searchTerm}></Dishes>
        </Container>
        <Cart></Cart>
      </div>
    </ApolloProvider>
  )
}