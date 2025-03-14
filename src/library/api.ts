// Fetch all comics from the backend
export const fetchComics = async (): Promise<Comic[]> => {
  const response = await fetch("http://localhost:5000/api/comics");
  if (!response.ok) {
    throw new Error("Failed to fetch comics");
  }
  return response.json();
};

// Define the Comic type
export type Comic = {
  id: number;
  title: string;
  author: string;
  pages: number;
  imagePages: { pageNumber: number; imageURL: string }[];
};