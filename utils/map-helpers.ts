// Utility to normalize state names for map matching
// This handles common discrepancies between our data and typical Map/TopoJSON data

export function normalizeStateName(name: string): string {
  if (!name) return "";
  
  const lower = name.toLowerCase().trim();

  // Map of common variations to our standard names
  const mappings: Record<string, string> = {
    "orissa": "odisha",
    "uttaranchal": "uttarakhand",
    "jammu & kashmir": "jammu and kashmir",
    "andaman & nicobar islands": "andaman and nicobar islands",
    "dadra & nagar haveli": "dadra and nagar haveli and daman and diu",
    "daman & diu": "dadra and nagar haveli and daman and diu",
    // Add more as discovered during testing
  };

  if (mappings[lower]) {
    return mappings[lower];
  }

  // Basic normalization: remove special chars, extra spaces, '&' -> 'and'
  return lower.replace(/&/g, "and").replace(/[^a-z0-9\s]/g, "");
}

// Helper to check if a map feature name matches a target state
// We normalize both sides
export function isStateMatch(mapName: string, targetName: string): boolean {
    const nMap = normalizeStateName(mapName);
    const nTarget = normalizeStateName(targetName);
    return nMap === nTarget; 
}

