import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormSelect,
  Row,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { listOrderRequest } from "../../services/order";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import PaginationComp from "../Pagination";
import moment from "moment";

const OrderManagement = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [orderCode, setOrderCode] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    listOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const listOrder = async () => {
    const resp = await listOrderRequest({
      orderCode: orderCode,
      pageIndex: pageIndex,
      pageSize: pageSize,
      senderPhone: senderPhone,
      receiverPhone: receiverPhone,
    });
    if (resp.isError) {
      toast.error("Không thể lấy danh sách đơn hàng");
      return;
    }
    setOrders(resp.data.items);
    setTotal(resp.data.total);
  };
  const handlePaginationCallback = async (size, offset, index) => {
    setPageSize(size);
    setPageIndex(index);
  };
  return (
    <React.Fragment>
      <div className="main main-app p-3 p-lg-4">
        <div className="d-flex flex-column justify-content-between mb-4 gap-3">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="/org/list">Quản lý đơn hàng</Link>
              </li>
              <li
                className="breadcrumb-item active border-0"
                aria-current="page"
              >
                Quản lý đơn hàng
              </li>
            </ol>
            <h4 className="main-title mb-0">Danh sách đơn hàng</h4>
          </div>
          <Container fluid>
            <Row>
              <Col md={2}>Mã đơn hàng:</Col>
              <Col md={3}>
                <FormControl
                  type="text"
                  onChange={e => setOrderCode(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={2}>Số điện thoại người nhận:</Col>
              <Col md={3}>
                <FormControl
                  type="text"
                  onChange={e => setReceiverPhone(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={2}>Số điện thoại shiper:</Col>
              <Col md={3}>
                <FormControl
                  type="text"
                  onChange={e => setSenderPhone(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (pageIndex !== 0) {
                      setPageIndex(0);
                    } else {
                      listOrder();
                    }
                  }}
                >
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6} className="d-flex flex-row">
                <div className="me-1 align-self-center">
                  Số bản ghi trong trang
                </div>
                <div>
                  <FormSelect
                    value={pageSize}
                    onChange={e => setPageSize(e.target.value)}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </FormSelect>
                </div>
              </Col>
              <Col md={6} className=" fw-bold text-end">
                Tổng số bản ghi: {total}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Mã đơn</th>
                      <th>Loại đơn</th>
                      <th>Số điện thoại người nhận</th>
                      <th>Số điện thoại shiper</th>
                      <th>Thành tiền (VND)</th>
                      <th>Trạng thái thanh toán</th>
                      <th>Trạng thái chuyển phát</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => {
                      return (
                        <tr key={order.id}>
                          <td>{idx + 1}</td>
                          <td>{order.orderCode}</td>
                          <td>{order.orderType}</td>
                          <td>{order.receiverPhone}</td>
                          <td>{order.user?.phoneNumber}</td>
                          <td>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(order.cost)}
                          </td>
                          <td>
                            {order.paymentStatus ? "Thành công" : "Đang chờ"}
                          </td>
                          <td>
                            {order.deliveryStatus ? "Thành công" : "Đang chờ"}
                          </td>
                          <td>
                            {moment(order.createdAt).format("DD/MM/YYYY")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <PaginationComp
                  total={total}
                  pageSize={pageSize}
                  callback={handlePaginationCallback}
                  offset={pageIndex}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </React.Fragment>
  );
};

export default OrderManagement;
