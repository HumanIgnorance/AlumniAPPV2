"use client"

import { useState, useMemo, useEffect } from "react"
import { useQueryClient } from "react-query"
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Typography,
  Space,
  Divider,
  List,
  Tabs,
  Badge,
  Modal,
  Form,
  Tooltip,
  Statistic,
  message,
  Table,
  Checkbox,
} from "antd"
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  FolderOutlined,
  PrinterOutlined,
  FilePdfOutlined,
  BellOutlined,
  StarOutlined,
  UnorderedListOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import moment from "moment"
import "./styles";
import "~/styles/printPreview.css"
import { Layout, AlumniDetails } from "~/components"
import { exportElementToPdf } from "~/utils/exportPdf"
import useAlumni from "~/hooks/useAlumni"
import useAlumniDirectory from "~/hooks/useAlumniDirectory"
import useEmployeeStatus from "~/hooks/useEmployeeStatus"
import useQuizResult from "~/hooks/useQuizResult"
import axiosConfig from "~/utils/axiosConfig"
import { BASE_URL } from "~/utils/constant"
import logo from "~/assets/images/OCC_LOGO.png"
import { COLORS } from "~/config/theme";
import { ROLES } from "~/config/roles";
import { getUserRole } from "~/utils/session";
import { useIsTouchDevice } from "~/hooks/useIsTouchDevice";
import { employmentStatusOptions, courseFolders } from "~/pages/admin/alumni/parts/alumniListConstants";
import { StatusUpdateModal, BulkStatusUpdateModal } from "~/pages/admin/alumni/parts/StatusModals";
import { AlumniCard, NewRegisteredCard } from "~/pages/admin/alumni/parts/AlumniCards";
import { CourseFolderModal } from "~/pages/admin/alumni/parts/CourseFolderModal";

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

const AlumniList = () => {
  const role = getUserRole()
  // GET /alumni (useAlumni) is role:admin-gated on the backend by
  // design (see routes/api.php — regular alumni are not authorized to
  // enumerate every other alumni's full record). This page is reused
  // for both the admin route and the alumni-facing "/alumni" nav link
  // ("Browse the OCC Alumni Directory..." below), so it needs the right
  // data source per role: admins get the full admin record set, everyone
  // else gets the minimized public-safe directory.
  const isAdminRole = role === ROLES.ADMIN
  const queryClient = useQueryClient()
  const adminAlumniQuery = useAlumni({ enabled: isAdminRole })
  const directoryQuery = useAlumniDirectory({ enabled: !isAdminRole })
  const { isLoading, data: alumni = [], isFetching, refetch } = isAdminRole
    ? adminAlumniQuery
    : directoryQuery
  const { data: statuses } = useEmployeeStatus()
  const { data: quizResults = [] } = useQuizResult()
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false)
  const [selectedAlumnus, setSelectedAlumnus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  const [courseFolderVisible, setCourseFolderVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // ============ MULTI-SELECT STATES ============
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedAlumniIds, setSelectedAlumniIds] = useState([])
  const [isBulkStatusModalVisible, setIsBulkStatusModalVisible] = useState(false)
  const [bulkStatusUpdateLoading, setBulkStatusUpdateLoading] = useState(false)
  // ============ END MULTI-SELECT STATES ============

  
  const [form] = Form.useForm()

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    employmentStatus: "all",
    status: "all",
    major: "all",
    graduationYear: "all",
    featured: "all",
  })

  // ============ HEARTBEAT EFFECT ============
  // Heartbeat is handled globally by the MainLayout component (index.js).
  // Having it here too would create duplicate requests whenever this page
  // is open. The global heartbeat already fires on mount, every 2 minutes,
  // and on tab-visibility / network-reconnect events.
  // ============ END HEARTBEAT EFFECT ============

