import { Link, useSearchParams } from "react-router-dom";
import Header from "../layouts/Header";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toast,
  ToastBody,
  ToastContainer,
  ToastHeader,
} from "react-bootstrap";
import {
  createGamesRequest,
  getActiveGameRequest,
  listWinnerRequest,
  updateGamesStatusRequest,
} from "../services/games";
import lodash from "lodash";
import moment from "moment/moment";
import PaginationComp from "../components/Pagination";

const GamesManagement = () => {
  const [queryParams] = useSearchParams();
  const deviceId = queryParams.get("deviceId");
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");

  const [showNewGames, setShowNewGames] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentGames, setCurrentGames] = useState(null);
  const [newGames, setNewGames] = useState({
    deviceId: deviceId,
  });
  const [winners, setWinners] = useState([]);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);

  const closeNewGamesDialog = () => {
    setNewGames({
      deviceId: deviceId,
    });
    setShowNewGames(false);
  };
  const closeConfirmDialog = () => {
    setShowConfirm(false);
    getCurrentGame();
  };

  useEffect(() => {
    if (deviceId) {
      getCurrentGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);
  useEffect(() => {
    if (currentGames) {
      listWinner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGames, index.size]);

  const listWinner = async () => {
    const resp = await listWinnerRequest(currentGames?.id ?? "", index, size);
    if (resp.isError) {
      setToastContent("Không thể lấy thông tin người thắng giải");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    setWinners(resp.data.items);
    setTotal(resp.data.total);
  };

  const getCurrentGame = async () => {
    const resp = await getActiveGameRequest(deviceId);
    if (resp.isError) {
      setToastContent("Không thể lấy thông tin games");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    if (!lodash.isEmpty(resp.data)) {
      setCurrentGames(resp.data);
    }
  };
  const createGames = async () => {
    const resp = await createGamesRequest(newGames);
    if (resp.isError) {
      setToastContent("Không thể tạo mới games");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    getCurrentGame();
    closeNewGamesDialog();
  };
  const updateGamesStatus = async status => {
    if (lodash.isEmpty(currentGames)) {
      return;
    }
    const resp = await updateGamesStatusRequest(currentGames.id, status);
    if (resp.isError) {
      setToastContent("Không thể cập nhật trạng thái games");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeConfirmDialog();
  };
  const handlePaginationCallback = async (pageSize, offset, pageIndex) => {
    setSize(pageSize);
    setIndex(pageIndex);
  };
  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="d-flex flex-column justify-content-between mb-4 gap-3">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="/org/list">Quản lý tổ chức</Link>
              </li>
              <li className="breadcrumb-item active border-0">
                <Link to="/device/list">Quản lý thiết bị</Link>
              </li>
              <li
                className="breadcrumb-item active border-0"
                aria-current="page"
              >
                Quản lý Games
              </li>
            </ol>
            <h4 className="main-title">Quản lý Games</h4>
            <Button
              variant="success"
              className="mb-2"
              onClick={() => {
                setShowNewGames(true);
              }}
            >
              Tạo mới games
            </Button>
            <Form>
              <FormGroup>
                <FormLabel>Nhà tài trợ:</FormLabel>
                <FormControl
                  type="text"
                  value={currentGames?.sponsorName}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Mã khuyến mại:</FormLabel>
                <FormControl type="text" value={currentGames?.code} readOnly />
              </FormGroup>
              <FormGroup>
                <FormLabel>Tên gói quà:</FormLabel>
                <FormControl
                  type="text"
                  value={currentGames?.giftName}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Giá trị:</FormLabel>
                <FormControl
                  type="number"
                  value={currentGames?.giftValue}
                  readOnly
                />
              </FormGroup>
              <FormGroup className="mt-2">
                {!lodash.isEmpty(currentGames) && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowConfirm(true);
                    }}
                  >
                    {!currentGames?.status && <>Chạy chương trình</>}
                    {currentGames?.status && <>Tắt chương trình</>}
                  </Button>
                )}
              </FormGroup>
            </Form>
            <div className="mt-2 fw-bold">Danh sách mã đã chạy:</div>
            <div className="mt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Nhà tài trợ</th>
                    <th className="text-center">Mã khuyến mại</th>
                    <th className="text-center">Tên gói quà</th>
                    <th className="text-center">Tên người trúng</th>
                    <th className="text-center">Số điện thoại</th>
                    <th className="text-center">Thời gian tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map(winner => (
                    <tr key={winner.id}>
                      <td className="text-center">
                        {winner.game?.sponsorName}
                      </td>
                      <td className="text-center">{winner.game?.code}</td>
                      <td className="text-center">{winner.game?.giftName}</td>
                      <td className="text-center">{winner.winner?.fullName}</td>
                      <td className="text-center">
                        {winner.winner?.phoneNumber}
                      </td>
                      <td className="text-center">
                        {moment(winner.createdAt).format("hh:mm DD-MM-YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row align-items-center">
              <div className="col-12 align-self-center">
                <PaginationComp
                  total={total}
                  pageSize={size}
                  callback={handlePaginationCallback}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showNewGames}
        onHide={closeNewGamesDialog}
        backdrop="static"
        size="lg"
      >
        <ModalHeader closeButton>Tạo mới games</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormLabel>Nhà tài trợ:</FormLabel>
              <FormControl
                type="text"
                onChange={e => {
                  setNewGames({
                    ...newGames,
                    sponsorName: e.target.value,
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Mã khuyến mại:</FormLabel>
              <FormControl
                type="text"
                onChange={e => {
                  setNewGames({
                    ...newGames,
                    code: e.target.value,
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Tên gói quà:</FormLabel>
              <FormControl
                type="text"
                onChange={e => {
                  setNewGames({
                    ...newGames,
                    giftName: e.target.value,
                  });
                }}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Giá trị:</FormLabel>
              <FormControl
                type="number"
                onChange={e => {
                  setNewGames({
                    ...newGames,
                    giftValue: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              createGames();
            }}
          >
            Tạo mới
          </Button>
          <Button variant="secondary" onClick={() => closeNewGamesDialog()}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        show={showConfirm}
        onHide={closeConfirmDialog}
        backdrop="static"
        size="lg"
      >
        <ModalBody>
          Games này sẽ bị {currentGames?.status ? "tắt" : "bật"} trên thiết bị?
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              updateGamesStatus(!currentGames?.status);
            }}
          >
            Đồng ý
          </Button>
          <Button variant="secondary" onClick={() => closeConfirmDialog()}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer position="top-end">
        <Toast
          delay={3000}
          autohide
          show={showToast}
          onClose={() => setShowToast(false)}
          className="position-fixed bottom-0 end-0 p-3"
          bg={toastVariant}
          style={{ zIndex: 2000 }}
        >
          <ToastHeader>Thông Báo</ToastHeader>
          <ToastBody>{toastContent}</ToastBody>
        </Toast>
      </ToastContainer>
    </React.Fragment>
  );
};

export default GamesManagement;
