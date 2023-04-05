const API_URL = "http://localhost:3001";

//retrieve all artists
export const getArtists = async () => {
  const response = await fetch(`${API_URL}/artists`);
  const data = await response.json();

  return data;
};

//update an artist by id
export const updateArtist = async (id, payload) => {
  const response = await fetch(`${API_URL}/artists/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  return data;
};

//update an artist by artist name
export const updateArtistRate = async (artistName, payload) => {
  const fetchArtist = await fetch(`${API_URL}/artists?artist=${artistName}`);
  const artistId = await fetchArtist.json();

  const response = await fetch(`${API_URL}/artists/${artistId._id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
};

//create a new artist
export const createArtists = async (payload) => {
  const response = await fetch(`${API_URL}/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
};

//delete an artist
export const deleteArtists = async (id) => {
  const response = await fetch(`${API_URL}/artists/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};
