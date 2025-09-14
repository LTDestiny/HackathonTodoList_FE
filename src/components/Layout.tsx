import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useStore";
import { authApi } from "@/services/api";
import { logout } from "@/store/authSlice";
import naverLogo from "@/assets/naver-logo.svg";
import hackathonLogo from "@/assets/hackathon-graphic.svg";
import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  Bell,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Nhiệm vụ", href: "/tasks", icon: CheckSquare },
    { name: "Cài đặt", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-center p-6 bg-gray-900 border-b shadow-lg relative">
          <div className="flex items-center space-x-3">
            <img
              src={hackathonLogo}
              alt="Hackathon Logo"
              className="w-auto h-8 drop-shadow-md"
            />
            <div className="w-px h-8 bg-white/30"></div>
            <img
              src={naverLogo}
              alt="NAVER Logo"
              className="w-auto h-8 drop-shadow-md"
            />
          </div>
        </div>

        <nav className="px-2 mt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium mb-1 transition-colors
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 py-[0.64rem] bg-white border-b bg-card lg:px-6 shadow-sm dark:bg-gray-900">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-green-600">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">
                {location.pathname === "/dashboard" &&
                  "Theo dõi tiến độ công việc của bạn"}
                {location.pathname === "/tasks" &&
                  "Quản lý và tổ chức nhiệm vụ"}
                {location.pathname === "/settings" &&
                  "Tùy chỉnh cài đặt ứng dụng"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User profile - visible on mobile */}
            <div className="lg:hidden flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>

            {/* Quick actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Thống kê
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
                onClick={() => navigate("/tasks")}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Nhiệm vụ
              </Button>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-auto lg:p-6 min-h-0 relative">
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
