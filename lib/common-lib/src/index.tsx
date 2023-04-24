import AppBar from './components/layout/AppBar'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin_layout/Layout'
import SearchLayout from './components/SearchLayout'
import IconByName from './components/IconByName'
import Widget from './components/Widget'
import Collapsible from './components/Collapsible'
import Menu, { SubMenu } from './components/Menu'
import initializeI18n from './services/i18n'
import AppShell from './components/AppShell'
import ProgressBar from './components/ProgressBar'
import Tab from './components/Tab'
import Loading from './components/Loading'
import FilterButton from './components/FilterButton'
import * as teacherRegistryService from './services/teacherRegistryService'
import * as classRegistryService from './services/classRegistryService'
import * as attendanceRegistryService from './services/attendanceRegistryService'
import * as studentRegistryService from './services/studentRegistryService'
import * as worksheetRegistryService from './services/worksheetRegistryService'
import * as questionRegistryService from './services/questionRegistryService'
import * as likeRegistryService from './services/likeRegistryService'
import * as commentRegistryService from './services/commentRegistryService'
import * as assessmentRegistryService from './services/assessmentRegistryService'
import * as facilitatorRegistryService from './services/facilitatorRegistryService'
import { getApiConfig } from './services/configApiRegistryService'
import { t } from 'i18next'
import Camera from './components/Camera'

export {
  AppBar,
  Header,
  Footer,
  Layout,
  AdminLayout,
  SearchLayout,
  IconByName,
  FilterButton,
  Widget,
  Collapsible,
  Menu,
  SubMenu,
  initializeI18n,
  AppShell,
  ProgressBar,
  Tab,
  Loading,
  teacherRegistryService,
  classRegistryService,
  attendanceRegistryService,
  studentRegistryService,
  worksheetRegistryService,
  questionRegistryService,
  likeRegistryService,
  commentRegistryService,
  assessmentRegistryService,
  facilitatorRegistryService,
  getApiConfig,
  t,
  Camera
}

export * from './services/Auth'
export * from './services/RestClient'
export * from './services/EventBus'
export * from './components/helper'
export * from './services/Telemetry'
export * from './components/calender'
export * from './components/layout/HeaderTags/index'
