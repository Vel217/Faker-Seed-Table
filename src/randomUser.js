import { faker } from "@faker-js/faker";

function removeSymbol({ value, seed }) {
  faker.seed(seed);
  const arrayOfIndex = Array.from({ length: value.length }, (_, idx) => idx);
  const indexForRemove = faker.helpers.arrayElement(arrayOfIndex);
  return (
    value.substring(0, indexForRemove) + value.substring(indexForRemove + 1)
  );
}

function addSymbol({ value, locale, seed }) {
  faker.seed(seed);
  faker.locale = locale;
  const randomSymbol = faker.random.alphaNumeric();
  const arrayOfIndex = Array.from({ length: value.length }, (_, idx) => idx);
  const indexForAddSymbol = faker.helpers.arrayElement(arrayOfIndex);
  return (
    value.substring(0, indexForAddSymbol) +
    randomSymbol +
    value.substring(indexForAddSymbol)
  );
}

function replaceSymbol({ value, seed }) {
  faker.seed(seed);
  const arrayOfIndex = Array.from({ length: value.length }, (_, idx) => idx);
  const indexForReplace = faker.helpers.arrayElements(arrayOfIndex, 2);
  const firstIndexForReplace = indexForReplace[0];
  const secondIndexForReplace = indexForReplace[1];
  const firstSymbol = value[firstIndexForReplace];
  const secondSymbol = value[secondIndexForReplace];

  let result =
    value.substring(0, firstIndexForReplace) +
    secondSymbol +
    value.substring(firstIndexForReplace + 1);
  result =
    result.substring(0, secondIndexForReplace) +
    firstSymbol +
    result.substring(secondIndexForReplace + 1);

  return result;
}

function getCountOfErrors({ errorProbability, seed }) {
  faker.seed(seed);

  const intProbability = Math.floor(+errorProbability);

  const isFloatNumber = errorProbability - intProbability !== 0;
  const shouldBeError = faker.helpers.maybe(() => true, {
    probability: errorProbability,
  });
  if (isFloatNumber && shouldBeError) {
    return intProbability + 1;
  }
  return errorProbability;
}

function getFieldForError({ user, seed }) {
  faker.seed(seed);
  return faker.helpers.objectKey(user);
}

function getFuncForError({ seed }) {
  faker.seed(seed);
  const numberOfFunc = faker.helpers.arrayElement([0, 1, 2]);

  switch (numberOfFunc) {
    case 0:
      return removeSymbol;
    case 1:
      return addSymbol;
    case 2:
    default:
      return replaceSymbol;
  }
}

function createUser({ seed, locale = "en", errorProbability, ordinalNumber }) {
  const newUser = createRandomUser(seed, locale);
  const countOfErrors = getCountOfErrors({ errorProbability, seed });

  if (!!countOfErrors) {
    for (let i = 0; i <= countOfErrors; i++) {
      const seedForErrorFunc = seed + ordinalNumber + i;

      const fieldForError = getFieldForError({
        user: newUser,
        seed: seedForErrorFunc,
      });

      const funcForError = getFuncForError({ seed: seedForErrorFunc });

      newUser[fieldForError] = funcForError({
        value: newUser[fieldForError],
        locale,
        seed: seedForErrorFunc,
      });
    }
  }

  return newUser;
}

function createRandomUser(seed, locale = "en") {
  faker.seed(seed);
  faker.locale = locale;

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = firstName + " " + lastName;

  const city = faker.address.city();
  const buildNumber = faker.address.buildingNumber();
  const streetName = faker.address.street();

  const fullAddress = city + ", " + streetName + ", " + buildNumber;
  const phone = faker.phone.number();

  return {
    key: faker.datatype.uuid(),
    name: fullName,
    address: fullAddress,
    phone: phone,
  };
}

export const generateUsers = ({
  customValue,
  page,
  lang,
  size,
  errorProbability,
}) => {
  const newUsers = [];
  for (let i = 0; i < size; i++) {
    const seed = page + i + 1 + customValue;
    const user = createUser({
      seed,
      locale: lang,
      errorProbability,
      ordinalNumber: i,
    });
    newUsers.push(user);
  }
  return newUsers;
};
