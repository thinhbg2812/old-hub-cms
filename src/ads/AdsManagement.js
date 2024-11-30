import React, { useEffect, useMemo, useState } from "react";
import Header from "../layouts/Header";
import { Link, useSearchParams } from "react-router-dom";
import {
  createAdsRequest,
  deleteAdsRequest,
  getAdsRequest,
  listAdsRequest,
  updateAdsRequest,
} from "../services/ads";
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
import { downloadRequest, uploadFileRequest } from "../services/file";

const AdsManagement = () => {
  const [queryParams] = useSearchParams();
  const deviceId = queryParams.get("deviceId");
  const [ads, setAds] = useState([]);

  const [toastContent, setToastContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState("Success");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteAdsId, setDeleteAdsId] = useState("");

  const closeConfirmDialog = () => {
    setShowConfirm(false);
    setDeleteAdsId("");
    listAds(deviceId);
  };

  const [showAds, setShowAds] = useState(false);
  const [action, setAction] = useState("create");
  const [adsObject, setAdsObject] = useState({
    status: 1,
    adsType: "photo",
  });
  const [uploadFiles, setUploadFiles] = useState([]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", "jpeg"],
      "video/mp4": [".mp4"],
    },
    maxFiles: 1,
  });

  const files = acceptedFiles.map(file => <li key={file.path}>{file.name}</li>);
  useEffect(() => {
    setUploadFiles(acceptedFiles);
  }, [acceptedFiles]);

  const closeShowAdsDialog = () => {
    setAdsObject({
      status: 1,
      adsType: "photo",
    });
    setUploadFiles([]);
    setShowAds(false);
    listAds(deviceId);
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
  const getAds = async id => {
    const resp = await getAdsRequest(id);
    if (resp.isError) {
      setToastContent("Không thể lấy thông tin Ads");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    setAdsObject(resp.data);
  };
  const updateAds = async () => {
    let resp;
    if (uploadFiles.length > 0) {
      resp = await uploadFileRequest(uploadFiles[0]);
      if (resp.fileName === undefined) {
        setToastContent("Không thể tải tập tin");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }
    }
    //update ads
    resp = await updateAdsRequest(
      adsObject.id,
      adsObject.position,
      adsObject.adsName,
      adsObject.adsLength,
      adsObject.adsType,
      uploadFiles.length > 0 ? resp.path : null,
      uploadFiles.length > 0 ? resp.mimeType : null,
      adsObject.externalLink
    );
    if (resp.isError) {
      setToastContent("Không thể cập nhật quảng cáo");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeShowAdsDialog();
  };
  const addAds = async () => {
    //upload file
    // if (uploadFiles.length <= 0) {
    //   setToastContent("Thiếu tập tin quảng cáo");
    //   setToastVariant("danger");
    //   setShowToast(true);
    //   return;
    // }
    let resp;
    if (uploadFiles.length > 0) {
      resp = await uploadFileRequest(uploadFiles[0]);
      if (resp.fileName === undefined) {
        setToastContent("Không thể tải tập tin");
        setToastVariant("danger");
        setShowToast(true);
        return;
      }
    }

    //create ads
    resp = await createAdsRequest(
      deviceId,
      adsObject.adsName,
      adsObject.position,
      adsObject.adsLength,
      adsObject.adsType,
      uploadFiles.length > 0 ? resp.path : null,
      uploadFiles.length > 0 ? resp.mimeType : null,
      adsObject.status,
      adsObject.externalLink
    );
    if (resp.isError) {
      setToastContent("Không thể tạo quảng cáo");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeShowAdsDialog();
  };
  const deleteAds = async () => {
    const resp = await deleteAdsRequest(deleteAdsId);
    if (resp.isError) {
      setToastContent("Không thể tạo quảng cáo");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }
    closeConfirmDialog();
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
                    <th>Tên Ads</th>
                    <th className="text-center">Thứ tự</th>
                    <th className="text-center">Thời lượng (giây)</th>
                    <th className="text-center">Loại quảng cáo</th>
                    <th className="text-center">Tải xuống</th>
                    <th className="text-center">Sửa</th>
                    <th className="text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map(ad => (
                    <tr key={ad.id}>
                      <td>{ad.adsName}</td>
                      <td className="text-center">{ad.position}</td>
                      <td className="text-center">{ad.adsLength}</td>
                      <td className="text-center">{ad.adsType}</td>
                      <td className="text-center">
                        <i
                          className="ri-file-download-line"
                          onClick={async () => {
                            const resp = await downloadRequest(ad.id);
                            if (resp.isError) {
                              setToastContent(
                                "Quảng cáo không có ảnh hoặc có ảnh từ nguồn bên ngoài"
                              );
                              setToastVariant("danger");
                              setShowToast(true);
                            }
                          }}
                        ></i>
                      </td>
                      <td className="text-center">
                        <i
                          className="ri-edit-box-line"
                          onClick={() => {
                            getAds(ad.id);
                            setShowAds(true);
                            setAction("update");
                          }}
                        ></i>
                      </td>
                      <td className="text-center">
                        <i
                          className="ri-delete-bin-line"
                          onClick={() => {
                            setDeleteAdsId(ad.id);
                            setShowConfirm(true);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showAds}
        onHide={closeShowAdsDialog}
        backdrop="static"
        size="lg"
      >
        <ModalHeader closeButton>
          {action === "create" && "Thêm Ads"}
          {action === "update" && "Chỉnh Sửa Ads"}
        </ModalHeader>
        <ModalBody>
          <div className="d-flex flex-row gap-2">
            <Form>
              <FormGroup>
                <FormLabel>Tên Ads:</FormLabel>
                <FormControl
                  type="text"
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      adsName: e.target.value,
                    });
                  }}
                  value={adsObject.adsName}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Vị trí:</FormLabel>
                <FormControl
                  type="number"
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      position: e.target.value,
                    });
                  }}
                  value={adsObject.position}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Độ dài (giây):</FormLabel>
                <FormControl
                  type="number"
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      adsLength: e.target.value,
                    });
                  }}
                  value={adsObject.adsLength}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Loại:</FormLabel>
                <FormSelect
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      status: e.target.value,
                    });
                  }}
                  value={adsObject.status}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>NGừng hoạt động</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Loại:</FormLabel>
                <FormSelect
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      adsType: e.target.value,
                    });
                  }}
                  value={adsObject.adsType}
                  v
                >
                  <option value="photo">Ảnh</option>
                  <option value="video">Video</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Link ảnh/video ngoài:</FormLabel>
                <FormControl
                  type="text"
                  onChange={e => {
                    setAdsObject({
                      ...adsObject,
                      externalLink: e.target.value,
                    });
                  }}
                  value={adsObject.externalLink}
                />
              </FormGroup>
              <FormGroup>
                <div
                  {...getRootProps({ className: "dropzone" })}
                  className="mt-2 bg-light border-2 border-primary d-flex flex-column text-center align-middle p-5"
                >
                  <input {...getInputProps()} />
                  <p>Drag and drop here, or click to select file</p>
                </div>
                {/* <aside>
                  <ul>{files}</ul>
                </aside> */}
              </FormGroup>
            </Form>
            <div className="d-flex flex-column gap-2">
              <div>Preview</div>
              <div>
                {uploadFiles.length > 0 && (
                  <>
                    {uploadFiles[0].type.includes("image") && (
                      <img
                        src={URL.createObjectURL(uploadFiles[0])}
                        onLoad={() => {
                          uploadFiles[0];
                        }}
                        style={{ maxWidth: 150 }}
                      />
                    )}
                  </>
                )}
                {uploadFiles.length <= 0 && (
                  <>
                    {adsObject.filePath && (
                      <>
                        {adsObject.adsType === "photo" && (
                          <img
                            src={`${process.env.REACT_APP_BE_DOMAIN}/api/file/ads?adsId=${adsObject.id}`}
                            style={{ maxWidth: 150 }}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={() => {
              if (action === "create") {
                addAds();
              } else {
                updateAds();
              }
            }}
          >
            {action === "create" && <>Tạo mới</>}
            {action !== "create" && <>Cập nhật</>}
          </Button>
          <Button variant="secondary" onClick={() => closeShowAdsDialog()}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        show={showConfirm}
        onHide={closeConfirmDialog}
        backdrop="static"
        size="md"
      >
        <ModalBody>Bạn thực sự muốn xóa Ads này?</ModalBody>
        <ModalFooter>
          <Button
            variant="danger"
            onClick={() => {
              deleteAds();
            }}
          >
            Đồng ý
          </Button>
          <Button variant="primary" onClick={closeConfirmDialog}>
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
