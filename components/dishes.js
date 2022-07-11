import {useQuery, gql} from '@apollo/client';
import {useContext} from 'react';
import AppContext from "./context";
import PhotoCard from "./photoCard";
import {Card, CardBody, CardImg, CardTitle, CardText, Row, Col} from "reactstrap";
import Link from "next/link";


function Dishes({restId, dangerList, searchTerm}){
  const {addItem} = useContext(AppContext);
  const GET_RESTAURANT_DISHES = gql`
  query($id: ID!) {
    restaurant(id: $id) {
      id
      name
      description
      image {
        url
      }
      dishes {
        id
        name
        description
        price
        image {
          url
        }
        allergens {
          description
        }
      }
    }
  }
`;
  const { loading, error, data } = useQuery(
    GET_RESTAURANT_DISHES, 
    { variables: { id: restId} }
  );
    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR here</p>;
    if (!data) return <p>Not found</p>;
  
  let restaurant = {id: data.restaurant.id, name: data.restaurant.name, description: data.restaurant.description, image: {url: data.restaurant.image.url}};
  
  let tempDishes = data.restaurant.dishes;
  
  let dishes = tempDishes.map(dish => {
    let newDish = {
      ...dish, 
      allergens: dish.allergens.map((item) => item.description),
      flag: "safe",
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      }
    }
    return newDish;
   })


  function safetyCheck(dangers, dishesArray) {
    if (dangers.length === 0) {
      return dishesArray;
    }
    else {
      let flaggedDishes = dishesArray.map((dish) => dish);
      flaggedDishes.forEach((dish) => {
        dangers.forEach((danger) => {
          if (dish.allergens.includes(danger)) {
            dish.flag = "danger";
          }
        })
      })
      return flaggedDishes;
    }
  } 

  const safeDishes = safetyCheck(dangerList, dishes).filter(dish => dish.flag === "safe");

  const searchResult = safeDishes.filter((dish) => 
  { return dish.name.toLowerCase().includes(searchTerm) || dish.description.toLowerCase().includes(searchTerm)}) 
  || [];

  if (searchResult.length > 0){
    return (
      <><h4>Your menu from <em>{restaurant.name}</em>...</h4>
      <Row>
        {searchResult.map((dish) => { 
          return (
          <Col xs="12" sm="6" md="3" style={{ margin: "20px 0px", minWidth: "33%"}} key={dish.id}>
          <PhotoCard 
            image={
              `${dish.image.url}`
              }
            imageAlt="dish photo" 
            title={`${dish.name} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dish.price)}`}
            text={dish.description}
            details={`Allergens: ${dish.allergens.join(", ")}`}
            button={`Add to Cart`}
            onClick={()=> addItem(dish, dangerList)}
          />
          </Col>)
        })}
      </Row>
      </>
    )
  }  
    else{
      return (
      <>
        <div className="col" key={restaurant.id}>
          <Card style={{ margin: "10px"}} text="center" color="warning">
            <CardBody>
              <CardTitle><b>Bummer!</b></CardTitle>
              <CardText>No dishes at {restaurant.name} are allergen-free for you.<br />Please try <Link href="/"><a>one of our other delicious restaurants.</a></Link></CardText>
            </CardBody>
            <CardImg src={`https://kathrynmichael-restaurant-back.herokuapp.com/${restaurant.image.url}`} />
          </Card>
        </div>
      </>)
    }
}
export default Dishes;