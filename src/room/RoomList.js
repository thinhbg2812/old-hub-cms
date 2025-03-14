import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../layouts/Header";
import {
  createRoomRequest,
  editRoomRequest,
  listRoomRequest,
} from "../services/room";

const DEFAULT_ROOM = {
  roomNumber: "",
  keypass: "",
  status: "active",
};

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [queryParams] = useSearchParams();
  const orgId = queryParams.get("orgId");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const navigate = useNavigate();
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");

  const [createRoomDialog, setCreateRoomDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(DEFAULT_ROOM);
  const [action, setAction] = useState("create");
  const [validated, setValidated] = useState(false);

  const submitRef = useRef(null);

  const closeCreateRoomDialog = async () => {
    setCreateRoomDialog(false);
    setSelectedRoom(DEFAULT_ROOM);
    setAction("create");
    await listRoom();
  };

  useEffect(() => {
    if (orgId === null) {
      navigate("/org/list");
    } else {
      listRoom();
    }
  }, [orgId]);

  const listRoom = async () => {
    const resp = await listRoomRequest(orgId, page, size);
    if (resp.isError) {
      setToastContent("Không thể liệt kê phòng của tổ chức");
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setRooms(resp.data.items);
    }
  };

  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity()) {
      if (action === "create") {
        await createRoom();
      } else {
        await editRoom();
      }
    }
  };

  const createRoom = async () => {
    const resp = await createRoomRequest(
      selectedRoom.roomNumber,
      selectedRoom.keypass,
      selectedRoom.status,
      orgId
    );
    if (resp.isError) {
      setToastContent("Không thể tạo phòng mới");
      setToastVariant("danger");
      setShowToast(true);
    }
    await closeCreateRoomDialog();
  };
  const editRoom = async () => {
    const resp = await editRoomRequest(
      selectedRoom.roomNumber,
      selectedRoom.keypass,
      selectedRoom.id,
      orgId,
      selectedRoom.status
    );
    if (resp.isError) {
      setToastContent("Không thể cập nhật phòng");
      setToastVariant("danger");
      setShowToast(true);
    }
    await closeCreateRoomDialog();
  };

  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container-fluid ">
          <div className="row mb-2">
            <div className="col-12 text-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setAction("create");
                  setCreateRoomDialog(true);
                }}
              >
                Thêm phòng
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Số phòng</th>
                    <th className="text-center">Trạng thái phòng</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room, index) => {
                    return (
                      <tr key={room.id}>
                        <td>{index}</td>
                        <td>{room.roomNumber}</td>
                        <td className="text-center">
                          {room.status ? "hoạt động" : "không hoạt động"}
                        </td>
                        <td className="d-flex flex-row justify-content-center">
                          <i
                            className="ri-edit-box-line p-1"
                            onClick={() => {
                              setAction("update");
                              setSelectedRoom({
                                ...room,
                                status: room.status ? "active" : "inactive",
                              });
                              setCreateRoomDialog(true);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                  {rooms.length <= 0 && (
                    <tr key="no-room" className="text-center">
                      <td colSpan={4}>Không có phòng nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toast
        delay={3000}
        autohide
        show={showToast}
        onClose={() => setShowToast(false)}
        className="position-fixed bottom-0 end-0 p-3"
        bg={toastVariant}
        style={{ zIndex: 2000 }}
      >
        <ToastHeader>Thông báo</ToastHeader>
        <ToastBody>{toastContent}</ToastBody>
      </Toast>
      <Modal
        show={createRoomDialog}
        onHide={closeCreateRoomDialog}
        backdrop="static"
      >
        <ModalHeader closeButton>
          {action === "create" && "Tạo phòng mới"}
          {action === "update" && "Cập nhật phòng"}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Số phòng:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => {
                    const newItem = {
                      roomNumber: e.target.value,
                    };
                    setSelectedRoom(room => ({
                      ...selectedRoom,
                      ...newItem,
                    }));
                  }}
                  value={selectedRoom.roomNumber}
                />
                <FormControl.Feedback type="invalid">
                  Số phòng là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Mã khóa phòng:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => {
                    const newItem = {
                      keypass: e.target.value,
                    };
                    setSelectedRoom(room => ({
                      ...selectedRoom,
                      ...newItem,
                    }));
                  }}
                  value={selectedRoom.keypass}
                />
                <FormControl.Feedback type="invalid">
                  Mã khóa là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <Col>
                <label htmlFor="status" className="form-label">
                  Trạng thái:
                </label>
                <select
                  id="status"
                  className="form-select"
                  onChange={e => {
                    const newItem = {
                      status: e.target.value,
                    };
                    setSelectedRoom(room => ({
                      ...selectedRoom,
                      ...newItem,
                    }));
                  }}
                  value={selectedRoom.status}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </Col>
            </Row>
            <div className="d-flex flex-row justify-content-center mt-3">
              <button
                ref={submitRef}
                type="submit"
                className="btn btn-outline d-none"
              >
                Gửi
              </button>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              submitRef.current?.click();
            }}
          >
            {action === "create" && "Tạo"} {action === "update" && "Cập nhật"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeCreateRoomDialog}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default RoomManagement;
