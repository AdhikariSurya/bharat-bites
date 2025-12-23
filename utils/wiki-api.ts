// Utility to fetch the main image from Wikipedia API
export async function fetchWikiImage(wikiTitle: string): Promise<string | null> {
  try {
    // Extract title if a full URL is passed
    const title = wikiTitle.split('/').pop() || wikiTitle;
    
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Prefer original image, fallback to thumbnail
    return data.originalimage?.source || data.thumbnail?.source || null;
  } catch (error) {
    console.error("Error fetching wiki image:", error);
    return null;
  }
}

