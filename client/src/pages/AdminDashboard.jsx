import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from "axios";


Chart.register(...registerables);



const AdminDashboard = ({handleLogout}) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  // Sample data
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: [],
  });
 

  useEffect(() => {
    axios.get("http://localhost:3000/api/orders/recent-orders")
      .then((response) => setRecentOrders(response.data))
      .catch((error) => console.error("Error fetching recent orders:", error));
  }, []);

  const topSellingProducts = [
    { name: 'Nike Air Max', sales: 342, stock: 45 },
    { name: 'Adidas Ultraboost', sales: 278, stock: 12 },
    { name: 'Puma RS-X', sales: 195, stock: 32 },
    { name: 'New Balance 574', sales: 167, stock: 8 },
    { name: 'Vans Old Skool', sales: 132, stock: 56 }
  ];



  useEffect(() => {
    axios.get("http://localhost:3000/api/orders/sales/monthly")
      .then(res => {
        console.log(res.data); // Log the response data
        const months = res.data.map(item => item.month);
        const totals = res.data.map(item => item.total);
        
        const chartData = {
          labels: months,
          datasets: [
            {
              label: 'Sales',
              data: totals,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        };

        setSalesData(chartData);
      })
      .catch(err => console.error('Failed to fetch sales:', err));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
    
  }, []);
  {!stats && <div>Loading dashboard data...</div>}


  const displayStats = [
   
  ];

  const revenueData = {
    labels: ['Sneakers', 'Running', 'Casual', 'Sports', 'Sandals'],
    datasets: [
      {
        label: 'Revenue by Category',
        data: [12000, 8000, 5000, 3000, 2000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderWidth: 0
      }
    ]
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderStatusBadge = (status) => {
    const statusClasses = {
      'Completed': 'bg-success',
      'Shipped': 'bg-primary',
      'Processing': 'bg-warning',
      'Pending': 'bg-secondary'
    };
    return <span className={`badge ${statusClasses[status]}`}>{status}</span>;
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="container-fluid py-4">
            {/* Stats Cards */}
            {stats && (
  <div className="row mb-4 g-4">
    {[
      { title: "Today's Revenue", value: `$${stats.todayRevenue}`, change: '+12%', icon: 'bi bi-currency-dollar', color: 'primary' },
      { title: 'Total Orders', value: stats.totalOrders, change: '+5%', icon: 'bi bi-cart', color: 'success' },
      { title: 'Customers', value: stats.customers, change: '+8%', icon: 'bi bi-people', color: 'info' },
      { title: 'Low Stock', value: stats.lowStock, change: '', icon: 'bi bi-exclamation-triangle', color: 'warning' }
    ].map((stat, index) => (
      <div key={index} className="col-xl-3 col-md-6">
        <div className={`card border-start-${stat.color} border-0 shadow-sm h-100 py-2`}>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col">
                <div className="text-xs fw-bold text-uppercase mb-1">{stat.title}</div>
                <div className="h5 mb-0 fw-bold text-gray-800">{stat.value}</div>
                {stat.change && (
                  <div className="mt-2 text-success small">
                    <i className="bi bi-arrow-up me-1"></i>
                    {stat.change} from yesterday
                  </div>
                )}
              </div>
              <div className="col-auto">
                <i className={`${stat.icon} fs-2 text-gray-300`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

            {/* Charts Row */}
            <div className="row mb-4 g-4">
              <div className="col-lg-8">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="m-0 fw-bold">Sales Overview</h6>
                  </div>
                  <div className="card-body">
                    <Line
                      data={salesData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="m-0 fw-bold">Revenue by Category</h6>
                  </div>
                  <div className="card-body">
                    <Pie
                      data={revenueData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'right' }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 className="m-0 fw-bold">Recent Orders</h6>
                    <a href="#" className="btn btn-sm btn-outline-primary">View All</a>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order, index) => (
                            <tr key={index}>
                              <td className="fw-semibold">{order.Order_ID}</td>
                              <td>{order.Customer_ID}</td>
                              <td>{order.Tracking_Number}</td>
                              <td>{renderStatusBadge(order.Order_Status)}</td>
                              <td>{order.Total_Price}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary me-2">
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-secondary">
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="m-0 fw-bold">Top Selling Products</h6>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Product</th>
                            <th>Sales</th>
                            <th>Stock</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topSellingProducts.map((product, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-light rounded me-3" style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundImage: "url(https://via.placeholder.com/40)",
                                    backgroundSize: "cover"
                                  }}></div>
                                  <span>{product.name}</span>
                                </div>
                              </td>
                              <td>{product.sales}</td>
                              <td>
                                <span className={`badge ${product.stock < 20 ? 'bg-danger' : 'bg-success'}`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-arrow-up-right"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="m-0 fw-bold">Recent Activity</h6>
                  </div>
                  <div className="card-body">
                    <div className="timeline">
                      {[
                        { time: '2 mins ago', action: 'New order #RAV-1006 placed', icon: 'bi bi-cart-plus', color: 'primary' },
                        { time: '1 hour ago', action: 'Product "Nike Air Max" updated', icon: 'bi bi-pencil', color: 'info' },
                        { time: '3 hours ago', action: 'New customer registered', icon: 'bi bi-person-plus', color: 'success' },
                        { time: '5 hours ago', action: 'Low stock alert for Adidas Ultraboost', icon: 'bi bi-exclamation-triangle', color: 'warning' },
                        { time: '1 day ago', action: 'Monthly sales report generated', icon: 'bi bi-file-earmark-text', color: 'secondary' }
                      ].map((item, index) => (
                        <div key={index} className="timeline-item d-flex mb-3">
                          <div className={`timeline-icon bg-${item.color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '36px', height: '36px' }}>
                            <i className={item.icon}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-semibold">{item.action}</p>
                            <small className="text-muted">{item.time}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return <div className="container-fluid py-4">

        </div>;
      // Other cases (products, orders, etc.) would follow similar patterns
      default:
        return <div className="container-fluid py-4">Page content</div>;
    }
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div className={`bg-dark text-white ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
        width: isSidebarOpen ? '280px' : '80px',
        transition: 'width 0.3s ease'
      }}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-dark">
          {isSidebarOpen && <h5 className="mb-0 fw-bold">Rave Collection</h5>}
          <button
            className="btn btn-link text-white p-0"
            onClick={toggleSidebar}
          >
            <i className={`bi bi-${isSidebarOpen ? 'chevron-double-left' : 'chevron-double-right'}`}></i>
          </button>
        </div>

        <ul className="nav flex-column mt-3 px-2">
          {[
            { page: 'dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
            { page: 'products', icon: 'bi bi-box-seam', label: 'Products' },
            { page: 'orders', icon: 'bi bi-cart', label: 'Orders' },
            { page: 'customers', icon: 'bi bi-people', label: 'Customers' },
            { page: 'analytics', icon: 'bi bi-graph-up', label: 'Analytics' },
            { page: 'settings', icon: 'bi bi-gear', label: 'Settings' }
          ].map((item) => (
            <li key={item.page} className="nav-item mb-1">
              <button
                className={`nav-link text-white rounded-3 d-flex align-items-center ${activePage === item.page ? 'active bg-primary' : 'hover-bg-dark'}`}
                onClick={() => setActivePage(item.page)}
              >
                <i className={`${item.icon} me-3`} style={{ fontSize: '1.1rem' }}></i>
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            </li>
          ))}
          <li className="nav-item mt-4 mb-1">
            <button className="nav-link text-white rounded-3 d-flex align-items-center hover-bg-dark" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.1rem' }}></i>
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto">
        {/* Top navbar */}
        <nav className="navbar navbar-expand navbar-light bg-white shadow-sm sticky-top">
          <div className="container-fluid px-4">
            <div className="d-flex align-items-center w-100">
              <form className="d-flex w-100 me-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control border-start-0"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
              </form>

              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown mx-2">
                  <a className="nav-link position-relative" href="#" role="button" data-bs-toggle="dropdown">
                    <i className="bi bi-bell fs-5"></i>
                    <span className="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-danger">
                      3
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                    <h6 className="dropdown-header">Notifications</h6>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                      <div className="me-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2">
                          <i className="bi bi-cart-plus"></i>
                        </div>
                      </div>
                      <div>
                        <div>New order received</div>
                        <small className="text-muted">2 minutes ago</small>
                      </div>
                    </a>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                      <div className="me-3">
                        <div className="bg-warning bg-opacity-10 text-warning rounded-circle p-2">
                          <i className="bi bi-exclamation-triangle"></i>
                        </div>
                      </div>
                      <div>
                        <div>Low stock alert</div>
                        <small className="text-muted">1 hour ago</small>
                      </div>
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item text-center" href="#">View all</a>
                  </div>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                    <div className="me-2">
                      <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                        <span>AD</span>
                      </div>
                    </div>
                    {isSidebarOpen && <span className="d-none d-lg-inline">Admin</span>}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                    <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Profile</a></li>
                    <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#"><i className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;