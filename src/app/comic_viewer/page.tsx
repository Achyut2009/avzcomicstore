"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Comic = {
  id: number;
  title: string;
  author: string;
  pages: number;
};

export default function ComicViewer() {
  const searchParams = useSearchParams();
  const comicId = searchParams.get("comicId");
  const [comic, setComic] = useState<Comic | null>(null);

  // Fetch comic data based on ID
  useEffect(() => {
    const fetchComic = async () => {
      // Replace this with your actual API call or data fetching logic
      const dummyComics: Comic[] = [
        { id: 1, title: "Highly Flammable Chapter-1", author: "Viraj Pranshu", pages: 12 },
        { id: 2, title: "Highly Flammable Chapter-2", author: "Viraj Pranshu", pages: 12 },
        { id: 3, title: "Highly Flammable Chapter-3", author: "Viraj Pranshu", pages: 12 },
        { id: 4, title: "Highly Flammable Chapter-4", author: "Viraj Pranshu", pages: 12 },
        { id: 5, title: "Highly Flammable Chapter-5", author: "Viraj Pranshu", pages: 12 },
      ];

      const foundComic = dummyComics.find((c) => c.id === parseInt(comicId || ""));
      if (foundComic) {
        setComic(foundComic);
      } else {
        console.error("Comic not found");
      }
    };

    if (comicId) {
      fetchComic();
    }
  }, [comicId]);

  if (!comic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 mx-4">
      {/* Container for Comic Content */}
      <div className="max-w-4xl mx-auto">
        {/* Comic Title and Author */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{comic.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">By {comic.author}</p>
        </div>

        {/* Comic Pages */}
        <div className="space-y-6">
          {Array.from({ length: comic.pages }, (_, i) => (
            <div key={i} className="shadow-lg rounded-lg overflow-hidden">
              <img
                src={`/comics/${comic.id}/${i}.jpg`} // Updated path to match your naming convention (0.jpg, 1.jpg, etc.)
                alt={`Page ${i + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}