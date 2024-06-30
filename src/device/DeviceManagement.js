import React from 'react';
import Header from '../layouts/Header';

const DeviceManagement = () => {
  return (
    <React.Fragment>
      <Header />
      <div className="main main-app p-3 p-lg-4">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-12 text-end">
              <button type="button" className="btn btn-primary">
                Add Device
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DeviceManagement;
