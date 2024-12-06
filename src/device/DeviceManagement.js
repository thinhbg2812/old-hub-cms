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
  updateLockerRequest,
  updateStackRequest,
} from "../services/locker";
import AlertDialog from "../components/Alert";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import TimePicker from "react-time-picker";

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
  const [locker, setLocker] = useState({
    roofLightOnTime: "00:00",
    roofLightOffTime: "01:00",
    id: "",
  });
  const [stacks, setStacks] = useState([]);

  const [showAddOneStack, setShowAddOneStack] = useState(false);
  const [isAddOneStack, setIsAddOneStack] = useState(true);
  const [stackSize, setStackSize] = useState("m");
  const [stackNumber, setStackNumber] = useState(1);
  const [stack, setStack] = useState({
    boardIndex: 0,
    lockIndex: 0,
    xDirection: 0,
    yDirection: 0,
    size: "s",
    position: 1,
  });
  const [stackAction, setStackAction] = useState("create");

  const [showAddLocker, setShowAddLocker] = useState(false);
  const [lockerAction, setLockerAction] = useState("create");

  const [showAlert, setShowAlert] = useState(false);
  const [selectedStack, setSelectedStack] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertOkCallback, setAlertOkCallback] = useState(null);

  const closeAlertDialog = () => {
    setShowAlert(false);
  };

  const closeAddLockerDialog = () => {
    setShowAddLocker(false);
    getLocker(selectedDevice.deviceId);
  };

  const closeAddOneStackDialog = () => {
    setStackSize("m");
    setStackNumber(1);
    setStack({
      boardIndex: 0,
      lockIndex: 0,
      xDirection: 0,
      yDirection: 0,
      size: "s",
      position: 1,
    });
    getLocker(selectedDevice.deviceId);
    setShowAddOneStack(false);
  };

  const closeLockerModel = () => {
    getLocker(selectedDevice.deviceId);
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
    } else {
      setLocker({
        roofLightOnTime: "00:00",
        roofLightOffTime: "01:00",
        id: "",
      });
    }
    if (resp.data.stacks) {
      setStacks(resp.data.stacks);
    }
  };
  const addStack = async () => {
    if (stack.xDirection > 2 || stack.yDirection > 2) {
      setToastContent(
        `X direction hoặc Y direction chỉ nhận một trong các giá trị [0, 1, 2]`
      );
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    const resp = await addStackRequest(
      locker.id,
      stack.size,
      stack.position,
      stack.boardIndex,
      stack.lockIndex,
      stack.xDirection,
      stack.yDirection
    );
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
  const updateStack = async () => {
    const resp = await updateStackRequest(
      stack.id,
      stack.size,
      stack.position,
      stack.boardIndex,
      stack.lockIndex,
      stack.xDirection,
      stack.yDirection
    );
    if (resp.isError) {
      setToastContent(`Không thể sửa ngăn chứa đồ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeAddOneStackDialog();
  };
  const addLocker = async () => {
    if (locker.name === "" || locker.address === "") {
      setToastContent(`Tên và địa chỉ không dược để trống`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    const resp = await addLockerRequest(
      selectedDevice.deviceId,
      locker.name,
      locker.address,
      locker.roofLightOnTime,
      locker.roofLightOffTime
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
  const updateLocker = async () => {
    if (locker.name === "" || locker.address === "") {
      setToastContent(`Tên và địa chỉ không dược để trống`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    const resp = await updateLockerRequest(
      locker.id,
      locker.name,
      locker.address,
      null,
      locker.roofLightOffTime,
      locker.roofLightOnTime
    );
    if (resp.isError) {
      setToastContent(`Không thể cập nhật thông tin tủ: ${resp.msg}`);
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeAddLockerDialog();
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
                                  <Dropdown.Item
                                    onClick={() => {
                                      window.location.href = `ads?deviceId=${device.id}`;
                                    }}
                                  >
                                    Quản lý ads
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={() => {
                                      window.location.href = `games?deviceId=${device.id}`;
                                    }}
                                  >
                                    Quản lý games
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
        size="xl"
        scrollable
      >
        <ModalHeader closeButton className="fw-bold">
          Thông tin tủ
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>
                {locker.id === "" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setLockerAction("create");
                      setShowAddLocker(true);
                    }}
                  >
                    Gắn tủ mới
                  </Button>
                )}
                {locker.id !== "" && (
                  <div className="d-flex flex-row gap-2">
                    <Button
                      variant="warning"
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
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setLockerAction("update");
                        setShowAddLocker(true);
                      }}
                    >
                      Sửa thông tin tủ
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                {locker.id !== "" && (
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
                    <div className="d-flex flex-row">
                      <div className="w-25">Thời gian bật đèn:</div>
                      <div>{locker.roofLightOnTime ?? "N/A"}</div>
                    </div>
                    <div className="d-flex flex-row">
                      <div className="w-25">Thời gian tắt đèn:</div>
                      <div>{locker.roofLightOffTime ?? "N/A"}</div>
                    </div>
                  </div>
                )}
              </Col>
            </Row>
            {locker.id !== "" && (
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
                        setStackAction("create");
                      }}
                    >
                      Thêm một ngăn tủ
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <div className="overflow-auto">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="text-center">Vị trí</th>
                            <th className="text-center">Kích thước</th>
                            <th className="text-center">Board Index</th>
                            <th className="text-center">Lock index</th>
                            <th className="text-center">x direction</th>
                            <th className="text-center">y direction</th>
                            <th className="text-center">Đang mở</th>
                            <th className="text-center">Đang được sử dụng</th>
                            <th className="text-center">Trạng thái</th>
                            <th />
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {stacks.length > 0 && (
                            <>
                              {stacks.map(st => (
                                <tr key={st.id}>
                                  <td className="text-center">{st.position}</td>
                                  <td className="text-center">{st.size}</td>
                                  <td className="text-center">
                                    {st.boardIndex}
                                  </td>
                                  <td className="text-center">
                                    {st.lockIndex}
                                  </td>
                                  <td className="text-center">
                                    {st.xDirection}
                                  </td>
                                  <td className="text-center">
                                    {st.yDirection}
                                  </td>
                                  <td className="text-center">
                                    {st.isOpened ? "Đang mở" : "Đang khóa"}
                                  </td>
                                  <td className="text-center">
                                    {st.isUsed ? "Đang chứa đồ" : "Đang trống"}
                                  </td>
                                  <td className="text-center">
                                    {st.status ? "Khả dụng" : "Không khả dụng"}
                                  </td>
                                  <td>
                                    <i
                                      className="ri-edit-box-line"
                                      onClick={() => {
                                        setStack(st);
                                        setStackAction("update");
                                        setShowAddOneStack(true);
                                      }}
                                    ></i>
                                  </td>
                                  <td>
                                    <i
                                      className={`${st.status ? "ri-stop-circle-line" : "ri-play-circle-line"}`}
                                      onClick={() => {
                                        setAlertTitle(
                                          `${st.status ? "Tắt ngăn tủ" : "Bật ngăn tủ"}`
                                        );
                                        setAlertContent(
                                          `Bạn có muốn ${st.status ? "tắt" : "bật"} ngăn tủ này không?`
                                        );
                                        setAlertOkCallback(() => () => {
                                          deleteStack(st.id);
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
                    </div>
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
        <ModalHeader className="bg-success">
          {stackAction === "create" && <>Thêm ngăn tủ mới</>}
          {stackAction !== "create" && <>Sửa ngăn tủ</>}
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>Kích thước ngăn:</Col>
              <Col>
                <FormSelect
                  onChange={e => {
                    setStack({
                      ...stack,
                      size: e.target.value,
                    });
                  }}
                  value={stack?.size ?? "s"}
                >
                  <option value="s">S</option>
                  <option value="l">L</option>
                  <option value="m">M</option>
                  <option value="xl">XL</option>
                </FormSelect>
              </Col>
            </Row>
            {isAddOneStack && (
              <>
                <Row className="mt-2">
                  <Col>Vị trí ngăn:</Col>
                  <Col>
                    <FormControl
                      type="number"
                      onChange={e => {
                        setStack({
                          ...stack,
                          position: e.target.value,
                        });
                      }}
                      value={stack?.position ?? 0}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>Board Index:</Col>
                  <Col>
                    <FormControl
                      type="number"
                      onChange={e => {
                        setStack({
                          ...stack,
                          boardIndex: e.target.value,
                        });
                      }}
                      value={stack?.boardIndex ?? 0}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>Lock index:</Col>
                  <Col>
                    <FormControl
                      type="number"
                      onChange={e => {
                        setStack({
                          ...stack,
                          lockIndex: e.target.value,
                        });
                      }}
                      value={stack?.lockIndex ?? 0}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>X direction:</Col>
                  <Col>
                    <FormControl
                      type="number"
                      onChange={e => {
                        setStack({
                          ...stack,
                          xDirection: e.target.value,
                        });
                      }}
                      value={stack?.xDirection ?? 0}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>Y direction:</Col>
                  <Col>
                    <FormControl
                      type="number"
                      onChange={e => {
                        setStack({
                          ...stack,
                          yDirection: e.target.value,
                        });
                      }}
                      value={stack?.yDirection ?? 0}
                    />
                  </Col>
                </Row>
              </>
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
              if (stackAction === "create") {
                if (isAddOneStack) {
                  addStack();
                } else {
                  addStacks();
                }
              } else {
                updateStack();
              }
            }}
          >
            {stackAction === "create" && <>Thêm</>}
            {stackAction !== "create" && <>Cập nhật</>}
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
        <ModalHeader className="bg-success">
          {lockerAction === "create" && <>Thêm tủ mới</>}
          {lockerAction !== "create" && <>Sửa thông tin tủ</>}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormLabel>Tên tủ:</FormLabel>
              <FormControl
                type="text"
                onChange={e => {
                  setLocker({
                    ...locker,
                    name: e.target.value,
                  });
                }}
                value={locker?.name ?? ""}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Vị trí đặt tủ:</FormLabel>
              <FormControl
                type="text"
                onChange={e => {
                  setLocker({
                    ...locker,
                    address: e.target.value,
                  });
                }}
                value={locker?.address ?? ""}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Thời gian bật đèn:</FormLabel>
              <br />
              <TimePicker
                onChange={v => {
                  setLocker({
                    ...locker,
                    roofLightOnTime: v,
                  });
                }}
                value={locker?.roofLightOnTime ?? "00:00"}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Thời gian tắt đèn:</FormLabel>
              <br />
              <TimePicker
                onChange={v => {
                  setLocker({
                    ...locker,
                    roofLightOffTime: v,
                  });
                }}
                value={locker?.roofLightOffTime ?? "01:00"}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="success"
            onClick={() => {
              if (lockerAction === "create") {
                addLocker();
              } else {
                updateLocker();
              }
            }}
          >
            {lockerAction === "create" && <>Tạo mới</>}
            {lockerAction !== "create" && <>Cập nhật</>}
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
