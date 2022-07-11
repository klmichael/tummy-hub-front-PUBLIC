import { useQuery, gql } from '@apollo/client';
import {Container, Row, Col} from 'reactstrap';
import Link from 'next/link';
import PhotoCard from './photoCard';
import 'bootstrap/dist/css/bootstrap.min.css';


function RestaurantList(props) {
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        id
        name
        description
        image {
          url
        }
      }
    }
  `;

  //Initially, all restaurants are read from Strapi. If the fetch is slow, throws and arror or finds no restaurants, a message will render to alert the user.
  const { loading, error, data } = useQuery(GET_RESTAURANTS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>ERROR</p>
    if (!data) return <p>Not found</p>;

  //Otherwise if data is sucessfully fetched, the below functions will run and UI will render.
  
  //The user may search for specific restaurants. If so, the restaurant list is re-rendered to only show the Strapi restaurants that match the search criteria.
  const searchResult = data.restaurants.filter((res) => 
    { return res.name.toLowerCase().includes(props.searchTerm)}) 
    || [];

  if (searchResult.length > 0) {
    const restaurantList = searchResult.map((item) => (
      <Col xs="12" sm="6" md="3" key={item.id} style={{ margin: "20px 0px", minWidth: "33%" }}>
        <PhotoCard 
          image={
            `${item.image.url}`
            }
          imageAlt="restaurant photo" 
          title={item.name} 
          text={item.description}
          button={<Link href={`/restaurant/${item.id}`}>Eat Here</Link>}
        />
      </Col>  
    ))

    return (
      <Container>
        <Row>{restaurantList}</Row>
      </Container>
    )
  } else {
    return <h5> Sorry! No restaurants match your search criteria. Please try a different search. </h5>
  }
}
export default RestaurantList