import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';


const NotFound = () => {
  return (
    <Container className="not-found-page text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-1">404</h1>
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          <Link to="/home">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
