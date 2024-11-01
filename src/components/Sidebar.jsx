import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faServer,
  faDatabase,
  faUsers,
  faInbox,
  faCar,
  faUserShield,
  faBoxArchive,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import logo from '../logo.png';
import useAuth from "../hooks/useAuth";

const navItems = [
  { type: 'item', label: 'My Dashboard', to: '/myDashboard', icon: faDatabase },
  { type: 'item', label: 'Search All Players', to: '/players', icon: faUsers },
  { type: 'item', label: 'All Online Players', to: '/onlinePlayers', icon: faInbox },
  { type: 'item', label: 'Search All Characters', to: '/characters', icon: faBoxArchive },
  { type: 'item', label: 'Search Vehicles', to: '/vehicles', icon: faCar },
  { type: 'item', label: 'Staff Manager', to: '/staffManager', icon: faUserShield },
  { type: 'item', label: 'Logs', to: '/panelLogs', icon: faServer },
];

// Map roles to navigation items
const roleBasedNavItems = {
  3: navItems,                  // Owner can see all items
  2: navItems,                    // Dev can see all items
  1: [navItems[0], navItems[1]] // Admin can see only the first two items
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const role = auth?.role || 0; // Default to 'admin' if no roles found
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const toggleSidebarOnMobile = () => setIsOpenOnMobile(prev => !prev);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpenOnMobile) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isOpenOnMobile]);

  // Highlight active link
  const isActive = (path) => {
    if (path === '/players' && location.pathname.startsWith('/players')) return true;
    return location.pathname === path;
  };

  const renderNavItems = (items) => {
    return items.map((item, index) => (
      <li
        key={index}
        className={`nav-item ${isActive(item.to) ? 'active' : ''}`}
        onClick={() => {
          navigate(item.to);
          setIsOpenOnMobile(false); // Close sidebar on navigation in mobile view
        }}
      >
        <FontAwesomeIcon icon={item.icon} style={{ marginRight: '18px' }} />
        <span>{item.label}</span>
      </li>
    ));
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <div className="toggle-button" onClick={toggleSidebarOnMobile}>
        <FontAwesomeIcon icon={isOpenOnMobile ? faTimes : faBars} />
      </div>

      {/* Sidebar component */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isOpenOnMobile ? 'open' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav">
          {renderNavItems(roleBasedNavItems[role] || [])}
        </ul>
        {!isOpenOnMobile && (
          <div className="bottom-section toggle-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes} />
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
