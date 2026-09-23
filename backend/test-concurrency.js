const requests = Array.from({ length: 10 }, () =>
  fetch("http://localhost:5000/api/lessons/1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      learnerId: 1,
    }),
  }),
);

Promise.all(requests)
  .then(async (responses) => {
    const results = await Promise.all(
      responses.map(async (response) => ({
        status: response.status,
        body: await response.json(),
      })),
    );

    console.log(JSON.stringify(results, null, 2));
  })
  .catch((error) => {
    console.error(error);
  });
