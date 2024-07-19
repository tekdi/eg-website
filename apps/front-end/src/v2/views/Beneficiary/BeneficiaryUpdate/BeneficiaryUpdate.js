import { useParams } from "react-router-dom";
import AddressEdit from "v2/components/Functional/LearnerUpdateDetail/address/addressEdit";
import BasicDetails from "v2/components/Functional/LearnerUpdateDetail/basicDetails/basicDetails";
import ContactDetailsEdit from "v2/components/Functional/LearnerUpdateDetail/contact-details/contactDetailsEdit";
import EducationDetails from "v2/components/Functional/LearnerUpdateDetail/education-details-further-studies/educationDetails";
import FutureStudy from "v2/components/Functional/LearnerUpdateDetail/education-details-further-studies/futureStudy";
import EnrollmentForm from "v2/components/Functional/LearnerUpdateDetail/enrollment/EnrollmentForm";
import FamilyDetails from "v2/components/Functional/LearnerUpdateDetail/family-details/familydetails";
import PersonalDetails from "v2/components/Functional/LearnerUpdateDetail/personal-details/personaldetails";
import ReferenceDetails from "v2/components/Functional/LearnerUpdateDetail/reference-details/referencedetails";

export default function BeneficiaryUpdate({ userTokenInfo, footerLinks }) {
  const { type } = useParams();
  const renderUpdateStep = () => {
    switch (type) {
      case "basic-info":
        return <BasicDetails />;
      case "contact-info":
        return <ContactDetailsEdit />;
      case "address":
        return <AddressEdit />;
      case "personal-details":
        return <PersonalDetails />;
      case "family-details":
        return <FamilyDetails />;
      case "education":
        return <EducationDetails />;
      case "future-education":
        return <FutureStudy userTokenInfo={userTokenInfo} />;
      case "enrollment-details":
        return <EnrollmentForm />;
      case "reference-details":
        return <ReferenceDetails />;
      default:
        return <BasicDetails />;
    }
  };

  return <>{renderUpdateStep()}</>;
}
