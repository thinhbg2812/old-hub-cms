import React, { useEffect, useRef, useState } from "react";
import Header from "../layouts/Header";
import {
  createDeviceRequest,
  getDeviceRequest,
  listOrgDeviceRequest,
  updateDeviceRequest,
} from "../services/device";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  ToastContainer,
  ToastHeader,
} from "react-bootstrap";
import { checkNoSpecialCharacters } from "../utils/string";

const DEFAULT_DEVICE = {
  deviceId: "",
  deviceName: "",
  password: "",
};

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [queryParams] = useSearchParams();
  const orgId = queryParams.get("orgId");
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(DEFAULT_DEVICE);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState("create");

  const submitRef = useRef(null);

  const closeModal = async () => {
    setShowModal(false);
    setSelectedDevice(DEFAULT_DEVICE);
    await listDevice();
  };

  useEffect(() => {
    if (orgId === null) {
      navigate("/org/list");
    } else {
      listDevice();
    }
  }, [orgId]);

  const listDevice = async () => {
    const resp = await listOrgDeviceRequest(orgId);
    if (resp.isError) {
      setToastContent("Không thể lấy thiết bị của tổ chức");
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setDevices(resp.data.items);
    }
  };
  const createDevice = async () => {
    const resp = await createDeviceRequest(
      selectedDevice.deviceId,
      selectedDevice.deviceName,
      orgId,
      selectedDevice.password
    );
    if (resp.isError) {
      setToastContent("Không thể tạo thiết bị mới");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  // const getDevice = async (id) => {
  //   const resp = await getDeviceRequest(id, orgId);
  //   if (resp.isError) {
  //     setToastContent("Không thể lấy thông tin thiết bị");
  //     setToastVariant("danger");
  //     setShowToast(true);
  //   } else {
  //     setSelectedDevice(resp.data);
  //   }
  // };

  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      //   return;
    }
    event.preventDefault();
    setValidated(true);

    if (!checkNoSpecialCharacters(selectedDevice.deviceId)) {
      setToastContent("Mã thiết bị không được chứa ký tự đặc biệt");
      setToastVariant("danger");
      setShowToast(true);
    } else if (form.checkValidity()) {
      if (action === "create") {
        await createDevice();
      } else {
        await updateDevice();
      }
      closeModal();
    }
  };
  const updateDevice = async () => {
    const resp = await updateDeviceRequest(
      selectedDevice.id,
      selectedDevice.deviceName,
      orgId,
      selectedDevice.password
    );
    if (resp.isError) {
      setToastContent(`Không thể cập nhật thiết bị: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
    }
  };
  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="d-flex flex-column justify-content-between mb-4">
          <div>
            <ol className="breadcrumb fs-sm mb-1">
              <li className="breadcrumb-item">
                <Link to="/org/list">Quản lý tổ chức</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Quản lý thiết bị
              </li>
            </ol>
            <h4 className="main-title mb-0">Danh sách thiết bị</h4>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-12 text-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowModal(true);
                      setAction("create");
                    }}
                  >
                    Thêm Thiết Bị
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mã Thiết Bị</th>
                        <th className="text-center">Tên Thiết Bị</th>
                        <th>Trạng Thái</th>
                        <th className="text-center">Hành Động</th>
                        <th className="text-center">Last Online</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device, index) => {
                        return (
                          <tr key={device.id}>
                            <td>{index}</td>
                            <td>{device.deviceId}</td>
                            <td>{device.deviceName}</td>
                            <td className="text-center">
                              {device.status ? "Hoạt động" : "Không hoạt động"}
                            </td>
                            <td className="d-flex flex-row justify-content-center">
                              <i
                                className="ri-edit-box-line p-1"
                                onClick={() => {
                                  setShowModal(true);
                                  setAction("update");
                                  setSelectedDevice(device);
                                }}
                              ></i>
                            </td>
                            <td>
                              {device.lastOnline
                                ? new Date().getTime() - device.lastOnline <=
                                  5 * 60 * 1000 // 5 minutes
                                  ? "Online"
                                  : "Offline"
                                : "Không có dữ liệu"}
                            </td>
                          </tr>
                        );
                      })}
                      {devices.length <= 0 && (
                        <tr key="no-device" className="text-center">
                          <td colSpan={4}>Không có thiết bị nào</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      <Modal show={showModal} onHide={closeModal} backdrop="static">
        <ModalHeader closeButton>
          {action === "create" && "Thêm Thiết Bị Mới"}
          {action === "update" && "Chỉnh Sửa Thông Tin Thiết Bị"}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Mã Thiết Bị:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => {
                    const newItem = {
                      deviceId: e.target.value,
                    };
                    setSelectedDevice(device => ({
                      ...selectedDevice,
                      ...newItem,
                    }));
                  }}
                  value={selectedDevice.deviceId}
                  autoFocus
                />
                <FormControl.Feedback type="invalid">
                  Mã Thiết Bị là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Tên Thiết Bị:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => {
                    const newItem = {
                      deviceName: e.target.value,
                    };
                    setSelectedDevice(device => ({
                      ...selectedDevice,
                      ...newItem,
                    }));
                  }}
                  value={selectedDevice.deviceName}
                />
                <FormControl.Feedback type="invalid">
                  Tên Thiết Bị là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Mật Khẩu:</FormLabel>
                <FormControl
                  required
                  onChange={e => {
                    const newItem = {
                      password: e.target.value,
                    };
                    setSelectedDevice(device => ({
                      ...selectedDevice,
                      ...newItem,
                    }));
                  }}
                  value={selectedDevice.password}
                  // Validate chỉ gồm number, độ dài tối đa là 6
                  pattern="^[0-9]{6}$"
                />
                <FormControl.Feedback type="invalid">
                  Mật Khẩu là bắt buộc và phải là 6 số
                </FormControl.Feedback>
              </FormGroup>
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
            {action === "create" && "Tạo Mới"}{" "}
            {action === "update" && "Cập Nhật"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default DeviceManagement;
