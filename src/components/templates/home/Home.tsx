import { CheckCircleIcon, SettingsIcon } from '@chakra-ui/icons';
import { Heading, VStack, List, ListIcon, ListItem, Stack, Box, Text, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface itemsType {
  title: string | null;
  description: string | null;
  link: string | null;
}

interface featureType {
  title: string | null;
  desc: string | null;
}

const Home = () => {
  const [news, setNews] = useState<itemsType[]>([]);
  const Parser = require('rss-parser');
  const parser = new Parser();

  const url = 'https://rss.app/feeds/g9tevEQUkRznLvwH.xml';

  useEffect(() => {
    async function getNews() {
      const text: string = await fetch(url).then((r) => r.text());
      const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
      const items: {
        title: string | null;
        description: string | null;
        link: string | null;
      }[] = Array.from(xmlDoc.querySelectorAll('item')).map((item) => ({
        title: item?.querySelector('title')?.textContent ?? null,
        description: item?.querySelector('description')?.childNodes[0]?.nodeValue ?? null,
        link: item?.querySelector('link')?.textContent ?? null,
      }));
      setNews(items);
    }
    getNews();
  }, []);

  function Feature({ title, desc, ...rest }: featureType) {
    return (
      <Box p={5} shadow="md" borderWidth="1px" {...rest}>
        <Heading fontSize="lg">{title}</Heading>
        <Text mt={4}>{`${desc?.slice(0, 38)}...`}</Text>
        <Link color="teal.500" href={desc ? desc : ''} isExternal>
          Read More...
        </Link>
      </Box>
    );
  }

  return (
    <VStack w={'full'}>
      <Heading size="xl" marginBottom={6}>
        Trending News!
      </Heading>
      <List spacing={3}>
        {news.map((e: any) => {
          return (
            <Stack spacing={12} direction="column">
              <Feature title={e.title} desc={e.link} />
            </Stack>
          );
        })}
      </List>
    </VStack>
  );
};

export default Home;
