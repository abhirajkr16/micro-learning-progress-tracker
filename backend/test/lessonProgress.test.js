const prisma = require("./setup");

const lessonId = 1;
const learnerId = 1;

async function completeLesson() {
  try {
    return await prisma.lessonProgress.create({
      data: {
        learnerId,
        lessonId,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return null;
    }

    throw error;
  }
}

async function runTest() {
  console.log("Starting concurrent completion test...");

  // remove existing completion so the test starts clean
  await prisma.lessonProgress.deleteMany({
    where: {
      learnerId,
      lessonId,
    },
  });

  const requests = Array.from({ length: 10 }, () => completeLesson());

  await Promise.all(requests);

  const progressRecords = await prisma.lessonProgress.findMany({
    where: {
      learnerId,
      lessonId,
    },
  });

  console.log(`Completion rows found: ${progressRecords.length}`);

  if (progressRecords.length !== 1) {
    throw new Error(
      `Concurrency test failed. Expected 1 row but found ${progressRecords.length}`,
    );
  }

  console.log("Concurrency test passed.");
}

runTest()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
