import { ISubNav } from '../SubNav/SubNav';

const NAV_LINKS: ISubNav[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Mint',
    children: [
      {
        label: 'Article',
        subLabel: 'Mint your article',
        href: '/mintArticle',
        logo: 'token',
      },
      {
        label: 'Music',
        subLabel: 'Mint your music',
        href: '/mintAudio',
        logo: 'lazyNft',
      },
      {
        label: 'Video',
        subLabel: 'Mint your video',
        href: '/mintVideo',
        logo: 'pack',
      },
    ],
  },
  {
    label: 'Feed',
    href: '/feed',
  },
  {
    label: 'Profile',
    href: '/profile',
  },
];

export default NAV_LINKS;
