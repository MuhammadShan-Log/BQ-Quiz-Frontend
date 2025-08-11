import { useState } from "react";
import {
  Home,
  PlusCircle,
  List,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import CreateQuizPage from "../../components/createQuiz";

const TeacherDashboard = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("/dashboard");

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="icon" />,
    },
    {
      name: "Create Quiz",
      href: "/create-quiz",
      icon: <PlusCircle className="icon" />,
    },
    {
      name: "All Quizzes",
      href: "/all-quizzes",
      icon: <List className="icon" />,
    },
    {
      name: "Quiz Responses",
      href: "/quiz-responses",
      icon: <FileText className="icon" />,
    },
  ];

  const renderNav = () => (
    <nav className="nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`nav-item ${
                currentPage === item.href ? "nav-item-active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.href);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="icon-container">{item.icon}</span>
              {!isCollapsed && <span className="nav-text">{item.name}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  const renderContent = () => {
    switch (currentPage) {
      case "/create-quiz":
        return <CreateQuizPage />;
      case "/all-quizzes":
        return (
          <div className="content-card">
            <h2 className="content-title">All Quizzes</h2>
            <p className="content-text">
              View and manage all your created quizzes.
            </p>
          </div>
        );
      case "/quiz-responses":
        return (
          <div className="content-card">
            <h2 className="content-title">Quiz Responses</h2>
            <p className="content-text">
              Review student responses and quiz performance.
            </p>
          </div>
        );
      case "/dashboard":
      default:
        return (
          <div className="content-card">
            <h2 className="content-title">Welcome, Teacher</h2>
            <p className="content-text">
              Welcome to the Teacher Dashboard. Use the sidebar to create
              quizzes, view all quizzes, or check quiz responses.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar - Desktop */}
      <div className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h1 className="sidebar-title">Quiz Dashboard</h1>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="toggle-button"
          >
            {isCollapsed ? (
              <ChevronRight className="icon" />
            ) : (
              <ChevronLeft className="icon" />
            )}
          </button>
        </div>

        {renderNav()}

        {!isCollapsed && (
          <div className="profile">
            <div className="profile-info">
              <div className="profile-avatar">
                <span className="avatar-text">T</span>
              </div>
              <div className="profile-details">
                <p className="profile-name">Teacher Name</p>
                <p className="profile-email">teacher@example.com</p>
              </div>
            </div>
            <div className="profile-role">Teacher</div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar (Drawer style) */}
      <div
        className={`mobile-sidebar ${
          isMobileMenuOpen ? "mobile-sidebar-open" : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className="mobile-sidebar-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-sidebar-header">
            <h1 className="sidebar-title">Quiz Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="toggle-button"
            >
              <ChevronLeft className="icon" />
            </button>
          </div>
          {renderNav()}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="mobile-header">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="menu-button"
          >
            <Menu className="icon menu-icon" />
          </button>
          <h2 className="mobile-title">Teacher Dashboard</h2>
          <div className="spacer"></div>
        </div>

        <div className="content-area">{children || renderContent()}</div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
