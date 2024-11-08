/* eslint-disable react-hooks/exhaustive-deps */
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
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
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
import { listOrgRequest } from "../services/organization";
import { checkNoSpecialCharacters } from "../utils/string";
import {
  addLockerRequest,
  addMultiStackRequest,
  addStackRequest,
  deleteStackRequest,
  getDeviceLockerRequest,
  removeLockerRequest,
} from "../services/locker";
import AlertDialog from "../components/Alert";

const DEFAULT_DEVICE = {
  deviceId: "",
  deviceName: "",
  password: "",
};

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [queryParams] = useSearchParams();
  const [orgId, setOrgId] = useState("");
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState(DEFAULT_DEVICE);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState("create");
  const [orgs, setOrgs] = useState([]);

  const [size, setSize] = useState(40);
  const [index, setIndex] = useState(0);

  const [showLockerModel, setShowLockerModel] = useState(false);
  const [locker, setLocker] = useState(null);
  const [stacks, setStacks] = useState([]);

  const [showAddOneStack, setShowAddOneStack] = useState(false);
  const [isAddOneStack, setIsAddOneStack] = useState(true);
  const [stackPosition, setStackPosition] = useState(0);
  const [stackSize, setStackSize] = useState("m");
  const [stackNumber, setStackNumber] = useState(1);

  const [showAddLocker, setShowAddLocker] = useState(false);
  const [lockerName, setLockerName] = useState("");
  const [lockerAddress, setLockerAddress] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertOkCallback, setAlertOkCallback] = useState(null);

  const closeAlertDialog = () => {
    setSelectedStack(null);
    setShowAlert(false);
  };

  const closeAddLockerDialog = () => {
    setLockerName("");
    setLockerAddress("");
    setShowAddLocker(false);
  };

  const closeAddOneStackDialog = () => {
    setStackPosition(0);
    setStackSize("m");
    setStackNumber(1);
    getLocker(selectedDevice.deviceId);
    setShowAddOneStack(false);
  };

  const closeLockerModel = () => {
    setLocker(null);
    setStacks([]);
    setShowLockerModel(false);
  };

  const submitRef = useRef(null);

  const closeModal = async () => {
    setShowModal(false);
    setSelectedDevice(DEFAULT_DEVICE);
    await listDevice();
  };
  useEffect(() => {
    setOrgId(queryParams.get("orgId"));
  }, [queryParams.get("orgId")]);

  useEffect(() => {
    if (orgId !== null && orgId !== "") {
      listDevice();
    }
  }, [orgId]);

  useEffect(() => {
    listUserOrgs();
  }, []);

  const listUserOrgs = async () => {
    const resp = await listOrgRequest(0, 20);
    if (resp.isError) {
      setToastContent("Không thể lấy thiết bị của tổ chức");
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setOrgs(resp.data.items);
    }
  };

  const listDevice = async () => {
    const resp = await listOrgDeviceRequest(orgId, index, size);
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
  const getLocker = async deviceId => {
    const resp = await getDeviceLockerRequest(deviceId);
    if (resp.isError) {
      setToastContent(`Không thể cập nhật thiết bị: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
    }
    if (resp.data.locker) {
      setLocker(resp.data.locker);
    }
    if (resp.data.stacks) {
      setStacks(resp.data.stacks);
    }
  };
  const addStack = async () => {
    const resp = await addStackRequest(locker.id, stackSize, stackPosition);
    if (resp.isError) {
      setToastContent(`Không thể thêm ngăn chứa đồ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeAddOneStackDialog();
  };
  const addStacks = async () => {
    const resp = await addMultiStackRequest(locker.id, stackSize, stackNumber);
    if (resp.isError) {
      setToastContent(`Không thể thêm ngăn chứa đồ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeAddOneStackDialog();
  };
  const addLocker = async () => {
    if (lockerName === "" || lockerAddress === "") {
      setToastContent(`Tên và địa chỉ không dược để trống`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    const resp = await addLockerRequest(
      selectedDevice.deviceId,
      lockerName,
      lockerAddress
    );
    if (resp.isError) {
      setToastContent(`Không thể thêm tủ đồ mới: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    setLocker(resp.data);
    closeAddLockerDialog();
  };
  const deleteStack = async stackId => {
    const resp = await deleteStackRequest(stackId);
    if (resp.isError) {
      setToastContent(`Không thể xóa ngăn đồ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    getLocker(selectedDevice.deviceId);
    closeAlertDialog();
  };
  const removeLocker = async lockerId => {
    const resp = await removeLockerRequest(lockerId);
    if (resp.isError) {
      setToastContent(`Không thể gỡ tủ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeAlertDialog();
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
              <li
                className="breadcrumb-item active border-0"
                aria-current="page"
              >
                Quản lý thiết bị
              </li>
            </ol>
            <h4 className="main-title mb-0">Danh sách thiết bị</h4>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <div>Chọn tổ chức:</div>
            <div>
              <FormSelect
                value={orgId ?? ""}
                onChange={e => {
                  setOrgId(e.target.value);
                }}
              >
                <option value="">Chọn một tổ chức</option>
                {orgs.map(org => {
                  return (
                    <option value={org.id} key={org.id}>
                      {org.orgName}
                    </option>
                  );
                })}
              </FormSelect>
            </div>
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
                        <th className="text-center">Trạng Thái</th>
                        <th className="text-center">Last Online</th>
                        <th className="text-center">Logs</th>
                        <th />
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
                            <td>
                              {device.lastOnline
                                ? new Date().getTime() - device.lastOnline <=
                                  5 * 60 * 1000 // 5 minutes
                                  ? "Online"
                                  : "Offline"
                                : "Không có dữ liệu"}
                            </td>
                            <td />
                            <td className="text-center">
                              <Dropdown>
                                <Dropdown.Toggle variant="success">
                                  <i className="ri-more-2-line"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setShowModal(true);
                                      setAction("update");
                                      setSelectedDevice(device);
                                    }}
                                  >
                                    Sửa
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => {
                                      setSelectedDevice(device);
                                      getLocker(device.deviceId);
                                      setShowLockerModel(true);
                                    }}
                                  >
                                    Thông tin tủ
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
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
      <Modal
        show={showLockerModel}
        onHide={closeLockerModel}
        backdrop="static"
        size="lg"
      >
        <ModalHeader closeButton className="fw-bold">
          Thông tin tủ
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>
                {locker === null && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowAddLocker(true);
                    }}
                  >
                    Gắn tủ mới
                  </Button>
                )}
                {locker && (
                  <div className="d-flex flex-row">
                    <Button
                      variant="warning"
                      style={{ marginRight: "10px" }}
                      onClick={() => {
                        setAlertTitle("Gỡ tủ đồ");
                        setAlertContent(
                          "Bạn có thực sự muốn gỡ tủ này khỏi thiết bị?"
                        );
                        setAlertOkCallback(() => () => {
                          removeLocker(locker.id);
                        });
                        setShowAlert(true);
                      }}
                    >
                      Gỡ tủ
                    </Button>
                    <Button variant="primary">Đổi tủ</Button>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {locker !== null && (
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row">
                      <div className="w-25">Tên tủ:</div>
                      <div>{locker.name}</div>
                    </div>
                    <div className="d-flex flex-row">
                      <div className="w-25">Vị trí tủ:</div>
                      <div>{locker.address}</div>
                    </div>
                    <div className="d-flex flex-row">
                      <div className="w-25">Trạng thái tủ:</div>
                      <div>
                        {locker.status ? "Hoạt động" : "Không hoạt động"}
                      </div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            {locker !== null && (
              <>
                <Row className="mt-2">
                  <Col className="fw-bold" md={6}>
                    Danh sách ngăn đồ:
                  </Col>
                  <Col
                    className="fw-bold"
                    md={3}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      variant="warning"
                      onClick={() => {
                        setIsAddOneStack(false);
                        setShowAddOneStack(true);
                      }}
                    >
                      Thêm nhiều ngăn tủ
                    </Button>
                  </Col>
                  <Col
                    className="fw-bold"
                    md={3}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      variant="success"
                      onClick={() => {
                        setIsAddOneStack(true);
                        setShowAddOneStack(true);
                      }}
                    >
                      Thêm một ngăn tủ
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th className="text-center">Vị trí</th>
                          <th className="text-center">Kích thước</th>
                          <th className="text-center">Đang mở</th>
                          <th className="text-center">Đang được sử dụng</th>
                          <th className="text-center">Trạng thái</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {stacks.length > 0 && (
                          <>
                            {stacks.map(stack => (
                              <tr key={stack.id}>
                                <td className="text-center">
                                  {stack.position}
                                </td>
                                <td className="text-center">{stack.size}</td>
                                <td className="text-center">
                                  {stack.isOpened ? "Đang mở" : "Đang khóa"}
                                </td>
                                <td className="text-center">
                                  {stack.isUsed ? "Đang chứa đồ" : "Đang trống"}
                                </td>
                                <td className="text-center">
                                  {stack.status ? "Khả dụng" : "Không khả dụng"}
                                </td>
                                <td>
                                  <i
                                    className="ri-delete-bin-line"
                                    onClick={() => {
                                      setSelectedStack(stack);
                                      setAlertTitle("Xóa ngăn tủ");
                                      setAlertContent(
                                        "Bạn có muốn xóa ngăn tủ này không?"
                                      );
                                      setAlertOkCallback(() => () => {
                                        deleteStack(stack.id);
                                      });
                                      setShowAlert(true);
                                    }}
                                  ></i>
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </>
            )}
          </Container>
        </ModalBody>
      </Modal>
      <Modal
        show={showAddOneStack}
        onHide={closeAddOneStackDialog}
        backdrop="static"
      >
        <ModalHeader className="bg-success">Thêm ngăn tủ mới</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>Kích thước ngăn:</Col>
              <Col>
                <FormSelect
                  onChange={e => {
                    setStackSize(e.target.value);
                  }}
                >
                  <option value="s">S</option>
                  <option value="l">L</option>
                  <option value="m">M</option>
                </FormSelect>
              </Col>
            </Row>
            {isAddOneStack && (
              <Row className="mt-2">
                <Col>Vị trí ngăn:</Col>
                <Col>
                  <FormControl
                    type="number"
                    onChange={e => {
                      setStackPosition(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            )}

            {!isAddOneStack && (
              <Row className="mt-2">
                <Col>Số lượng ngăn:</Col>
                <Col>
                  <FormControl
                    type="number"
                    onChange={e => {
                      setStackNumber(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            )}
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              if (isAddOneStack) {
                addStack();
              } else {
                addStacks();
              }
            }}
          >
            Thêm
          </Button>
          <Button variant="secondary" onClick={closeAddOneStackDialog}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        show={showAddLocker}
        onHide={closeAddLockerDialog}
        backdrop="static"
      >
        <ModalHeader className="bg-success">Thêm tủ mới</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <div className="w-25">Tên tủ:</div>
              <div>
                <FormControl
                  type="text"
                  onChange={e => setLockerName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex flex-row mt-2">
              <div className="w-25">Vị trí đặt tủ:</div>
              <div>
                <FormControl
                  type="text"
                  onChange={e => setLockerAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="success" onClick={() => addLocker()}>
            Tạo mới
          </Button>
          <Button variant="secondary" onClick={closeAddLockerDialog}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
      <AlertDialog
        closeCallback={closeAlertDialog}
        isOpen={showAlert}
        title={alertTitle}
        content={alertContent}
        okCallback={alertOkCallback}
      />
    </React.Fragment>
  );
};

export default DeviceManagement;
