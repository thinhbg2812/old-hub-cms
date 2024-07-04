import React, { useEffect, useState } from "react";
import TreeView from "react-accessible-treeview";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { FaCheckSquare, FaMinusSquare, FaSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import Select from "react-select";
import { toast } from "react-toastify";
import { listRoomRequest } from "../services/room.js";
import { listVehicleRequest } from "../services/vehicle.js";
import { createUserRequest, updateUserRequest } from "../services/user";
import cx from "classnames";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const DEFAULT_USER = {
  phoneNumber: "",
  fullName: "",
  status: { label: "Hoạt động", value: "active" },
  selectedVehicles: [],
  selectedRooms: [],
};

const STATUS_OPTIONS = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
  { label: "Lấy mẫu tay trái", value: "left_hand_sampling" },
  { label: "Lấy mẫu tay phải", value: "right_hand_sampling" },
];

const UserModal = ({ show, onHide, orgs, selectedTreeIds, selectedUser }) => {
  const isUpdate = !!selectedUser;
  const [rooms, setRooms] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState();
  const [formData, setFormData] = useState(DEFAULT_USER);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });
  };

  const handleMultiSelectChange = (selectedOptions, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOptions,
    });
  };

  const listVehicle = async orgId => {
    const resp = await listVehicleRequest(orgId, 0, 999);
    if (resp.isError) {
      toast.error("Không thể tải danh sách phương tiện");
    } else {
      setVehicles(resp.data.items);
      console.log(resp.data.items);
    }
  };

  const listRoom = async orgId => {
    const resp = await listRoomRequest(orgId, 0, 999);
    if (resp.isError) {
      toast.error("Không thể liệt kê phòng của tổ chức");
    } else {
      setRooms(resp.data.items);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedOrg) {
      toast.error("Vui lòng chọn tổ chức");
      return;
    }

    if (!formData.phoneNumber || !formData.fullName || !formData.status) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (isUpdate) {
      const newVehicleDetails = formData.selectedVehicles.filter(
        v => !selectedUser.vehicles?.some(sv => sv?.id === v?.value?.id)
      );
      const removedVehicleDetails = selectedUser.vehicles?.filter(
        v => !formData.selectedVehicles.some(sv => sv?.value?.id === v.id)
      );

      const vehicleDetails = [
        ...newVehicleDetails.map(v => ({
          vehicleId: v?.value.id,
          action: "new",
        })),
        ...removedVehicleDetails.map(v => ({
          vehicleId: v?.id,
          action: "delete",
        })),
      ];

      const newRoomDetails = formData.selectedRooms.filter(
        r => !selectedUser.rooms?.some(sr => sr.id === r?.value.id)
      );
      const removedRoomDetails = selectedUser.rooms?.filter(
        r => !formData.selectedRooms.some(sr => sr?.value.id === r.id)
      );

      const roomDetails = [
        ...newRoomDetails.map(r => ({
          roomId: r?.value.id,
          action: "new",
        })),
        ...removedRoomDetails.map(r => ({
          roomId: r?.id,
          action: "delete",
        })),
      ];

      const resp = await updateUserRequest(
        formData.fullName,
        formData.status?.value,
        selectedOrg,
        selectedUser.id,
        formData.phoneNumber,
        vehicleDetails,
        roomDetails
      );
      if (resp.isError) {
        toast.error("Không thể cập nhật thông tin người dùng");
      } else {
        toast.success("Cập nhật thông tin người dùng thành công");
        onHide();
      }
    } else {
      const resp = await createUserRequest(
        formData.phoneNumber,
        formData.fullName,
        formData.status.value,
        selectedOrg
      );
      if (resp.isError) {
        toast.error("Không thể tạo người dùng mới");
      } else {
        toast.success("Tạo người dùng thành công");
        onHide();
      }
    }
  };

  useEffect(() => {
    if (selectedOrg) {
      listRoom(selectedOrg);
      listVehicle(selectedOrg);
    } else {
      setRooms([]);
      setVehicles([]);
    }
  }, [selectedOrg]);

  useEffect(() => {
    if (selectedUser) {
      setSelectedOrg(selectedUser.orgs?.[0]?.id);
      setFormData({
        phoneNumber: selectedUser.phoneNumber,
        fullName: selectedUser.fullName,
        status: STATUS_OPTIONS.find(s => s.value === selectedUser.status),
        selectedVehicles: selectedUser.vehicles?.map(v => ({
          label: v.licensePlate,
          value: v,
        })),
        selectedRooms: selectedUser.rooms?.map(r => ({
          label: r.roomNumber,
          value: r,
        })),
      });
    } else {
      setFormData(DEFAULT_USER);
    }
  }, [selectedUser]);

  return (
    <Modal show={show} backdrop="static" size="lg" onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader closeButton>
          {isUpdate ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}
        </ModalHeader>
        <ModalBody>
          <div className="row gx-5">
            {!isUpdate && (
              <div className="col-5 checkbox">
                <TreeView
                  data={orgs}
                  propagateSelect
                  propagateSelectUpwards
                  togglableSelect
                  selectedIds={selectedTreeIds}
                  nodeRenderer={({
                    element,
                    isBranch,
                    isExpanded,
                    isSelected,
                    isHalfSelected,
                    getNodeProps,
                    level,
                    handleSelect,
                    handleExpand,
                  }) => {
                    return (
                      <div
                        {...getNodeProps({ onClick: handleExpand })}
                        style={{ marginLeft: 40 * (level - 1) }}
                      >
                        {isBranch && <ArrowIcon isOpen={isExpanded} />}
                        <CheckBoxIcon
                          className="checkbox-icon"
                          onClick={e => {
                            handleSelect(e);
                            e.stopPropagation();
                          }}
                          variant={
                            isHalfSelected
                              ? "some"
                              : isSelected
                                ? "all"
                                : "none"
                          }
                        />
                        <i className="ri-building-line me-1"></i>
                        <span
                          className="name"
                          onClick={() => {
                            setSelectedOrg(element?.metadata?.id);
                          }}
                          style={
                            selectedOrg === element?.metadata?.id
                              ? {
                                  fontWeight: "bold",
                                  backgroundColor: "#f0f0f0",
                                  border: "1px solid #ccc",
                                  padding: "2px 5px",
                                  borderRadius: "5px",
                                }
                              : {}
                          }
                        >
                          {element.name}
                        </span>
                      </div>
                    );
                  }}
                />
              </div>
            )}
            <div className="col">
              <Form.Group className="mb-3" controlId="phoneNumber">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ tên"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Trạng thái</Form.Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  options={STATUS_OPTIONS}
                  isSearchable={false}
                  placeholder="Chọn trạng thái"
                />
              </Form.Group>
              {isUpdate && (
                <>
                  <Form.Group className="mb-3" controlId="vehicles">
                    <Form.Label>Phương tiện</Form.Label>
                    <Select
                      name="selectedVehicles"
                      value={formData.selectedVehicles}
                      onChange={handleMultiSelectChange}
                      options={vehicles.map(v => ({
                        label: v.licensePlate,
                        value: v,
                      }))}
                      isSearchable={false}
                      isMulti
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="rooms">
                    <Form.Label>Phòng</Form.Label>
                    <Select
                      name="selectedRooms"
                      value={formData.selectedRooms}
                      onChange={handleMultiSelectChange}
                      options={rooms.map(r => ({
                        label: r.roomNumber,
                        value: r,
                      }))}
                      isSearchable={false}
                      isMulti
                    />
                  </Form.Group>
                </>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            htmlType="submit"
          >
            {isUpdate ? "Cập nhật" : "Tạo"}
          </Button>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Hủy
          </button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UserModal;

const ArrowIcon = ({ isOpen, className = "" }) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({ variant, ...rest }) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare {...rest} />;
    case "none":
      return <FaSquare {...rest} />;
    case "some":
      return <FaMinusSquare {...rest} />;
    default:
      return null;
  }
};
