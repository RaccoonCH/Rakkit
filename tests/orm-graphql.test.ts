import "reflect-metadata";
import { createConnection } from "typeorm";
import { TypeormInterface } from "./../src/logic";
import { Test } from "./class";

const testInstances = [];
const getTestText = (num) => `Test ${num}`;

for (let i = 0; i < 10; i++) {
  testInstances.push(new Test(getTestText(i + 1), i));
}

beforeAll(async () => {
  try {
    await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "RakkitTests",
      synchronize: true,
      entities: [
        Test
      ]
    });

    await Test.clear();

    await Promise.all(
      testInstances.map(
        (test: Test) => test.save()
      )
    );
  } catch (err) {
    console.log(err);
  }
});

/*
const testOrmInterface = new OrmInterface(Test);

test("Get all entries", async () => {
  const query = testOrmInterface.ComposeQuery({});
  expect(await query.getCount()).toEqual(testInstances.length);
});

test("Get entries with AND where conditions", async () => {
  const query = testOrmInterface.ComposeQuery({
    Text: getTestText(1)
  });
  expect(await query.getMany()).toEqual([testInstances[0]]);
});

test("Get entries with OR where conditions", async () => {
  const query = testOrmInterface.ComposeQuery(
    { Text: "Test 1", Index: 1 }, { conditionOperator: "or", orderBy: { field: "Index", direction: "ASC" } }
  );
  expect(await query.getMany()).toEqual(testInstances.slice(0, 2));
});

test("Get last entry of a set in specific order", async () => {
  const query = testOrmInterface.ComposeQuery({}, {
    orderBy: {
      field: "Index",
      direction: "DESC"
    },
    last: 1
  });
  expect((await query.getMany())[0].Index).toEqual(0);
});

test("Get first entry of a set in specific order", async () => {
  const query = testOrmInterface.ComposeQuery({}, {
    orderBy: {
      field: "Index",
      direction: "DESC"
    },
    first: 1
  });
  expect((await query.getMany())[0].Index).toEqual(testInstances.length - 1);
});
*/
