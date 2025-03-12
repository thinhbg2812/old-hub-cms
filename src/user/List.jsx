import { faHand } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { flattenTree } from "react-accessible-treeview";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer as ToastifyContainer, toast } from "react-toastify";
import Pagination from "../components/Pagination.js";
import Header from "../layouts/Header.js";
import { requestGetSampleRequest } from "../services/device.js";
import { listOrgRequest } from "../services/organization.js";
import { listUserRequest, updateUserRequest } from "../services/user.js";
import "./list.scss";
import UserModal from "./UserModal.jsx";

const COLUMN_WIDTH = 150;
const COLUMN_STYLE = {
  width: COLUMN_WIDTH,
  maxWidth: COLUMN_WIDTH,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(30);
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedTreeIds, setSelectedTreeIds] = useState([]);
  const [getSampleDialog, setGetSampleDialog] = useState(false);
  const [validated, setValidated] = useState(false);
  const currentSampleCommandRef = useRef("");
  const [sampleDeviceId, setSampleDeviceId] = useState("");
  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const navigate = useNavigate();
  const submitRef = useRef(null);
  const [orgs, setOrgs] = useState(
    flattenTree({
      name: "Tổ chức của bạn",
      children: [],
    })
  );
  const [isShowUserModal, setShowUserModal] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKey = queryParams.get("searchKey");
  const [isLoading, setLoading] = useState(false);

  const handleSearch = e => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (e.target.value) {
      params.set("searchKey", e.target.value);
    } else {
      params.delete("searchKey");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const closeCreateUserDialog = async () => {
    await listUser();
    setShowUserModal(false);
  };

  const closeDeleteAlertDialog = async () => {
    await listUser();
    setDeleteAlert(false);
  };

  const closeGetSampleDialog = async () => {
    await listUser();
    setGetSampleDialog(false);
  };

  const listUser = async () => {
    setLoading(true);
    const resp = await listUserRequest(page, size, searchKey);
    if (resp.isError) {
      toast.error("Không thể lấy dánh sách người dùng");
    } else {
      setUsers(resp.data.items);
      setTotal(resp.data.total);
    }
    setLoading(false);
  };

  const addProperty = (obj, path, value) => {
    let parts = path.split(">");
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      let index = current.children.findIndex(e => e.itemId === parts[i]);
      if (index < 0) {
        current.children.push({
          name: value?.orgName,
          children: [],
          itemId: parts[i],
          metadata: {
            id: parts[i],
          },
        });
        index = current.children.findIndex(e => e.itemId === parts[i]);
        current = current.children[index];
      } else {
        current = current.children[index];
      }
    }
    return obj;
  };

  const listOrg = async () => {
    const resp = await listOrgRequest(page, size);
    if (resp.isError) {
      toast.error("Không thể lấy danh sách tổ chức");
    } else {
      let obj = { children: [], name: "" };
      for (let i = 0; i < resp.data.items.length; i++) {
        let item = resp.data.items[i];
        addProperty(obj, item.path, item);
      }
      setOrgs(flattenTree(obj));
    }
  };

  const deleteUser = async user => {
    const resp = await updateUserRequest(
      null,
      user.status === "active" ? "inactive" : "active",
      null,
      selectedUser?.id
    );
    if (resp.isError) {
      toast.error("Không thể vô hiệu hóa người dùng");
    } else {
      closeDeleteAlertDialog();
    }
  };

  const handlePaginationCallback = async (pageSize, offset, pageIndex) => {
    setSize(pageSize);
    setPage(pageIndex);
  };
  const handleSubmit = async event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    event.preventDefault();
    setValidated(true);
    await requestGetHandSample();
  };
  const requestGetHandSample = async () => {
    // https://stackoverflow.com/questions/54069253/the-usestate-set-method-is-not-reflecting-a-change-immediately
    const resp = await requestGetSampleRequest(
      sampleDeviceId,
      selectedUser?.id,
      currentSampleCommandRef.current
    );
    if (resp.isError) {
      setToastContent("Không thể gửi lệnh 'Lấy mẫu' cho thiết bị");
      setToastVariant("danger");
      setShowToast(true);
    } else {
      setToastContent("Gửi lệnh đến thiết bị thành công");
      setToastVariant("success");
      setShowToast(true);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedListUser = useCallback(_.debounce(listUser, 500), [
    page,
    size,
    searchKey,
  ]);

  useEffect(() => {
    debouncedListUser(page, size, searchKey);
    // listUser();
    return () => {
      debouncedListUser.cancel();
    };
  }, [page, size, searchKey, debouncedListUser]);

  useEffect(() => {
    listOrg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container-fluid ">
          <div
            className="row py-2 sticky-top"
            style={{ top: 70, backgroundColor: "#fbfcfe" }}
          >
            <div className="col-12 d-flex">
              <Form.Control
                className="d-inline-block me-3"
                type="text"
                placeholder="Tìm kiếm"
                defaultValue={searchKey}
                onChange={handleSearch}
                autoFocus
                style={{ top: "5rem" }}
              />
              <button
                type="button"
                className="btn btn-primary text-nowrap"
                onClick={() => {
                  setSelectedTreeIds([1]);
                  setShowUserModal(true);
                  setSelectedUser(null);
                }}
              >
                Thêm người dùng
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="row">
              <div className="col">
                <table className="table table-bordered">
                  <thead className="sticky-top" style={{ top: 120 }}>
                    <tr style={{ whiteSpace: "nowrap" }}>
                      <th>#</th>
                      <th>Họ tên</th>
                      <th>Điện thoại</th>
                      <th>Tổ chức</th>
                      <th>Phương tiện</th>
                      <th>Phòng</th>
                      <th>Mẫu trái</th>
                      <th>Mẫu phải</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody style={{ verticalAlign: "middle" }}>
                    {users.map((user, index) => {
                      return (
                        <tr key={user.id}>
                          <td className="text-truncate">{index + 1}</td>
                          <td
                            className="text-truncate"
                            style={{ ...COLUMN_STYLE, minWidth: COLUMN_WIDTH }}
                          >
                            {user.fullName}
                          </td>
                          <td
                            className="text-truncate"
                            style={{ ...COLUMN_STYLE, minWidth: COLUMN_WIDTH }}
                          >
                            {user.phoneNumber}
                          </td>
                          <td
                            className="text-truncate"
                            style={{ ...COLUMN_STYLE, minWidth: COLUMN_WIDTH }}
                          >
                            {user.orgs[0]?.orgName}
                          </td>
                          <td className="text-truncate" style={COLUMN_STYLE}>
                            {user.vehicles?.map(v => v.licensePlate).join(", ")}
                          </td>
                          <td className="text-truncate" style={COLUMN_STYLE}>
                            {user.rooms?.map(r => r.roomNumber).join(", ")}
                          </td>
                          <td
                            className="text-truncate text-center"
                            style={COLUMN_STYLE}
                          >
                            {user.samples?.find(
                              sample => sample.sampleType === "left_hand"
                            ) && (
                              <FontAwesomeIcon icon={faCheck} color="#00B027" />
                            )}
                          </td>
                          <td
                            className="text-truncate text-center"
                            style={COLUMN_STYLE}
                          >
                            {user.samples?.find(
                              sample => sample.sampleType === "right_hand"
                            ) && (
                              <FontAwesomeIcon icon={faCheck} color="#00B027" />
                            )}
                          </td>

                          <td
                            className="text-truncate text-center"
                            style={COLUMN_STYLE}
                          >
                            {user.status === "active" ? (
                              <strong>Hoạt động</strong>
                            ) : (
                              <strong style={{ color: "#9B9B9B" }}>
                                Tạm dừng
                              </strong>
                            )}
                          </td>
                          <td style={COLUMN_STYLE}>
                            <div className="d-flex flex-row justify-content-center text-truncate">
                              <FontAwesomeIcon
                                icon={faHand}
                                className="align-self-center p-1 btn"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setGetSampleDialog(true);
                                }}
                                style={{ fontSize: "1.5em", color: "#00B027" }}
                              />
                              <i
                                className="ri-edit-box-line p-1 btn"
                                onClick={() => {
                                  let userOrgs = user.orgs;
                                  let orgIds = [];
                                  for (let i = 0; i < userOrgs.length; i++) {
                                    orgIds.push(user.orgs[i].id);
                                  }
                                  let treeIds = [];
                                  for (let i = 0; i < orgIds.length; i++) {
                                    let index = orgs.findIndex(
                                      o => o.metadata?.id === orgIds[i]
                                    );
                                    if (index !== -1) {
                                      treeIds.push(orgs[index].id);
                                    }
                                  }
                                  setSelectedTreeIds(treeIds);
                                  setSelectedUser(user);
                                  setShowUserModal(true);
                                }}
                                style={{ fontSize: "1.5em", color: "#FF7878" }}
                              ></i>
                              <i
                                className={`${user.status !== "inactive" ? "ri-git-repository-private-line" : "ri-lock-unlock-line"} p-1 btn`}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteAlert(true);
                                }}
                                style={{ fontSize: "1.5em", color: "#C67DFF" }}
                              ></i>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="row align-items-center">
            <div className="col-12 align-self-center">
              <Pagination
                total={total}
                pageSize={size}
                callback={handlePaginationCallback}
              />
            </div>
          </div>
        </div>
      </div>
      <UserModal
        onHide={closeCreateUserDialog}
        orgs={orgs}
        selectedTreeIds={selectedTreeIds}
        selectedUser={selectedUser}
        show={isShowUserModal}
      />

      <Modal
        show={deleteAlert}
        onHide={closeDeleteAlertDialog}
        backdrop="static"
      >
        <ModalHeader closeButton>
          Bạn có chắc chắn muốn{" "}
          {selectedUser?.status === "active" ? "vô hiệu hóa" : "kích hoạt"}{" "}
          người dùng này không?
        </ModalHeader>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              deleteUser(selectedUser);
            }}
          >
            Có
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              closeDeleteAlertDialog();
            }}
          >
            Hủy
          </button>
        </ModalFooter>
      </Modal>
      <Modal
        show={getSampleDialog}
        onHide={closeGetSampleDialog}
        backdrop="static"
      >
        <ModalHeader closeButton>
          Thao tác mẫu tay của {selectedUser?.fullName}
        </ModalHeader>
        <ModalBody>
          <Form noValidate onSubmit={handleSubmit} validated={validated}>
            <Row className="mb-1">
              <FormGroup as={Col}>
                <FormLabel>DeviceID:</FormLabel>
                <FormControl
                  required
                  type="input"
                  onChange={e => setSampleDeviceId(e.target.value)}
                />
                <FormControl.Feedback type="invalid">
                  DeviceId là bắt buộc
                </FormControl.Feedback>
              </FormGroup>
            </Row>
            <div className="d-flex flex-row justify-content-center mt-3 gap-3">
              <button
                ref={submitRef}
                type="submit"
                className="btn btn-outline d-none"
              >
                Gửi
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  currentSampleCommandRef.current = "left_hand_sampling";
                  submitRef.current?.click();
                }}
              >
                Lấy mẫu tay trái
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeGetSampleDialog}
              >
                Hoàn thành
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  currentSampleCommandRef.current = "right_hand_sampling";
                  submitRef.current?.click();
                }}
              >
                Lấy mẫu tay phải
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => {
                  currentSampleCommandRef.current = "active";
                  submitRef.current?.click();
                }}
              >
                Huỷ lấy mẫu
              </button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
      <ToastifyContainer position="bottom-right" />
      <ToastContainer position="top-end" style={{ zIndex: 1 }}>
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
      </ToastContainer>
    </React.Fragment>
  );
}
