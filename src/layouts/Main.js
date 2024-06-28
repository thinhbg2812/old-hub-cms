import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import useToken from '../components/useToken';

export default function Main() {
  const { token, setToken } = useToken();
  const navigate = useNavigate();

  const offsets = ['/apps/file-manager', '/apps/email', '/apps/calendar'];
  const { pathname } = useLocation();
  const bc = document.body.classList;

  // set sidebar to offset
  offsets.includes(pathname)
    ? bc.add('sidebar-offset')
    : bc.remove('sidebar-offset');

  // auto close sidebar when switching pages in mobile
  bc.remove('sidebar-show');

  // scroll to top when switching pages
  window.scrollTo(0, 0);
  useEffect(() => {
    if (!token || token === '' || token === undefined) {
      navigate('/pages/signin');
    }
  });

  return (
    <React.Fragment>
      <Sidebar />
      <Outlet />
    </React.Fragment>
  );
}
