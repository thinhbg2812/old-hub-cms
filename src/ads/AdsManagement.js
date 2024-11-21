import React, { useEffect, useMemo, useState } from "react";
import Header from "../layouts/Header";
import { Link, useSearchParams } from "react-router-dom";
import { createAdsRequest, listAdsRequest } from "../services/ads";
import {
  Button,
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
import { useDropzone } from "react-dropzone";
import { uploadFileRequest } from "../services/file";

const AdsManagement = () => {
  const [queryParams] = useSearchParams();
  const deviceId = queryParams.get("deviceId");
  const [ads, setAds] = useState([]);

  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");

  const [showAds, setShowAds] = useState(false);
  const [action, setAction] = useState("create");

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", "jpeg"],
      "video/mp4": [".mp4"],
    },
    maxFiles: 1,
  });

  const files = acceptedFiles.map(file => <li key={file.path}>{file.name}</li>);

  const closeShowAdsDialog = () => {
    setShowAds(false);
  };

  useEffect(() => {
    if (deviceId) {
      listAds(deviceId);
    }
  }, [deviceId]);
  const listAds = async id => {
    const resp = await listAdsRequest(id);
    if (resp.isError) {
      setToastContent("Không thể lấy thông tin Ads");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    setAds(resp.data.items);
  };
  const addAds = async () => {
    //upload file
    if (files.length <= 0) {
      setToastContent("Thiếu tập tin quảng cáo");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    let resp = await uploadFileRequest(files[i]);
    if (resp.isError) {
      setToastContent("Không thể tải tập tin");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    //create ads
    // resp = await createAdsRequest(deviceId)
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
                Quản lý Ads
              </li>
            </ol>
            <h4 className="main-title">Danh sách Ads</h4>
            <div className="d-flex flex-row-reverse">
              <Button
                onClick={() => {
                  setShowAds(true);
                }}
              >
                Thêm mới
              </Button>
            </div>

            <div className="mt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên Ads</th>
                    <th className="text-center">Thứ tự</th>
                    <th className="text-center">Thời lượng</th>
                    <th className="text-center">Loại quảng cáo</th>
                    <th className="text-center">Tải xuống</th>
                    <th className="text-center">Sửa</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map(ad => (
                    <tr key={ad.id}>
                      <td>{ad.adsName}</td>
                      <td>{ad.position}</td>
                      <td>{ad.adsLength}</td>
                      <td>{ad.adsType}</td>
                      <td className="text-center">
                        <i className="ri-file-download-line"></i>
                      </td>
                      <td className="text-center">
                        <i className="ri-edit-box-line"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showAds} onHide={closeShowAdsDialog} backdrop="static">
        <ModalHeader closeButton>
          {action === "create" && "Thêm Ads"}
          {action === "update" && "Chỉnh Sửa Ads"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <FormLabel>Tên Ads:</FormLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup>
              <FormLabel>Vị trí:</FormLabel>
              <FormControl type="number" />
            </FormGroup>
            <FormGroup>
              <FormLabel>Độ dài:</FormLabel>
              <FormControl type="number" />
            </FormGroup>
            <FormGroup>
              <FormLabel>Loại:</FormLabel>
              <FormControl type="text" />
            </FormGroup>
            <FormGroup>
              <FormLabel>Loại:</FormLabel>
              <FormSelect>
                <option value="photo">Ảnh</option>
                <option value="video">Video</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <div
                {...getRootProps({ className: "dropzone" })}
                className="mt-2 bg-light border-2 border-primary d-flex flex-column text-center align-middle p-5"
              >
                <input {...getInputProps()} />
                <p>Drag and drop here, or click to select file</p>
              </div>
              <aside>
                <ul>{files}</ul>
              </aside>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary">Tạo mới</Button>
          <Button variant="secondary" onClick={() => closeShowAdsDialog()}>
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

export default AdsManagement;
