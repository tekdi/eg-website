import { ChakraProvider, Container } from "@chakra-ui/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import MediaPage from "./content/MediaPage";
import UserDetailsForm from "./content/UserDetailsForm";
import AutomatedForm from "./job/AutomatedForm";
import List from "./List";
import View from "./View";

const App = () => {
  return (
    <ChakraProvider>
      <Container maxW="container.lg" mt={8}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:type" element={<List />} />
            <Route path="/:type/:jobId" element={<View />} />
            <Route
              path="/automatedForm/:jobId/:transactionId"
              element={<AutomatedForm />}
            />
            <Route path="/confirm/:itemId" element={<MediaPage />} />
            <Route path="/form" element={<UserDetailsForm />} />
          </Routes>
        </Router>
      </Container>
    </ChakraProvider>
  );
};

export default App;
