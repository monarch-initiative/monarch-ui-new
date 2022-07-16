import { useQuery } from "./../../src/util/composables";
import { sleep } from "@/util/debug";

/** useQuery tests */

/** mocked func to count calls inside api calls */
const mock = jest.fn();

/** simulated api call */
const apiCall = async ({ wait = 10, data = "", error = "" } = {}) => {
  await sleep(wait);
  if (error) throw new Error(error);
  mock();
  return data;
};

test("Query function calls", async () => {
  const { query } = useQuery(apiCall, "");
  await query();
  await query();
  await query();
  expect(mock.mock.calls.length).toBe(3);
});

test("Statuses work", async () => {
  const { query, isLoading, isError, isSuccess } = useQuery(apiCall, "");

  expect(isLoading.value).toBe(false);
  expect(isError.value).toBe(false);
  expect(isSuccess.value).toBe(false);

  query();

  expect(isLoading.value).toBe(true);
  expect(isError.value).toBe(false);
  expect(isSuccess.value).toBe(false);

  await sleep(20);

  expect(isLoading.value).toBe(false);
  expect(isError.value).toBe(false);
  expect(isSuccess.value).toBe(true);

  query({ error: "dummy error" });

  expect(isLoading.value).toBe(true);
  expect(isError.value).toBe(false);
  expect(isSuccess.value).toBe(false);

  await sleep(20);

  expect(isLoading.value).toBe(false);
  expect(isError.value).toBe(true);
  expect(isSuccess.value).toBe(false);
});

test("Data and default value works", async () => {
  const { query, data } = useQuery(apiCall, "");

  expect(data.value).toBe("");

  query({ data: "dummy data" });
  expect(data.value).toBe("");
  await sleep(20);
  expect(data.value).toBe("dummy data");

  query({ data: "dummy data", error: "dummy error" });
  expect(data.value).toBe("");
  await sleep(20);
  expect(data.value).toBe("");
});

test("Handles race conditions and calls success func", async () => {
  const onSuccess = jest.fn();
  const { query, data } = useQuery(apiCall, "", onSuccess);

  query({ wait: 50, data: "first query" });
  query({ wait: 10, data: "second query" });

  await sleep(20);
  expect(data.value).toBe("second query");
  await sleep(100);
  expect(data.value).toBe("second query");

  expect(onSuccess.mock.calls.length).toBe(1);
  expect(onSuccess.mock.calls[0][0]).toBe("second query");
});
