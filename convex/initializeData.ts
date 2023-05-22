import { mutation } from "./_generated/server";

export default mutation(async ({ db }) => {
  const luke = await db.insert("Human", {
    type: "Human",
    id: "",
    friends: [],
    name: "Luke Skywalker",
    appearsIn: [4, 5, 6],
    homePlanet: "Tatooine",
  });
  await db.patch(luke, {
    id: luke.id,
  });

  const vader = await db.insert("Human", {
    type: "Human",
    id: "",
    friends: [],
    name: "Darth Vader",
    appearsIn: [4, 5, 6],
    homePlanet: "Tatooine",
  });
  await db.patch(vader, {
    id: vader.id,
  });

  const han = await db.insert("Human", {
    type: "Human",
    id: "",
    friends: [],
    name: "Han Solo",
    appearsIn: [4, 5, 6],
  });
  await db.patch(han, {
    id: han.id,
  });

  const leia = await db.insert("Human", {
    type: "Human",
    id: "",
    friends: [],
    name: "Leia Organa",
    appearsIn: [4, 5, 6],
    homePlanet: "Alderaan",
  });
  await db.patch(leia, {
    id: leia.id,
  });

  const tarkin = await db.insert("Human", {
    type: "Human",
    id: "",
    friends: [],
    name: "Wilhuff Tarkin",
    appearsIn: [4],
  });
  await db.patch(tarkin, {
    id: tarkin.id,
  });

  const threepio = await db.insert("Droid", {
    type: "Droid",
    id: "",
    friends: [],
    name: "C-3PO",
    appearsIn: [4, 5, 6],
    primaryFunction: "Protocol",
  });
  await db.patch(threepio, {
    id: threepio.id,
  });

  const artoo = await db.insert("Droid", {
    type: "Droid",
    id: "",
    friends: [],
    name: "R2-D2",
    appearsIn: [4, 5, 6],
    primaryFunction: "Astromech",
  });
  await db.patch(artoo, {
    id: artoo.id,
  });

  await db.patch(luke, {
    friends: [han, leia, threepio, artoo],
  });
  await db.patch(vader, {
    friends: [tarkin],
  });
  await db.patch(han, {
    friends: [luke, leia, artoo],
  });
  await db.patch(leia, {
    friends: [luke, han, threepio, artoo],
  });
  await db.patch(tarkin, {
    friends: [vader],
  });
  await db.patch(threepio, {
    friends: [luke, han, leia, artoo],
  });
  await db.patch(artoo, {
    friends: [luke, han, leia],
  });
});
