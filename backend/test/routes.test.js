const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const Artist = require('../models/Artist');

afterAll(async () => {
  await mongoose.disconnect();
});

describe("GET all artists", () => {
  it("should return all artists with status code 200", async () => {
    const response = await request(app).get("/artists");

    const artists = await Artist.find({}, {'__v': 0}).sort({payout_amount: -1});
    expect(artists).not.toBeNull();

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(artists));
  });
});

describe("GET a single artist by name", () => {
  it("should return one artist by the specified name", async () => {
    let artistName = "Diana Ross";
    const response = await request(app).get(`/artists?artist=${artistName}`);

    const artist = await Artist.findOne({ artist: artistName });
    expect(artist).not.toBeNull();

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(artist));
  });
});

describe("GET a single artist by id", () => {
  it("should return one artist specified by the given id", async () => {
    let artistName = "Diana Ross";
    const getArtist = await request(app).get(`/artists?artist=${artistName}`);
    const response = await request(app).get(`/artists/${getArtist.body._id}`);

    const artist = await Artist.findOne({ _id: getArtist.body._id });
    expect(artist).not.toBeNull();

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(artist));
  });
});

describe("POST (create) a new artist", () => {
    it("should create a new artist with the given payload", async () => {
      const response = await request(app).post("/artists").send({
        artist: "John Allen",
        rate: 0.004,
        streams: 300000,
      });

      const artist = await Artist.findOne({ artist: "John Allen" });
      expect(artist).not.toBeNull();

      expect(response.status).toBe(201);
      expect(response.body.artist).toEqual(artist.artist);
    });
});

describe("PATCH (update) an artist", () => {
    it("should update an artist based on the given payload i.e. rate", async () => {
      const validArtist = await Artist.findOne({ artist: "John Allen" });

      await request(app).patch(`/artists/${validArtist._id}`).send({
        rate: 0.005
      }).expect(200);

      const artist = await Artist.findOne({ _id: validArtist._id });
      expect(artist).not.toBeNull();

      expect(artist.rate).toEqual(0.005);
    });
});

describe("DELETE an artist", () => {
    it("should return one artist", async () => {
      const validArtist = await Artist.findOne({ artist: "John Allen" });

      const response = await request(app).delete(`/artists/${validArtist._id}`);

      const artist = await Artist.findOne({ _id: validArtist._id });
      expect(artist).toBeNull();

      expect(response.status).toBe(200);
    });
});