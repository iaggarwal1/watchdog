import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { Stack, HStack, VStack } from "@chakra-ui/react";
import { Icon, Box } from "@chakra-ui/react";
import { BiCurrentLocation } from "react-icons/bi";
import { BsArrowDown } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

const Location = () => {
  return (
    <>
      {/* <Icon as={BsArrowDown}></Icon> */}
      <Box bg="gray.200" h="100vh">
        <Stack  >
          <InputGroup
            bg="white"
            borderColor="black"
            ml={"2%"}
            mt={"2%"}
            w="12.5%"
            size="md"
          >
            <InputLeftElement pointerEvents="none">
              <BiCurrentLocation color="gray.300" />
            </InputLeftElement>
            <Input type="tel" placeholder="Origin" />
          </InputGroup>
          <InputGroup
            bg="white"
            borderColor="black"
            ml={"2%"}
            mt={"1%"}
            w="12.5%"
            size="md"
          >
            <InputLeftElement pointerEvents="none">
              <FaMapMarkerAlt color="gray.300" />
            </InputLeftElement>
            <Input type="tel" placeholder="Destination" />
          </InputGroup>
        </Stack>
        <Button colorScheme="blue" mt={"2%"} ml={"2%"}>
          Get Directions
        </Button>
      </Box>

      <Card></Card>
    </>
  );
};

export default Location;
