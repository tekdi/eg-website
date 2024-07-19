import React, { useState } from "react";
import { Box, Input, Button, Flex, FormControl, FormLabel } from "native-base";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../Layout";

const UserDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location?.state;
  const transactionId = state?.transactionId;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
  });

  // Define isLoading and error variables
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location && location.state) {
      navigate(`/confirm/${state.product?.item_id}`, {
        state: {
          formData: formData,
          product1: state.product,
          transactionId: transactionId,
        },
      });
    } else {
      console.error("Location or location.state is undefined");
    }
  };

  return (
    <Layout checkUserAccess>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box textAlign="center">
            <Loader />
          </Box>
        </div>
      ) : error ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box textAlign="center">
            <Text fontSize="xl">{error}</Text>
            <Button mt={4} className="custom-button" onClick={handleBack}>
              Go Back
            </Button>
          </Box>
        </div>
      ) : (
        <Box
          maxW="800px"
          mx="auto"
          mt="10"
          p={{ base: "1rem", md: "1rem", lg: "2rem" }}
        >
          <form onSubmit={handleSubmit}>
            <Flex mb="4">
              <FormControl id="name" mr="2">
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Flex>
            <Flex mb="4">
              <FormControl id="phone" mr="2">
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl id="age">
                <FormLabel>Age</FormLabel>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Flex>
            <Button
              type="submit"
              colorScheme="green"
              variant="solid"
              backgroundColor="rgb(62, 97, 57)"
              color="white"
            >
              Submit
            </Button>
          </form>
        </Box>
      )}
    </Layout>
  );
};

export default UserDetailsForm;
