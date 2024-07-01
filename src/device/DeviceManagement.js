import React, { useEffect, useRef, useState } from "react";
import Header from "../layouts/Header";
import {
  createDeviceRequest,
  getDeviceRequest,
  listOrgDeviceRequest,
} from "../services/device";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [queryParams] = useSearchParams();
  const orgId = queryParams.get("orgId");
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState("create");

  const submitRef = useRef(null);

  const closeModal = async () => {
    setShowModal(false);
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
      setToastContent("Can not list Organization's devices");
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
      orgId
    );
    if (resp.isError) {
      setToastContent("Can not create new device");
      setToastVariant("danger");
      setShowToast(true);
    }
    setShowModal(false);
  };

  // const getDevice = async (id) => {
  //   const resp = await getDeviceRequest(id, orgId);
  //   if (resp.isError) {
  //     setToastContent("Can not get device info");
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
    if (form.checkValidity()) {
      if (action === "create") {
        await createDevice();
      }
    }
  };
  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
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
                Add Device
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Device Id</th>
                    <th className="text-center">Device Name</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
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
                          {device.status ? "active" : "inactive"}
                        </td>
                        <td className="d-flex flex-row justify-content-center">
                          <i
                            class="ri-edit-box-line p-1"
                            onClick={() => {
                              setShowModal(true);
                              setAction("update");
                              setSelectedDevice(device);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                  {devices.length <= 0 && (
                    <tr key="no-device" className="text-center">
                      <td colSpan={4}>No devices available</td>
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
          {action === "create" && "Add new Device"}
          {action === "update" && "Edit device info"}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Device ID:</FormLabel>
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
                />
                <FormControl.Feedback type="invalid">
                  Device ID is required
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>Device Name:</FormLabel>
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
                  Device Name is required
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <div className="d-flex flex-row justify-content-center mt-3">
              <button
                ref={submitRef}
                type="submit"
                className="btn btn-outline d-none"
              >
                Submit
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
            {action === "create" && "Create"} {action === "update" && "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default DeviceManagement;
