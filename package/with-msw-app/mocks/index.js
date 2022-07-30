console.log("----------------------1");
async function initMocks() {
  console.log("----------------------2");
  if (typeof window === "undefined") {
    console.log("----------------------3");
    const { server } = await import("./server");
    server.listen();
    console.log("----------------------4");
  } else {
    console.log("----------------------5");
    const { worker } = await import("./browser");
    worker.start();
    console.log("----------------------6");
  }
}

initMocks();
console.log("----------------------7");
