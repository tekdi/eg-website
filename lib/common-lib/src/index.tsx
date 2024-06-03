import AppBar from './components/layout/AppBar'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin_layout/Layout'
import VolunteerAdminLayout from './components/volunteer-admin/Layout'
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
import SunbirdPlayer from './components/SunbirdPlayer'
import * as facilitatorRegistryService from './services/facilitatorRegistryService'
import * as enumRegistryService from './services/enumRegistryService'
import * as authRegistryService from './services/authRegistryService'
import * as uploadRegistryService from './services/uploadRegistryService'
import * as geolocationRegistryService from './services/geolocationRegistryService'
import * as benificiaryRegistoryService from './services/benificiaryRegistoryService'
import * as ObservationService from './services/ObservationService'
import * as campService from './services/campService'
import * as organisationService from './services/organisationService'
import * as cohortService from './services/cohortService'
import * as attendanceService from './services/attendanceService'
import * as ConsentService from './services/ConsentService'
import * as AgRegistryService from './services/AgRegistryService'
import { t, changeLanguage } from 'i18next'
import Camera from './components/Camera'
import ImageView from './components/ImageView'
import * as AdminTypo from './components/admin_component'
import * as FrontEndTypo from './components/frontend_component'
import CheatSheet from './components/CheatSheet'
import CustomOTPBox from './components/CustomOTPBox'
import * as eventService from './services/EventService'
import * as aadhaarService from './services/aadhaarService'
import * as OnestService from './services/OnestService'
import Alert from './components/Alert'
import GetEnumValue from './components/GetEnumValue'
import CustomAlert from './components/frontend_component/CustomAlert'
import ItemComponent from './components/ItemComponent'
import CardComponent from './components/frontend_component/CardComponent'
import TitleCard from './components/frontend_component/TitleCard'
import PoAdminLayout from './components/Po_admin_layout/Layout'
import { MapComponent } from './components/frontend_component/MapComponent'
import CustomRadio from './components/frontend_component/CustomRadio'
import CheckUncheck from './components/frontend_component/CheckUncheck'
import UserCard from './components/frontend_component/UserCard'
import Breadcrumb from './components/Breadcrumb'
import * as testRegistryService from './services/testRegistryService'
import * as volunteerRegistryService from './services/volunteerRegistryService'
import GeoLocation, {
  useLocationData
} from './components/frontend_component/GeoLocation'
import GATrackPageView from './services/AnalyticsService'

// export
export {
  AdminTypo,
  FrontEndTypo,
  AppBar,
  Header,
  Footer,
  Layout,
  AdminLayout,
  PoAdminLayout,
  SearchLayout,
  IconByName,
  Widget,
  Collapsible,
  Menu,
  SubMenu,
  initializeI18n,
  AppShell,
  ProgressBar,
  Tab,
  Loading,
  facilitatorRegistryService,
  authRegistryService,
  geolocationRegistryService,
  uploadRegistryService,
  AgRegistryService,
  testRegistryService,
  ImageView,
  t,
  changeLanguage,
  Camera,
  enumRegistryService,
  benificiaryRegistoryService,
  ObservationService,
  campService,
  cohortService,
  organisationService,
  attendanceService,
  ConsentService,
  CheatSheet,
  CustomOTPBox,
  eventService,
  aadhaarService,
  Alert,
  GetEnumValue,
  ItemComponent,
  CardComponent,
  TitleCard,
  Breadcrumb,
  MapComponent,
  CheckUncheck,
  CustomRadio,
  UserCard,
  GeoLocation,
  useLocationData,
  CustomAlert,
  SunbirdPlayer,
  GATrackPageView,
  OnestService,
  VolunteerAdminLayout,
  volunteerRegistryService
}

export * from './services/RestClient'
export * from './services/EventBus'
export * from './components/helper'
export * from './services/Telemetry'
export * from './components/calender'
export * from './components/layout/HeaderTags/index'
export * from './components/inputs'
export * from './config/constant'
