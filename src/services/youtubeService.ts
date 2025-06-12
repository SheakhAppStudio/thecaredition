/**
 * YouTube API Service
 * 
 * This service handles fetching data from YouTube's API for The Car Edition channel
 */

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyAbhBxL7-c6NJJQP419djS-95YYSD3NVNI';
const CHANNEL_ID = 'UCj8QxUrDgfMmmwafBdc28Bg'; // The Car Edition Ltd channel ID

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  videoUrl: string;
}

/**
 * Fetches videos from The Car Edition YouTube channel
 */
export async function getYouTubeVideos(maxResults: number = 9): Promise<YouTubeVideo[]> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key is missing. Using fallback data.');
      return getFallbackVideos();
    }
    
    // First get video IDs from search
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults * 2}&type=video`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API search error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Then get video details to filter out shorts
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails&maxResults=${maxResults}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter out shorts (videos with duration less than 61 seconds)
    const nonShortVideos = data.items.filter((item: any) => {
      const duration = item.contentDetails.duration;
      // Parse ISO 8601 duration format
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!match) return false;
      
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // Consider videos longer than 60 seconds as regular videos (not shorts)
      return totalSeconds > 60;
    }).slice(0, maxResults); // Limit to requested number of results
    
    return nonShortVideos.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : 
                (item.snippet.thumbnails.medium ? item.snippet.thumbnails.medium.url : 
                 item.snippet.thumbnails.default.url),
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getFallbackVideos();
  }
}

/**
 * Provides fallback video data when API is unavailable
 */
function getFallbackVideos(): YouTubeVideo[] {
  return [
    {
      id: 'vCDDYb_M2B4',
      title: 'The Car Edition - Ceramic Coating Process',
      description: 'Watch our professional ceramic coating process that provides long-lasting protection for your vehicle.',
      publishedAt: '2025-01-15T10:00:00Z',
      thumbnail: 'https://i.ytimg.com/vi/vCDDYb_M2B4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=vCDDYb_M2B4'
    },
    {
      id: 'YQm9_h_t4y8',
      title: 'Premium Car Detailing at The Car Edition',
      description: 'Experience our premium car detailing services that will transform your vehicle inside and out.',
      publishedAt: '2025-02-20T14:30:00Z',
      thumbnail: 'https://i.ytimg.com/vi/YQm9_h_t4y8/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=YQm9_h_t4y8'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Paint Protection Film Installation - The Car Edition',
      description: 'Our expert technicians demonstrate the process of installing premium paint protection film.',
      publishedAt: '2025-03-10T09:15:00Z',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 'LXb3EKWsInQ',
      title: 'Interior Detailing Process - The Car Edition',
      description: 'See how we restore and protect vehicle interiors to showroom condition with our detailed process.',
      publishedAt: '2025-04-05T11:45:00Z',
      thumbnail: 'https://i.ytimg.com/vi/LXb3EKWsInQ/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'Car Wrapping Transformation - Before and After',
      description: 'Watch this amazing transformation as we wrap a vehicle with premium vinyl wrap.',
      publishedAt: '2025-04-25T13:20:00Z',
      thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    },
    {
      id: 'QH2-TGUlwu4',
      title: 'Wheel Restoration and Customization - The Car Edition',
      description: 'Our wheel restoration and customization services can transform your wheels and enhance your vehicle\'s appearance.',
      publishedAt: '2025-05-10T16:00:00Z',
      thumbnail: 'https://i.ytimg.com/vi/QH2-TGUlwu4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4'
    }
  ];
}
