/**
 * samplePosts.js
 * ---------------
 * Mock data for the social feed. Each post object includes user info,
 * content, optional images (0-4), and engagement counts.
 * This data drives the PostCard components in the feed.
 */

const samplePosts = [
  {
    id: 1,
    /* -- User Information -- */
    displayName: 'Ramswaroop',
    username: '@chauhazz53',
    timestamp: 'Tue, 24 Mar, 2026, 12:14:52 pm',
    avatarColor: '#ff7043', // Fallback color when no avatar image is used

    /* -- Post Content -- */
    content:
      'LEADERBOARD ACHIEVEMENT -- I secured rank in TaskPlanet Leaderboard! Play now and join the competition!',
    hashtags: ['#TaskPlanet', '#Leaderboard', '#Winning'],

    /* -- Attached images (0-4 allowed per post) -- */
    images: [
      'https://picsum.photos/seed/post1a/400/300',
      'https://picsum.photos/seed/post1b/400/300',
    ],

    /* -- Engagement Metrics -- */
    likes: 3,
    comments: 41,
    shares: 0,
  },
  {
    id: 2,
    displayName: 'Chaitali Pal',
    username: '@pal6qp5',
    timestamp: 'Tue, 24 Mar, 2026, 11:25:58 am',
    avatarColor: '#ab47bc',

    content:
      'LEADERBOARD ACHIEVEMENT -- I secured rank in TaskPlanet Leaderboard! Play now and join the competition!',
    hashtags: ['#TaskPlanet', '#Leaderboard', '#Winning'],

    /* Four images: demonstrates the 2x2 grid layout */
    images: [
      'https://picsum.photos/seed/post2a/400/300',
      'https://picsum.photos/seed/post2b/400/300',
      'https://picsum.photos/seed/post2c/400/300',
      'https://picsum.photos/seed/post2d/400/300',
    ],

    likes: 12,
    comments: 8,
    shares: 2,
  },
  {
    id: 3,
    displayName: 'Arjun Mehta',
    username: '@arjun_m',
    timestamp: 'Mon, 23 Mar, 2026, 9:05:30 am',
    avatarColor: '#26a69a',

    /* Text-only post: no images attached */
    content:
      'Just completed 30 days of daily coding challenges. Consistency is the real superpower. Keep pushing forward, everyone!',
    hashtags: ['#CodingChallenge', '#Consistency', '#Growth'],

    images: [],

    likes: 25,
    comments: 7,
    shares: 4,
  },
];

export default samplePosts;
