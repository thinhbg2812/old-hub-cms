const userMenu = [
  {
    label: 'Quản lý Người dùng',
    link: '/user/list',
    icon: 'ri-user-line',
  },
  // {
  //   "label": "Quản lý Nhân viên",
  //   "link": "/employee/list",
  //   "icon": "ri-user-2-line"
  // },
  {
    label: 'Quản lý Tổ chức',
    link: '/org/list',
    icon: 'ri-global-line',
  },
];

const applicationsMenu = [];

const pagesMenu = [
  {
    label: 'Trang Người dùng',
    icon: 'ri-account-circle-line',
    submenu: [
      {
        label: 'Hồ sơ Người dùng',
        link: '/pages/profile',
      },
      {
        label: 'Nhóm & Mọi người',
        link: '/pages/people',
      },
      {
        label: 'Nhật ký Hoạt động',
        link: '/pages/activity',
      },
      {
        label: 'Sự kiện',
        link: '/pages/events',
      },
      {
        label: 'Cài đặt',
        link: '/pages/settings',
      },
    ],
  },
  {
    id: 27,
    label: 'Xác thực',
    icon: 'ri-lock-2-line',
    submenu: [
      {
        label: 'Đăng nhập Cơ bản',
        link: '/pages/signin',
      },
      {
        label: 'Đăng nhập với Cover',
        link: '/pages/signin2',
      },
      {
        label: 'Đăng ký Cơ bản',
        link: '/pages/signup',
      },
      {
        label: 'Đăng ký với Cover',
        link: '/pages/signup2',
      },
      {
        label: 'Xác minh Tài khoản',
        link: '/pages/verify',
      },
      {
        label: 'Quên Mật khẩu',
        link: '/pages/forgot',
      },
      {
        label: 'Màn hình Khóa',
        link: '/pages/lock',
      },
    ],
  },
  {
    label: 'Trang Lỗi',
    icon: 'ri-error-warning-line',
    submenu: [
      {
        label: 'Trang Không Tìm Thấy',
        link: '/pages/error-404',
      },
      {
        label: 'Lỗi Máy chủ Nội bộ',
        link: '/pages/error-500',
      },
      {
        label: 'Dịch vụ Không Khả dụng',
        link: '/pages/error-503',
      },
      {
        label: 'Cấm Truy cập',
        link: '/pages/error-505',
      },
    ],
  },
  {
    label: 'Các Trang Khác',
    icon: 'ri-file-text-line',
    submenu: [
      {
        label: 'Bảng Giá',
        link: '/pages/pricing',
      },
      {
        label: 'Câu hỏi Thường gặp',
        link: '/pages/faq',
      },
    ],
  },
];

const uiElementsMenu = [
  {
    label: 'Getting Started',
    icon: 'ri-pencil-ruler-2-line',
    submenu: [
      {
        label: 'Grid System',
        link: '/docs/layout/grid',
      },
      {
        label: 'Columns',
        link: '/docs/layout/columns',
      },
      {
        label: 'Gutters',
        link: '/docs/layout/gutters',
      },
    ],
  },
  {
    label: 'Components',
    icon: 'ri-suitcase-line',
    submenu: [
      {
        label: 'Accordion',
        link: '/docs/com/accordions',
      },
      {
        label: 'Alerts',
        link: '/docs/com/alerts',
      },
      {
        label: 'Avatars',
        link: '/docs/com/avatars',
      },
      {
        label: 'Badge',
        link: '/docs/com/badge',
      },
      {
        label: 'Breadcrumbs',
        link: '/docs/com/breadcrumbs',
      },
      {
        label: 'Buttons',
        link: '/docs/com/buttons',
      },
      {
        label: 'Cards',
        link: '/docs/com/cards',
      },
      {
        label: 'Carousel',
        link: '/docs/com/carousel',
      },
      {
        label: 'Dropdown',
        link: '/docs/com/dropdown',
      },
      {
        label: 'Images',
        link: '/docs/com/images',
      },
      {
        label: 'List Group',
        link: '/docs/com/listgroup',
      },
      {
        label: 'Markers',
        link: '/docs/com/markers',
      },
      {
        label: 'Modal',
        link: '/docs/com/modal',
      },
      {
        label: 'Nav & Tabs',
        link: '/docs/com/navtabs',
      },
      {
        label: 'Offcanvas',
        link: '/docs/com/offcanvas',
      },
      {
        label: 'Pagination',
        link: '/docs/com/pagination',
      },
      {
        label: 'Placeholders',
        link: '/docs/com/placeholders',
      },
      {
        label: 'Popovers',
        link: '/docs/com/popovers',
      },
      {
        label: 'Progress',
        link: '/docs/com/progress',
      },
      {
        label: 'Spinners',
        link: '/docs/com/spinners',
      },
      {
        label: 'Toast',
        link: '/docs/com/toasts',
      },
      {
        label: 'Tooltips',
        link: '/docs/com/tooltips',
      },
      {
        label: 'Tables',
        link: '/docs/com/tables',
      },
    ],
  },
  {
    label: 'Forms',
    icon: 'ri-list-check-2',
    submenu: [
      {
        label: 'Text Elements',
        link: '/docs/form/elements',
      },
      {
        label: 'Selects',
        link: '/docs/form/selects',
      },
      {
        label: 'Checks & Radios',
        link: '/docs/form/checksradios',
      },
      {
        label: 'Range',
        link: '/docs/form/range',
      },
      {
        label: 'Pickers',
        link: '/docs/form/pickers',
      },
      {
        label: 'Layouts',
        link: '/docs/form/layouts',
      },
    ],
  },
  {
    label: 'Charts & Graphs',
    icon: 'ri-bar-chart-2-line',
    submenu: [
      {
        label: 'ApexCharts',
        link: '/docs/chart/apex',
      },
      {
        label: 'Chartjs',
        link: '/docs/chart/chartjs',
      },
    ],
  },
  {
    label: 'Maps & Icons',
    icon: 'ri-stack-line',
    submenu: [
      {
        label: 'Leaflet Maps',
        link: '/docs/map/leaflet',
      },
      {
        label: 'Vector Maps',
        link: '/docs/map/vector',
      },
      {
        label: 'Remixicon',
        link: '/docs/icon/remix',
      },
      {
        label: 'Feathericons',
        link: '/docs/icon/feather',
      },
    ],
  },
  {
    label: 'Utilities',
    icon: 'ri-briefcase-4-line',
    submenu: [
      {
        label: 'Background',
        link: '/docs/util/background',
      },
      {
        label: 'Border',
        link: '/docs/util/border',
      },
      {
        label: 'Colors',
        link: '/docs/util/colors',
      },
      {
        label: 'Divider',
        link: '/docs/util/divider',
      },
      {
        label: 'Flex',
        link: '/docs/util/flex',
      },
      {
        label: 'Sizing',
        link: '/docs/util/sizing',
      },
      {
        label: 'Spacing',
        link: '/docs/util/spacing',
      },
      {
        label: 'Opacity',
        link: '/docs/util/opacity',
      },
      {
        label: 'Position',
        link: '/docs/util/position',
      },
      {
        label: 'Typography',
        link: '/docs/util/typography',
      },
      {
        label: 'Shadows',
        link: '/docs/util/shadows',
      },
      {
        label: 'Extras',
        link: '/docs/util/extras',
      },
    ],
  },
];

export { userMenu, applicationsMenu, pagesMenu, uiElementsMenu };
