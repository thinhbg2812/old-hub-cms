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
  createVehicleRequest,
  listVehicleRequest,
  updateVehicleRequest,
} from "../services/vehicle";

const DEFAULT_VEHICLE = {
  vehicleType: "car",
  status: "active",
};

const VehicleManagement = () => {
  const [queryParams] = useSearchParams();
  const orgId = queryParams.get("orgId");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(DEFAULT_VEHICLE);
  const [showModal, setShowModal] = useState(false);
  const submitRef = useRef(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");

  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState("create");

  const closeModal = async () => {
    setShowModal(false);
    await listVehicles();
    setSelectedVehicle(DEFAULT_VEHICLE);
  };

  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      //   return;
    }
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity()) {
      if (action === "create") {
        await createVehicle();
        setSelectedVehicle({
          vehicleType: "car",
        });
        setValidated(false);
      } else {
        await updateVehicle();
      }
    }
    closeModal();
  };

  const updateVehicle = async () => {
    console.log(selectedVehicle);
    const resp = await updateVehicleRequest({
      vehicleId: selectedVehicle.id,
      status: selectedVehicle.status === "active" ? true : false,
      licensePlate: selectedVehicle.licensePlate,
      vehicleType: selectedVehicle.vehicleType,
    });
    if (resp.isError) {
      setToastContent(`Không thể cập nhật phương tiện: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setToastContent("Cập nhật phương tiện thành công");
      setToastVariant("success");
      setShowToast(true);
    }
  };

  const listVehicles = async () => {
    const resp = await listVehicleRequest(orgId, page, size);
    if (resp.isError) {
      setToastContent("Can not list Organization's vehicles");
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setVehicles(resp.data.items);
    }
  };

  useEffect(() => {
    if (orgId === null) {
      navigate("/org/list");
    } else {
      listVehicles();
    }
  }, [orgId]);

  const createVehicle = async () => {
    const resp = await createVehicleRequest(
      selectedVehicle.licensePlate,
      selectedVehicle.vehicleType,
      selectedVehicle.status,
      orgId
    );
    if (resp.isError) {
      setToastContent("Can not create Organization's vehicle");
      setToastVariant("danger");
      setShowToast(true);
    }
    closeModal();
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
                  setShowModal(true);
                }}
              >
                Thêm phương tiện
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Biển số</th>
                    <th className="text-center">Loại</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => {
                    return (
                      <tr key={vehicle.id}>
                        <td>{index}</td>
                        <td>{vehicle.licensePlate}</td>
                        <td>{vehicle.vehicleType}</td>
                        <td className="text-center">
                          {vehicle.status ? "active" : "inactive"}
                        </td>
                        <td className="d-flex flex-row justify-content-center">
                          <i
                            className="ri-edit-box-line p-1"
                            onClick={() => {
                              setShowModal(true);
                              setAction("update");
                              setSelectedVehicle({
                                ...vehicle,
                                status: vehicle.status ? "active" : "inactive",
                              });
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                  {vehicles.length <= 0 && (
                    <tr key="no-room" className="text-center">
                      <td colSpan={4}>Không có phương tiện nào</td>
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
        <ToastHeader>Notification</ToastHeader>
        <ToastBody>{toastContent}</ToastBody>
      </Toast>
      <Modal show={showModal} onHide={closeModal} backdrop="static">
        <ModalHeader closeButton>
          {action === "create" && "Tạo phương tiện mới"}
          {action === "update" && "Cập nhật phương tiện"}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Biển số xe:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => {
                    const newItem = {
                      licensePlate: e.target.value,
                    };
                    setSelectedVehicle(vehicle => ({
                      ...selectedVehicle,
                      ...newItem,
                    }));
                  }}
                  value={selectedVehicle.licensePlate}
                  autoFocus
                />
                <FormControl.Feedback type="invalid">
                  Số giấy phép là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <Col>
                <label htmlFor="type" className="form-label">
                  Loại phương tiện:
                </label>
                <select
                  id="type"
                  className="form-select"
                  onChange={e => {
                    const newItem = {
                      vehicleType: e.target.value,
                    };
                    setSelectedVehicle(vehicle => ({
                      ...selectedVehicle,
                      ...newItem,
                    }));
                  }}
                  value={selectedVehicle.vehicleType}
                >
                  <option value="car">Ô tô</option>
                  <option value="motobike">Xe máy</option>
                </select>
              </Col>
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
                    setSelectedVehicle(room => ({
                      ...selectedVehicle,
                      ...newItem,
                    }));
                  }}
                  value={selectedVehicle.status}
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
            onClick={closeModal}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default VehicleManagement;
