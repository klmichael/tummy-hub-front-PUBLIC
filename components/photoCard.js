import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  CardTitle } from "reactstrap";


function PhotoCard({ image, imageAlt, title, text, button, onClick, details }) {
  return (
    <Card style={{ margin: "10px", height: "100%"}} text="center" color="light">
      <CardImg src={image} top style={{ }} alt={imageAlt} />
      <CardBody>
        <CardTitle><b>{title}</b></CardTitle>
        <CardText>{text}</CardText>
        <CardText><em>{details}</em></CardText>
      </CardBody>
      <CardFooter className="text-center" >
        <Button color="success" outline onClick={onClick}>{button}</Button>
      </CardFooter>
    </Card>
  );
}

export default PhotoCard;