// ============ ONLINE STATUS POLLING ============
// Phase 1 fix (see audit §2, finding "Main finding — wasteful duplicate
// fetch, polled every 30s"): this used to throw away the online-statuses
// response and call refetch() instead, which re-ran the full paginated
// /alumni (or /alumni/directory) query — with all its eager loads — every
// 30 seconds per open tab, for every admin. Now we merge the small
// {id, is_online, last_active} deltas directly into the existing
// react-query cache with setQueryData, so no extra full-table request
// ever fires from this poll.
useEffect(() => {
  const queryKey = isAdminRole ? ["alumini"] : ["alumni-directory"]

  const fetchOnlineStatuses = async () => {
    try {
      const response = await axiosConfig.get(BASE_URL + "api/alumni/online-statuses")
      if (response.data.success) {
        const statusById = new Map(
          response.data.data.map((s) => [s.id, s])
        )

        queryClient.setQueryData(queryKey, (previous = []) => {
          if (!Array.isArray(previous)) return previous
          return previous.map((alumnus) => {
            const status = statusById.get(alumnus.id)
            if (!status) return alumnus
            // Only touch the two fields the poll actually knows about;
            // leave the rest of the cached alumnus record untouched.
            if (
              alumnus.is_online === status.is_online &&
              alumnus.last_active === status.last_active
            ) {
              return alumnus
            }
            return {
              ...alumnus,
              is_online: status.is_online,
              last_active: status.last_active,
            }
          })
        })
      }
    } catch (error) {
      console.error("Error fetching online statuses:", error)
    }
  }

  // Poll every 30 seconds for online status updates
  const statusInterval = setInterval(fetchOnlineStatuses, 30 * 1000)

  return () => clearInterval(statusInterval)
}, [isAdminRole, queryClient])
// ============ END ONLINE STATUS POLLING ============


  const [sortBy, setSortBy] = useState("name-asc")

  const handleView = (values) => {
    // Resolve the course_code so AlumniDetails picks the right header theme
    // for every course (not just BSIT), the same way AlumniRegistration does.
    const matchedCourseFolder = courseFolders.find(
      (c) => c.id === values.course_id,
    );
    const resolvedCourseCode =
      values.course?.course_code || matchedCourseFolder?.code || "";

    const previewData = {
      // Personal Information
       id: values.id,
      // Admin-controlled approval status ("pending" | "approved" | "rejected").
      // AlumniDetails uses this to decide whether the header pill reads
      // "Verify OCC Graduate" or "Verified OCC Graduate".
      status: values.status,
      first_name: values.first_name,
      last_name: values.last_name,
      middle_name: values.middle_name,
      suffix: values.suffix,
      email: values.email,
      phone: values.phone,
      address: values.address,
      birth_date: values.birth_date,
      gender: values.gender,
      bio: values.bio,

      // Academic Information
      course_id: values.course_id,
      course_code: resolvedCourseCode,
      student_id: values.student_id,
      graduation_year: values.graduation_year,
      enrollment_year: values.enrollment_year,
      honors:
        typeof values.honors === "string" && values.honors.trim() !== ""
          ? JSON.parse(values.honors)
          : Array.isArray(values.honors)
            ? values.honors
            : [],
      thesis_title: values.thesis_title,
      academic_achievements: values.academic_achievements,
      extracurricular: values.extracurricular,
      continue_education: values.continue_education,

      // Career Information
      employment_status_id: values.employment_status_id,
      current_company: values.current_company,
      job_title: values.job_title,
      industry: values.industry,
      years_experience: values.years_experience,
      salary_range: values.salary_range,
      work_location: values.work_location,
      career_goals: values.career_goals,
      previous_companies: values.previous_companies,

      // Social media
      linkedin: values.linkedin,
      github: values.github,
      portfolio: values.portfolio,
      twitter: values.twitter,

      // Preferences
      newsletter: values.newsletter,
      contactPermission: values.contactPermission,
      agreement: values.agreement,

      // Files
      // NOTE: the API field is `documents` (see AlumniSelfResource:
      // 'documents' => $this->document_urls) — not `document_urls`.
      // Reading the wrong key here meant idDocuments was always [],
      // so AlumniDetails never showed any uploaded documents.
      profileImage: values?.profile_image_url,
      idDocuments: values?.documents || [],
    }

    setPreviewData(previewData)
    setIsModalVisible(true)
  }

  const handleOpenCourseFolder = (course) => {
    setSelectedCourse(course)
    setCourseFolderVisible(true)
  }

  const handleStatusUpdate = (alumnus, status) => {
    setSelectedAlumnus(alumnus)
    setSelectedStatus(status)
    setIsStatusModalVisible(true)
  }

  const handleStatusSubmit = async (formData) => {
    setStatusUpdateLoading(true)
    formData.id = selectedAlumnus.id
    try {
      // Simulate delay (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await axiosConfig.post(BASE_URL + "api/alumni/update-stastus", formData)

      message.success(`Successfully updated ${selectedAlumnus.first_name}'s status to ${formData.status}`)

      setIsStatusModalVisible(false)
      setSelectedAlumnus(null)
      setSelectedStatus(null)
      form.resetFields()
      // If you're using data-fetching hooks:
      refetch()
    } catch (error) {
      console.error(error)
      message.error("Failed to update status. Please try again.")
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  // ============ MULTI-SELECT HANDLERS ============
  const handleSelectModeToggle = () => {
    setIsSelectMode(!isSelectMode)
    if (isSelectMode) {
      setSelectedAlumniIds([])
    }
  }

  const handleSelectAll = () => {
    if (selectedAlumniIds.length === filteredAndSortedAlumni.length) {
      setSelectedAlumniIds([])
    } else {
      setSelectedAlumniIds(filteredAndSortedAlumni.map((a) => a.id))
    }
  }

  const handleAlumniSelectChange = (alumniId, isChecked) => {
    if (isChecked) {
      setSelectedAlumniIds((prev) => [...prev, alumniId])
    } else {
      setSelectedAlumniIds((prev) => prev.filter((id) => id !== alumniId))
    }
  }

  const handleBulkEditStatus = () => {
    if (selectedAlumniIds.length === 0) {
      message.warning("Please select at least one alumni")
      return
    }
    setIsBulkStatusModalVisible(true)
  }

  const handleBulkStatusSubmit = async (formData) => {
    setBulkStatusUpdateLoading(true)
    try {
      // Process each selected alumni
      for (const alumniId of selectedAlumniIds) {
        const payload = {
          ...formData,
          id: alumniId,
        }
        await axiosConfig.post(BASE_URL + "api/alumni/update-stastus", payload)
      }

      message.success(`Successfully updated ${selectedAlumniIds.length} alumni to ${formData.status}`)

      setIsBulkStatusModalVisible(false)
      setSelectedAlumniIds([])
      setIsSelectMode(false)
      refetch()
    } catch (error) {
      console.error(error)
      message.error("Failed to update status. Please try again.")
    } finally {
      setBulkStatusUpdateLoading(false)
    }
  }

  const getSelectedAlumniData = () => {
    return alumni.filter((a) => selectedAlumniIds.includes(a.id))
  }
  // ============ END MULTI-SELECT HANDLERS ============

  // Filter and sort alumni
  const filteredAndSortedAlumni = useMemo(() => {
    const filtered = alumni.filter((alumnus) => {
      // Non-admins should never see rejected alumni
      if (role !== ROLES.ADMIN && alumnus.status === "rejected") {
        return false
      }

      // Rejected alumni have their own dedicated tab, so keep them out of
      // the "All Alumni" tab (and its count) even for admins.
      if (activeTab === "all" && alumnus.status === "rejected") {
        return false
      }

      // Tab filter
      if (activeTab === "new_registered") {
        // Show only approved alumni registered in the last 7 days
        if (!alumnus.created_at) return false
        const created = moment(alumnus.created_at)
        const now = moment()
        if (now.diff(created, "days") > 7 || alumnus.status !== "approved") return false
      } else if (activeTab !== "all" && alumnus.status !== activeTab) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()

        const firstName = alumnus?.first_name?.toLowerCase() || ""
        const lastName = alumnus?.last_name?.toLowerCase() || ""

        const matchesSearch = firstName.includes(searchLower) || lastName.includes(searchLower)

        if (!matchesSearch) return false
      }

           // Employment status filter - handle underscore vs space difference
      if (filters.employmentStatus.toLowerCase() !== "all") {
        const filterValue = filters.employmentStatus.toLowerCase().replace(/_/g, " ")
        const alumniValue = alumnus?.employment_status?.status_name?.toLowerCase() || ""
        if (alumniValue !== filterValue) {
          return false
        }
      }
      

      
      

      // Status filter
      if (filters.status !== "all" && alumnus.status !== filters.status) {
        return false
      }

      // Major filter
      if (filters.major !== "all" && alumnus.major !== filters.major) {
        return false
      }

      // Featured filter
      if (filters.featured !== "all") {
        const isFeatured = filters.featured === "featured"
        if (alumnus.isFeatured !== isFeatured) return false
      }

      return true
    })

    // Sort alumni
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a?.name?.localeCompare(b.name)
        case "name-desc":
          return b?.name?.localeCompare(a.name)
        case "graduation-desc":
          return b?.graduationYear - a?.graduationYear
        case "graduation-asc":
          return a?.graduationYear - b?.graduationYear
        case "salary-desc":
          return (b?.salary || 0) - (a?.salary || 0)
        case "salary-asc":
          return (a?.salary || 0) - (b?.salary || 0)
        case "lastActive-desc":
          return moment(b?.lastActive).diff(moment(a?.lastActive))
        default:
          return 0
      }
    })

    return filtered
  }, [alumni, activeTab, filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      employmentStatus: "all",
      status: "all",
      major: "all",
      graduationYear: "all",
      featured: "all",
    })
  }

  

  // "New Registered" = approved alumni accounts created within the last 7 days
  const newRegisteredAlumni = useMemo(() => {
    return alumni.filter((a) => {
      if (!a.created_at) return false
      const created = moment(a.created_at)
      const now = moment()
      return now.diff(created, "days") <= 7 && a.status === "approved"
    })
  }, [alumni])

  const stats = {
    total: alumni.filter((a) => a.status !== "rejected").length,
    employed: alumni.filter((a) => a.status !== "rejected" && a.employment_status_id === 1).length,
    unemployed: alumni.filter((a) => a.status !== "rejected" && a.employment_status_id === 2).length,
    underEmployed: alumni.filter((a) => a.status !== "rejected" && a.employment_status_id === 3).length,
    graduateSchool: alumni.filter((a) => a.status !== "rejected" && a.employmentStatus === "graduate_school").length,
    pending: alumni.filter((a) => a.status === "pending").length,
    approved: alumni.filter((a) => a.status === "approved").length,
    newRegistered: newRegisteredAlumni.length,
    rejected: alumni.filter((a) => a.status === "rejected").length,
    // inactive: alumni.filter((a) => a.status === "inactive").length,
  }

  return (
    <Layout>
      <div className="alumni-list-container">
               {/* Header Section — Modern Hero */}
        <section className="ae-hero">
          <div className="ae-hero__bg" aria-hidden>
            <span className="blob blob-1" />
            <span className="blob blob-2" />
            <span className="blob blob-3" />
            <div className="dot-grid" />
          </div>

          <div className="ae-hero__content">
            <div className="ae-hero__brand">
              <img src={logo} alt="OCC Logo" className="ae-hero__logo" />
              <div className="ae-hero__brand-meta">
                <Tag className="ae-chip" icon={<TeamOutlined />}>
                  ALUMNI DIRECTORY
                </Tag>
                <Text className="ae-hero__eyebrow">
                  Alumni Tracing Management System
                </Text>
              </div>
            </div>

            <Title className="ae-hero__title">
              Alumni{" "}
              <span className="grad-text"> Directory</span>
            </Title>

            <Paragraph className="ae-hero__lead">
           {role === ROLES.ADMIN
  ? "Manage and connect with OCC alumni. Track employment status, engagement, and graduate outcomes across every batch."
  : "Browse the OCC Alumni Directory, connect with fellow graduates, and build meaningful professional relationships within the alumni community."
}
            </Paragraph>

            <div className="ae-hero__stats">
              <div className="ae-stat">
                <span className="ae-stat__icon"><TeamOutlined /></span>
                <div className="ae-stat__body">
                  <span className="ae-stat__value">{stats.total}</span>
                  <span className="ae-stat__label">Total Alumni</span>
                </div>
              </div>
              <div className="ae-stat">
                <span className="ae-stat__icon ae-stat__icon--green"><CheckCircleOutlined /></span>
                <div className="ae-stat__body">
                  <span className="ae-stat__value">{stats.employed}</span>
                  <span className="ae-stat__label">Employed</span>
                </div>
              </div>
              <div className="ae-stat">
                <span className="ae-stat__icon ae-stat__icon--gray"><StopOutlined /></span>
                <div className="ae-stat__body">
                  <span className="ae-stat__value">{stats.unemployed}</span>
                  <span className="ae-stat__label">Seeking Work</span>
                </div>
              </div>
              <div className="ae-stat">
                <span className="ae-stat__icon ae-stat__icon--blue"><ClockCircleOutlined /></span>
                <div className="ae-stat__body">
                  <span className="ae-stat__value">{stats.underEmployed}</span>
                  <span className="ae-stat__label">Under Employed</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <br></br>

        {role === ROLES.ADMIN && (
          <>
            <Card
              title={
                <Space>
                  <FolderOutlined />
                  <span className="ant-typography">Course Folders</span>
                </Space>
              }
              style={{ marginBottom: "20px" }}
            >
              <Row gutter={[16, 16]}>
                {courseFolders.map((course) => {
                  const courseAlumniCount = alumni.filter(
                    (a) => a.course_id === course.id && a.status !== "rejected",
                  ).length
                  const employedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.status !== "rejected" && a.employment_status_id === 1,
                  ).length
                  const unemployedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.status !== "rejected" && a.employment_status_id === 2,
                  ).length
                  const underEmployedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.status !== "rejected" && a.employment_status_id === 3,
                  ).length

                  return (
                    <Col xs={24} sm={12} md={6} key={course.id}>
                      <Card
                        hoverable
                        onClick={() => handleOpenCourseFolder(course)}
                        style={{
                          borderLeft: `4px solid ${course.color}`,
                          cursor: "pointer",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ textAlign: "center" }}>
                            <FolderOutlined
                              style={{
                                fontSize: "48px",
                                color: course.color,
                              }}
                            />
                          </div>
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              textAlign: "center",
                              color: course.color,
                            }}
                          >
                            {course.code}
                          </Title>
                          <Text
                            type="secondary"
                            style={{
                              textAlign: "center",
                              display: "block",
                              fontSize: "12px",
                            }}
                          >
                            {course.name}
                          </Text>
                          <Divider style={{ margin: "8px 0" }} />
                          <div>
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text strong>Total:</Text>
                                <Badge
                                  count={courseAlumniCount}
                                  style={{
                                    backgroundColor: course.color,
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Employed:</Text>
                                <Text style={{ color: COLORS.antdGreen }}>{employedCount}</Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Unemployed:</Text>
                                <Text style={{ color: COLORS.antdRed }}>{unemployedCount}</Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Under Emp:</Text>
                                <Text style={{ color: COLORS.antdGold }}>{underEmployedCount}</Text>
                              </div>
                            </Space>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </Card>
          </>
        )}

        {role === ROLES.ADMIN && (
          <Card className="tabs-card">
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="status-tabs">
              <TabPane
                tab={
                  <span>
                    <TeamOutlined />
                    All Alumni
                    <Badge
                      count={stats.total}
                      style={{
                        backgroundColor: COLORS.antdGreen,
                        marginLeft: 8,
                      }}
                    />
                  </span>
                }
                key="all"
              />
              <TabPane
                tab={
                  <span>
                    <ClockCircleOutlined />
                    Pending Review
                    <Badge
                      count={stats.pending}
                      style={{
                        backgroundColor: COLORS.antdGold,
                        marginLeft: 8,
                      }}
                    />
                  </span>
                }
                key="pending"
              />
              <TabPane
                tab={
                  <span>
                    <CheckCircleOutlined />
                    Approved
                    <Badge
                      count={stats.approved}
                      style={{
                        backgroundColor: COLORS.antdGreen,
                        marginLeft: 8,
                      }}
                    />
                  </span>
                }
                key="approved"
              />
              <TabPane
                tab={
                  <span>
                    <BellOutlined />
                    New Registered
                    <Badge
                      count={stats.newRegistered}
                      style={{
                        backgroundColor: COLORS.antdBlue,
                        marginLeft: 8,
                      }}
                    />
                  </span>
                }
                key="new_registered"
              />
              {role === ROLES.ADMIN && (
                <TabPane
                  tab={
                    <span>
                      <CloseCircleOutlined />
                      Account Rejected
                      <Badge
                        count={stats.rejected}
                        style={{
                          backgroundColor: COLORS.antdRed,
                          marginLeft: 8,
                        }}
                      />
                    </span>
                  }
                  key="rejected"
                />
              )}
              {/* <TabPane
                tab={
                  <span>
                    <StopOutlined />
                    Inactive
                    <Badge
                      count={stats.inactive}
                      style={{
                        backgroundColor: "#ff4d4f",
                        marginLeft: 8,
                      }}
                    />
                  </span>
                }
                key="inactive"
              /> */}
            </Tabs>
          </Card>
        )}

        {/* Controls Section */}
        <Card className="controls-card">
          <div className="controls-section">
            <div className="controls-left">
              <Input
                placeholder="Search alumni by name, email, major, skills..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{ width: 300 }}
                size="large"
              />

              <Select
                value={filters.employmentStatus}
                onChange={(value) => handleFilterChange("employmentStatus", value)}
                style={{ width: 180 }}
                placeholder="Employment Status"
              >
                {employmentStatusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    <Tag color={option.color}>{option.label}</Tag>
                  </Option>
                ))}
              </Select>

              {/* ============ SELECT MODE CONTROLS ============ */}
              {role === ROLES.ADMIN && (
                <div className="select-mode-controls">
                  <Button
                    type={isSelectMode ? "primary" : "default"}
                    onClick={handleSelectModeToggle}
                  >
                    {isSelectMode ? "Cancel Select" : "Select"}
                  </Button>

                  {isSelectMode && (
                    <>
                      <Button onClick={handleSelectAll}>
                        {selectedAlumniIds.length === filteredAndSortedAlumni.length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleBulkEditStatus}
                        disabled={selectedAlumniIds.length === 0}
                      >
                        Edit Status ({selectedAlumniIds.length})
                      </Button>
                    </>
                  )}
                </div>
              )}
              {/* ============ END SELECT MODE CONTROLS ============ */}
            </div>
          </div>
        </Card>

        {/* Alumni Display */}
        <div className="alumni-display">
          {isLoading ? null : filteredAndSortedAlumni.length === 0 ? (
            <Card className="no-alumni-card">
              <div className="no-alumni-content">
                <Title level={3}>
                  {activeTab === "new_registered" ? "No new registrations found" : "No alumni found"}
                </Title>
                <Text type="secondary">
                  {activeTab === "new_registered"
                    ? "There are no newly approved alumni accounts registered in the last 7 days."
                    : "Try adjusting your filters or search terms to find alumni"}
                </Text>
                <br />
                <Button type="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </Card>
          ) : activeTab === "new_registered" ? (
            <>
              {/* Info banner for new registered tab */}
              <Card
                style={{
                  marginBottom: 16,
                  borderLeft: "4px solid #1890ff",
                  background: "#f0f9ff",
                }}
                bodyStyle={{ padding: "10px 16px" }}
              >
                <Space>
                  <BellOutlined style={{ color: COLORS.antdBlue, fontSize: 16 }} />
                  <Text style={{ color: COLORS.antdBlue }}>
                    <strong>New Registered Alumni</strong> — Showing approved accounts registered within the last 7 days.
                    Quiz badges indicate which quizzes each alumni has completed.
                  </Text>
                </Space>
              </Card>
              <Row gutter={[24, 24]}>
                {filteredAndSortedAlumni.map((alumnus) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={alumnus.id}>
                    <NewRegisteredCard
                      alumnus={alumnus}
                      handleView={handleView}
                      handleStatusUpdate={handleStatusUpdate}
                      quizResults={quizResults}
                    />
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredAndSortedAlumni.map((alumnus) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={alumnus.id}>
                  <AlumniCard 
                    alumnus={alumnus} 
                    handleView={handleView} 
                    handleStatusUpdate={handleStatusUpdate}
                    isSelectable={isSelectMode}
                    isSelected={selectedAlumniIds.includes(alumnus.id)}
                    onSelectChange={handleAlumniSelectChange}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Alumni Details Modal */}
        <AlumniDetails
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
          }}
          onSubmit={() => { }}
          previewData={previewData}
          refetchAlumni={refetch}  
          viewOnly={true}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          visible={isStatusModalVisible}
          onCancel={() => {
            setIsStatusModalVisible(false)
            setSelectedAlumnus(null)
            setSelectedStatus(null)
          }}
          onOk={handleStatusSubmit}
          alumnus={selectedAlumnus}
          loading={statusUpdateLoading}
          statuses={statuses}
        />

        {/* Bulk Status Update Modal */}
        <BulkStatusUpdateModal
          visible={isBulkStatusModalVisible}
          onCancel={() => {
            setIsBulkStatusModalVisible(false)
          }}
          onOk={handleBulkStatusSubmit}
          selectedAlumni={getSelectedAlumniData()}
          loading={bulkStatusUpdateLoading}
          statuses={statuses}
        />

        {selectedCourse && (
          <CourseFolderModal
            visible={courseFolderVisible}
            onCancel={() => {
              setCourseFolderVisible(false)
              setSelectedCourse(null)
            }}
            course={selectedCourse}
            alumni={alumni}
            handleView={handleView}
          />
        )}
      </div>
    </Layout>
  )
}

export default AlumniList