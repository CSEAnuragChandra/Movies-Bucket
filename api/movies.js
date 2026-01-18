export default async function handler(req, res) {
  const query = req.query.q || "avengers";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}&type=movie&page=1`
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
