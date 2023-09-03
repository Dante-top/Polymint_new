import { Box, Container, Flex, HStack } from '@chakra-ui/react';
import { ColorModeButton, BNMLogo, NavBar } from 'components/elements';
import { Web3Button } from '@web3modal/react';

const Header = () => {
  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color">
      <Container maxW="container.xl" p={'10px'}>
        <Flex align="center" justify="space-between">
          <BNMLogo />
          <NavBar />
          <HStack gap={'10px'}>
            <Web3Button icon="show" label="Connect Wallet" />
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
