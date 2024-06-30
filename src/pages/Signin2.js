import React, { useState } from 'react';

import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import bg1 from '../assets/img/bg1.jpg';
import useToken from '../components/useToken';
import { loginRequest } from '../services/user';

export default function Signin2() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const { token, setToken } = useToken();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    const data = await loginRequest(phoneNumber, password);

    if (data.isError) {
      setIsAuthenticated(false);
      return;
    }
    setToken(data.data.token);
    navigate('/org/list');
  };
  return (
    <div className="page-sign d-block py-0">
      <Row className="g-0">
        <Col md="7" lg="5" xl="4" className="col-wrapper">
          <Card className="card-sign">
            <Card.Header>
              <Card.Title>Đăng Nhập</Card.Title>
              <Card.Text>
                Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Form method="get" action="/dashboard/finance">
                <div className="mb-4">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập số điện thoại của bạn"
                    onChange={e => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <Form.Label className="d-flex justify-content-between">
                    Mật khẩu
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <Button onClick={login} className="btn-sign">
                  Đăng Nhập
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-none d-lg-block">
          <img src={bg1} className="auth-img" alt="" />
        </Col>
      </Row>
    </div>
  );
}
