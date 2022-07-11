import React, {useContext} from "react";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import AppContext from "../components/context";
import {logout} from "../lib/auth";


function AuthForm({ formName, formTitle, fieldDisabled, onChange, emailInputName, href, smallMemo, buttonDisabled, onClick, loading, error }) {
  const appContext = useContext(AppContext);
  return (
    <Container>
    {appContext.user !== null ? 
      <Row className="redirect">
        <p>Bon Appetit, {appContext.user.username}! Redirecting you to the homepage. If you are not redirected in 10 seconds, click <Link href="/"><a>here.</a></Link>&nbsp;Not {appContext.user.username}?&nbsp;
          <Link href="/">
            <a
              onClick={() => {
                logout();
                appContext.logout();
                appContext.authenticate(false);
              }}
            >Logout
            </a>
          </Link></p>
        </Row> : 
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <FontAwesomeIcon icon="fa-solid fa-door-open" color="white" className="icon" style={{margin: "10px", height: "80%", float: "left"}}/><h1>{formTitle}</h1>
            </div>
            <section className="wrapper">
              <Form>
                <fieldset disabled={fieldDisabled}>
                  {formName === "register" ? 
                  <FormGroup>
                    <Label>Username:</Label>
                    <Input
                      onChange={onChange}
                      type="text"
                      name="username"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup> 
                  : <></>}
                  <FormGroup>
                    <Label>Email:</Label>
                    <Input
                      onChange={onChange}
                      type="email"
                      name={emailInputName}
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>
                  <FormGroup style={{ marginBottom: 30 }}>
                    <Label>Password:</Label>
                    <Input
                      onChange={onChange}
                      type="password"
                      name="password"
                      style={{ height: 50, fontSize: "1.2em" }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <span>
                      <a href={href}>
                        <small>{smallMemo}</small>
                      </a>
                    </span>
                    <Button
                      style={{ float: "right", width: 120 }}
                      color="success"
                      disabled={buttonDisabled}
                      onClick={onClick}
                    >
                    {loading ? "Loading... " : "Submit"}
                    </Button>
                  </FormGroup>
                  <FormGroup>
                    <span>
                        <p style={{color: "red"}}><b>{error ? error : ""}</b></p>
                    </span>
                  </FormGroup>
                </fieldset>
              </Form>
            </section>
          </div>
        </Col>
      </Row>}
      <style jsx>
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #28a745;
            margin-bottom: 30px;
            border-radius-top: 6px;
            text-align: center;
            color: white;
          }
          .header h1 {
            padding-top: 30px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
        `}
      </style>
    </Container>
  );
}

export default AuthForm;